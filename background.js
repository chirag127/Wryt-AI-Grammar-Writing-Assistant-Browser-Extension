/**
 * Wryt - AI Writing & Grammar Checker - Background Script
 * Implements "Waterfall" Failover Logic for LLM APIs.
 */

// Default Configuration with Expanded Models
const DEFAULT_CONFIG = {
    providers: [
        {
            id: "gemini",
            name: "Google Gemini",
            enabled: true,
            priority: 1,
            apiKey: "",
            model: "gemini-2.0-flash",
            endpoint:
                "https://generativelanguage.googleapis.com/v1beta/models/[MODEL_ID]:generateContent",
            availableModels: [
                "gemini-2.0-pro-exp-02-05",
                "gemini-2.0-flash",
                "gemini-2.0-flash-lite-preview-02-05",
                "gemini-1.5-flash",
                "gemini-1.5-flash-8b",
                "gemini-1.5-pro",
            ],
        },
        {
            id: "groq",
            name: "Groq",
            enabled: true,
            priority: 2,
            apiKey: "",
            model: "llama-3.3-70b-versatile",
            endpoint: "https://api.groq.com/openai/v1/chat/completions",
            availableModels: [
                "llama-3.3-70b-versatile",
                "llama-3.1-8b-instant",
                "mixtral-8x7b-32768",
                "gemma2-9b-it",
            ],
        },
        {
            id: "cerebras",
            name: "Cerebras",
            enabled: false,
            priority: 3,
            apiKey: "",
            model: "llama3.1-8b",
            endpoint: "https://api.cerebras.ai/v1/chat/completions",
            availableModels: ["llama3.1-8b", "llama3.1-70b"],
        },
        {
            id: "sambanova",
            name: "SambaNova",
            enabled: false,
            priority: 4,
            apiKey: "",
            model: "Meta-Llama-3.1-8B-Instruct",
            endpoint: "https://api.sambanova.ai/v1/chat/completions",
            availableModels: [
                "Meta-Llama-3.1-8B-Instruct",
                "Meta-Llama-3.1-70B-Instruct",
                "Meta-Llama-3.1-405B-Instruct",
                "Qwen2.5-72B-Instruct",
                "Qwen2.5-Coder-32B-Instruct",
                "DeepSeek-R1",
                "DeepSeek-R1-Distill-Llama-70B",
            ],
        },
        {
            id: "openrouter",
            name: "OpenRouter",
            enabled: true,
            priority: 5,
            apiKey: "",
            model: "meta-llama/llama-3.2-3b-instruct:free",
            endpoint: "https://openrouter.ai/api/v1/chat/completions",
            availableModels: [
                "meta-llama/llama-3.2-3b-instruct:free",
                "meta-llama/llama-3.1-8b-instruct:free",
                "google/gemini-2.0-flash-lite-preview-02-05:free",
                "google/gemini-2.0-pro-exp-02-05:free",
                "deepseek/deepseek-r1:free",
                "deepseek/deepseek-r1-distill-llama-70b:free",
                "qwen/qwen-2.5-coder-32b-instruct:free",
            ],
        },
    ],
    preferences: {
        tone: "neutral",
        dialect: "us",
    },
};

// Initialize Storage on Install
chrome.runtime.onInstalled.addListener(async () => {
    const { config } = await chrome.storage.sync.get("config");
    if (!config) {
        await chrome.storage.sync.set({ config: DEFAULT_CONFIG });
        console.log("Wryt: Default configuration initialized.");
    } else {
        // Merge new providers/models into existing config if needed
        const updatedProviders = DEFAULT_CONFIG.providers.map((defProvider) => {
            const existing = config.providers.find(
                (p) => p.id === defProvider.id
            );
            if (existing) {
                return {
                    ...defProvider,
                    ...existing,
                    availableModels: defProvider.availableModels,
                };
            }
            return defProvider;
        });
        await chrome.storage.sync.set({
            config: { providers: updatedProviders },
        });
    }

    // Create Context Menu
    chrome.contextMenus.create({
        id: "check-grammar",
        title: "Check Grammar & Spelling",
        contexts: ["selection"],
    });
});

// Context Menu Handler
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "check-grammar" && info.selectionText) {
        chrome.tabs.sendMessage(tab.id, {
            action: "contextMenuCheck",
            text: info.selectionText,
        });
    }
});

// Main Message Handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkGrammar") {
        handleGrammarCheck(request.text)
            .then((response) => sendResponse(response))
            .catch((error) => sendResponse({ error: error.message }));
        return true;
    }
    if (request.action === "testConnection") {
        testProviderConnection(
            request.providerId,
            request.apiKey,
            request.model
        )
            .then((response) => sendResponse(response))
            .catch((error) =>
                sendResponse({ success: false, error: error.message })
            );
        return true;
    }
    if (request.action === "openOptions") {
        chrome.runtime.openOptionsPage();
        return true;
    }
});

// Waterfall Logic
async function handleGrammarCheck(text) {
    const { config } = await chrome.storage.sync.get("config");
    if (!config || !config.providers)
        throw new Error("Configuration not loaded.");

    const activeProviders = config.providers
        .filter((p) => p.enabled && p.apiKey)
        .sort((a, b) => a.priority - b.priority);

    if (activeProviders.length === 0) {
        return {
            error: "No active providers configured. Please add API keys in Options.",
        };
    }

    let lastError = null;

    for (const provider of activeProviders) {
        try {
            console.log(
                `Attempting provider: ${provider.name} (${provider.model})`
            );
            const result = await callProviderApi(provider, text);
            return {
                ...result,
                provider: provider.name,
                model: provider.model,
            };
        } catch (error) {
            console.warn(`Provider ${provider.name} failed:`, error);
            lastError = error;
        }
    }

    throw new Error(
        `All providers failed. Last error: ${
            lastError?.message || "Unknown error"
        }`
    );
}

// Generic API Caller
async function callProviderApi(provider, text) {
    switch (provider.id) {
        case "gemini":
            return await callGemini(provider, text);
        case "groq":
        case "cerebras":
        case "sambanova":
        case "openrouter":
            return await callOpenAICompatible(provider, text);
        default:
            throw new Error(`Unknown provider type: ${provider.id}`);
    }
}

// Gemini Handler
async function callGemini(provider, text) {
    const url =
        provider.endpoint.replace("[MODEL_ID]", provider.model) +
        `?key=${provider.apiKey}`;

    const { config } = await chrome.storage.sync.get("config");
    const tone = config?.preferences?.tone || "neutral";
    const dialect = config?.preferences?.dialect || "us";

    const toneMap = {
        formal: "Formal and professional",
        casual: "Casual and conversational",
        neutral: "Neutral",
    };

    const dialectMap = {
        us: "US English spelling and conventions",
        uk: "UK English spelling and conventions",
        ca: "Canadian English spelling and conventions",
    };

    const prompt = `
    You are an expert grammar and style editor.
    Analyze the following text and provide corrections for grammar, spelling, punctuation, clarity, and tone.

    **Writing Preferences:**
    - Tone: ${toneMap[tone]}
    - Dialect: ${dialectMap[dialect]}

    Return a JSON object with the following structure:
    {
        "correctedText": "The fully corrected text",
        "changes": [
            {
                "type": "grammar" | "spelling" | "punctuation" | "clarity" | "tone",
                "original": "The original text segment",
                "replacement": "The replacement text",
                "explanation": "Why this change was made"
            }
        ]
    }

    Text: "${text}"
  `;

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { response_mime_type: "application/json" },
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
            `Gemini API Error: ${response.status} - ${JSON.stringify(
                errorData
            )}`
        );
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) throw new Error("Gemini returned empty response.");

    try {
        return JSON.parse(rawText);
    } catch (e) {
        console.error("Failed to parse Gemini JSON:", rawText);
        // Fallback for non-JSON response
        return { correctedText: rawText.trim(), changes: [] };
    }
}

// OpenAI-Compatible Handler
async function callOpenAICompatible(provider, text) {
    const { config } = await chrome.storage.sync.get("config");
    const tone = config?.preferences?.tone || "neutral";
    const dialect = config?.preferences?.dialect || "us";

    const toneMap = {
        formal: "Formal and professional",
        casual: "Casual and conversational",
        neutral: "Neutral",
    };

    const dialectMap = {
        us: "US English spelling and conventions",
        uk: "UK English spelling and conventions",
        ca: "Canadian English spelling and conventions",
    };

    const prompt = `
    You are an expert grammar and style editor.
    Analyze the following text and provide corrections for grammar, spelling, punctuation, clarity, and tone.

    **Writing Preferences:**
    - Tone: ${toneMap[tone]}
    - Dialect: ${dialectMap[dialect]}

    Return a JSON object with the following structure:
    {
        "correctedText": "The fully corrected text",
        "changes": [
            {
                "type": "grammar" | "spelling" | "punctuation" | "clarity" | "tone",
                "original": "The original text segment",
                "replacement": "The replacement text",
                "explanation": "Why this change was made"
            }
        ]
    }

    Text: "${text}"
  `;

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provider.apiKey}`,
    };

    if (provider.id === "openrouter") {
        headers["HTTP-Referer"] = "https://github.com/chirag127/Wryt";
        headers["X-Title"] = "Wryt";
    }

    const response = await fetch(provider.endpoint, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            model: provider.model,
            messages: [
                {
                    role: "system",
                    content:
                        "You are a helpful grammar assistant. You MUST return valid JSON.",
                },
                { role: "user", content: prompt },
            ],
            temperature: 0.3,
            response_format: { type: "json_object" },
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
            `${provider.name} API Error: ${response.status} - ${JSON.stringify(
                errorData
            )}`
        );
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content;

    if (!rawText) throw new Error(`${provider.name} returned empty response.`);

    try {
        return JSON.parse(rawText);
    } catch (e) {
        console.error(`Failed to parse ${provider.name} JSON:`, rawText);
        return { correctedText: rawText.trim(), changes: [] };
    }
}

// Test Connection
async function testProviderConnection(providerId, apiKey, model) {
    const { config } = await chrome.storage.sync.get("config");
    const provider = config.providers.find((p) => p.id === providerId);

    if (!provider) return { success: false, error: "Provider not found" };

    const testProvider = {
        ...provider,
        apiKey: apiKey,
        model: model || provider.model,
    };

    try {
        await callProviderApi(testProvider, "Hello world");
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

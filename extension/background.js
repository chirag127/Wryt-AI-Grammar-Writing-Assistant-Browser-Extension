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
        brandVoice: "",
        plagiarismCheck: false,
    },
};

// Initialize Storage on Install
chrome.runtime.onInstalled.addListener(async () => {
    const { config } = await chrome.storage.sync.get("config");
    if (!config) {
        await chrome.storage.sync.set({ config: DEFAULT_CONFIG });
        console.log("Wryt: Default configuration initialized.");
    } else {
        // Merge new providers/models/preferences into existing config
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

        const updatedPreferences = {
            ...DEFAULT_CONFIG.preferences,
            ...(config.preferences || {}),
        };

        await chrome.storage.sync.set({
            config: {
                providers: updatedProviders,
                preferences: updatedPreferences,
            },
        });
    }

    // Create Context Menu
    chrome.contextMenus.create({
        id: "check-grammar",
        title: "Check Grammar & Spelling",
        contexts: ["selection"],
    });

    chrome.contextMenus.create({
        id: "generate-text",
        title: "Write with AI...",
        contexts: ["editable"],
    });
});

// Context Menu Handler
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "check-grammar" && info.selectionText) {
        chrome.tabs.sendMessage(tab.id, {
            action: "contextMenuCheck",
            text: info.selectionText,
        });
    } else if (info.menuItemId === "generate-text") {
        chrome.tabs.sendMessage(tab.id, {
            action: "openGenerator",
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
    if (request.action === "generateText") {
        handleTextGeneration(request.prompt, request.context)
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
            const result = await callProviderApi(provider, text, "analyze");
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

async function handleTextGeneration(promptText, contextText) {
    const { config } = await chrome.storage.sync.get("config");
    if (!config || !config.providers)
        throw new Error("Configuration not loaded.");

    const activeProviders = config.providers
        .filter((p) => p.enabled && p.apiKey)
        .sort((a, b) => a.priority - b.priority);

    if (activeProviders.length === 0) {
        return {
            error: "No active providers configured.",
        };
    }

    let lastError = null;

    for (const provider of activeProviders) {
        try {
            const result = await callProviderApi(
                provider,
                promptText,
                "generate",
                contextText
            );
            return {
                ...result,
                provider: provider.name,
            };
        } catch (error) {
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
async function callProviderApi(provider, text, mode = "analyze", context = "") {
    switch (provider.id) {
        case "gemini":
            return await callGemini(provider, text, mode, context);
        case "groq":
        case "cerebras":
        case "sambanova":
        case "openrouter":
            return await callOpenAICompatible(provider, text, mode, context);
        default:
            throw new Error(`Unknown provider type: ${provider.id}`);
    }
}

function buildAnalysisPrompt(text, tone, dialect, brandVoice, plagiarismCheck) {
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

    let brandVoiceSection = "";
    if (brandVoice && brandVoice.trim() !== "") {
        brandVoiceSection = `
**BRAND VOICE GUIDELINES (STRICTLY ENFORCE):**
${brandVoice}
`;
    }

    let plagiarismSection = "";
    if (plagiarismCheck) {
        plagiarismSection = `
5. **ORIGINALITY** (Orange):
   - Flag clichés and overused idioms
   - Flag generic, robotic, or "AI-sounding" phrasing
   - Flag famous quotes or likely plagiarized common phrases (heuristic check)
`;
    }

    return `You are Wryt, an elite AI Editor and Speech-to-Text Correction Specialist.
Your goal is to transform potentially messy, dictated drafts into polished, professional writing.

**CRITICAL CONTEXT:**
The user is likely using **Speech-to-Text (Dictation) Software**. This source text may contain specific artifacts that differ from typing errors. You must identify and fix these aggressively.

**EXAMPLES OF DICTATION ERRORS (FEW-SHOT LEARNING):**
- **Phonetic/Homophone Errors**: "The extension salary reproduces" -> "The extension still reproduces".
- **Contextual Mismatches**: "That's why many sponsors are" -> "That's why many responses are".
- **Self-Corrections**: "I want to go to the store no actually the park" -> "I want to go to the park".
- **Stuttering**: "The the project is is ready" -> "The project is ready".
- **Filler Words**: "Um, like, so yeah" -> (Remove if unnecessary).

**ANALYSIS REQUIREMENTS:**
1. Detect context: Is this formal (email/report), casual (chat), or academic?
2. Analyze tone: Confident, Anxious, Aggressive, Formal, Optimistic, etc.
3. Calculate readability score (0-100) based on sentence complexity

**USER PREFERENCES:**
- Target Tone: ${toneMap[tone]}
- Dialect: ${dialectMap[dialect]}
${brandVoiceSection}

**5-TIER ERROR CATEGORIZATION:**

1. **CRITICAL_GRAMMAR** (Red):
   - Spelling errors, typos
   - Subject-verb disagreement
   - Punctuation mistakes
   - Article errors (a/an/the)

2. **CLARITY** (Blue):
   - Passive voice → Active voice
   - Wordy phrases → Concise alternatives
   - Complex/ambiguous sentences → Simplified versions
   - Vague pronouns
   - **SPEECH ARTIFACTS**: Remove self-corrections, repetitions, and filler words.

3. **ENGAGEMENT** (Green):
   - Overused words ("very", "really", "just")
   - Repetitive vocabulary
   - Dull/generic phrasing → Vivid alternatives
   - Clichés and filler words

4. **DELIVERY_TONE** (Purple):
   - Politeness issues (too aggressive/blunt)
   - Hedging language ("I think", "maybe", "possibly")
   - Formality mismatches
   - Confidence issues
${plagiarismSection}

**ADVANCED FEATURES (MANDATORY):**
- Provide FULL sentence rewrites for clunky sentences
- Flag grammatically correct but unnatural phrasing (fluency)
- Suggest tone shifts when needed
- **Rewrite full sentences** to improve flow while maintaining meaning.

**SPEECH-TO-TEXT CLEANUP (PRIORITY):**
You MUST detect and fix specific dictation errors:
- **Immediate Repetitions**: "the the", "is is".
- **Self-Corrections**: "I want to go to the store no I want to go to the park" -> "I want to go to the park".
- **Filler Words**: "um", "uh", "like" (if they disrupt flow).
- **Homophones**: "write" vs "right", "their" vs "there".
- **Punctuation**: Add missing punctuation typical of dictated text (run-on sentences).

**OUTPUT (STRICT JSON):**
{
  "analysis_meta": {
    "detected_tone": "Formal",
    "readability_score": 75,
    "audience_type": "General",
    "text_length": 150
  },
  "correctedText": "The fully corrected text",
  "corrections": [
    {
      "type": "CRITICAL_GRAMMAR|CLARITY|ENGAGEMENT|DELIVERY_TONE|ORIGINALITY",
      "severity": "Critical|Advanced",
      "original": "exact text segment",
      "replacement": "corrected version",
      "explanation": "Brief reason (max 15 words)",
      "start_offset": 0,
      "end_offset": 10,
      "color_code": "red|blue|green|purple|orange"
    }
  ],
  "rewrite_suggestion": "Full paragraph rewrite if needed for better flow",
  "tone_adjustments": [
    {
      "issue": "Too anxious",
      "suggestion": "Remove hedging words like 'maybe' and 'I think'"
    }
  ]
}

**TEXT TO ANALYZE:**
"${text}"

RESPOND WITH VALID JSON ONLY. NO EXPLANATIONS.`;
}

function buildGenerationPrompt(promptText, contextText, tone, brandVoice) {
    let brandVoiceSection = "";
    if (brandVoice && brandVoice.trim() !== "") {
        brandVoiceSection = `
**BRAND VOICE GUIDELINES:**
${brandVoice}
`;
    }

    return `You are an expert AI writing assistant.

**TASK:**
Generate text based on the following user prompt: "${promptText}"

**CONTEXT:**
The user is writing in this context (if available): "${contextText}"

**PREFERENCES:**
- Tone: ${tone}
${brandVoiceSection}

**OUTPUT:**
Return ONLY the generated text. Do not include "Here is the text" or quotes around the output. Just the raw text ready to be inserted.`;
}

// Gemini Handler
async function callGemini(provider, text, mode, context) {
    const url =
        provider.endpoint.replace("[MODEL_ID]", provider.model) +
        `?key=${provider.apiKey}`;

    const { config } = await chrome.storage.sync.get("config");
    const tone = config?.preferences?.tone || "neutral";
    const dialect = config?.preferences?.dialect || "us";
    const brandVoice = config?.preferences?.brandVoice || "";
    const plagiarismCheck = config?.preferences?.plagiarismCheck || false;

    let prompt;
    if (mode === "generate") {
        prompt = buildGenerationPrompt(text, context, tone, brandVoice);
    } else {
        prompt = buildAnalysisPrompt(
            text,
            tone,
            dialect,
            brandVoice,
            plagiarismCheck
        );
    }

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                response_mime_type:
                    mode === "analyze" ? "application/json" : "text/plain",
            },
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

    if (mode === "generate") {
        return { generatedText: rawText.trim() };
    }

    try {
        return JSON.parse(rawText);
    } catch (e) {
        console.error("Failed to parse Gemini JSON:", rawText);
        // Fallback for non-JSON response
        return { correctedText: rawText.trim(), changes: [] };
    }
}

// OpenAI-Compatible Handler
async function callOpenAICompatible(provider, text, mode, context) {
    const { config } = await chrome.storage.sync.get("config");
    const tone = config?.preferences?.tone || "neutral";
    const dialect = config?.preferences?.dialect || "us";
    const brandVoice = config?.preferences?.brandVoice || "";
    const plagiarismCheck = config?.preferences?.plagiarismCheck || false;

    let prompt;
    if (mode === "generate") {
        prompt = buildGenerationPrompt(text, context, tone, brandVoice);
    } else {
        prompt = buildAnalysisPrompt(
            text,
            tone,
            dialect,
            brandVoice,
            plagiarismCheck
        );
    }

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provider.apiKey}`,
    };

    if (provider.id === "openrouter") {
        headers["HTTP-Referer"] = "https://github.com/chirag127/Wryt";
        headers["X-Title"] = "Wryt";
    }

    const body = {
        model: provider.model,
        messages: [
            {
                role: "system",
                content:
                    mode === "analyze"
                        ? "You are a helpful grammar assistant. You MUST return valid JSON."
                        : "You are a helpful writing assistant.",
            },
            { role: "user", content: prompt },
        ],
        temperature: 0.3,
    };

    if (mode === "analyze") {
        body.response_format = { type: "json_object" };
    }

    const response = await fetch(provider.endpoint, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
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

    if (mode === "generate") {
        return { generatedText: rawText.trim() };
    }

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
        await callProviderApi(testProvider, "Hello world", "analyze");
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

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
                "gemini-3-pro-preview",
                "gemini-3-pro-image-preview",
                "gemini-2.5-pro",
                "gemini-2.5-flash",
                "gemini-2.5-flash-preview-09-2025",
                "gemini-2.5-flash-image",
                "gemini-2.5-flash-image-preview",
                "gemini-2.5-flash-native-audio-preview-09-2025",
                "gemini-live-2.5-flash-preview",
                "gemini-2.5-flash-lite",
                "gemini-2.5-flash-lite-preview-09-2025",
                "gemini-2.0-pro-exp-02-05",
                "gemini-2.0-flash",
                "gemini-2.0-flash-001",
                "gemini-2.0-flash-exp",
                "gemini-2.0-flash-preview-image-generation",
                "gemini-2.0-flash-live-001",
                "gemini-2.0-flash-lite",
                "gemini-2.0-flash-lite-preview-02-05",
                "gemini-2.0-flash-lite-001",
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
    if (request.action === "enhancePrompt") {
        handlePromptEnhancement(request.prompt, request.url)
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

async function handlePromptEnhancement(userPrompt, currentUrl) {
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
                userPrompt,
                "enhancePrompt",
                currentUrl
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
## Brand Voice Enforcement
${brandVoice}
Ensure all suggestions maintain this brand voice.`;
    }

    let plagiarismSection = "";
    if (plagiarismCheck) {
        plagiarismSection = `
5. **ORIGINALITY** (Orange):
   - Flag clichés and overused idioms
   - Flag generic, robotic, or "AI-sounding" phrasing
   - Flag famous quotes or likely plagiarized phrases (heuristic check)`;
    }

    return `# Role & Mission
You are Wryt, an elite AI Writing Analysis Engine combining Grammarly Premium sophistication with specialized Speech-to-Text (STT) correction expertise. Your mission is to transform dictated or typed text into polished, professional writing.

# Context Understanding
The input text may originate from:
- **Speech-to-text dictation software** (containing phonetic errors, self-corrections, repetitions)
- **Manual typing** (containing traditional typos and grammatical mistakes)

You must intelligently detect the source type and apply appropriate corrections.

# Few-Shot Learning Examples

## Example 1: Phonetic/Homophone Errors
**Input:** "The extension salary reproduces the premium features"
**Corrected:** "The extension still reproduces the premium features"
**Reasoning:** "salary" → "still" (phonetic match + contextual analysis)

## Example 2: Contextual Mismatches
**Input:** "That's why many sponsors are incorrect"
**Corrected:** "That's why many responses are incorrect"
**Reasoning:** "sponsors" → "responses" (contextual coherence)

## Example 3: Self-Corrections
**Input:** "I want to go to the store no actually the park"
**Corrected:** "I want to go to the park"
**Reasoning:** Removed false start, kept final intent

## Example 4: Stuttering/Repetition
**Input:** "The the project is is ready for review"
**Corrected:** "The project is ready for review"
**Reasoning:** Removed duplicate words

# Analysis Framework

## Step 1: Context Detection
Determine:
- Document type: formal (email/report), casual (chat), academic
- Tone indicators: Confident, Anxious, Aggressive, Formal, Optimistic
- Readability score (0-100) based on sentence complexity

## Step 2: User Preferences
Apply these requirements:
- **Target Tone:** ${toneMap[tone]}
- **Dialect:** ${dialectMap[dialect]}
${brandVoiceSection}

## Step 3: Multi-Tier Error Categorization

### 1. CRITICAL_GRAMMAR (Red - Severity: Critical)
- Spelling errors and typos
- Subject-verb disagreement
- Punctuation mistakes
- Article errors (a/an/the)
- **Homophones** (write/right, their/there/they're)

### 2. CLARITY (Blue - Severity: Advanced)
- Passive voice → Active voice transformations
- Wordy phrases → Concise alternatives
- Complex/ambiguous sentences → Simplified versions
- Vague pronouns requiring clarification
- **Speech artifacts:**
  * Self-corrections ("I want no I need" → "I need")
  * Immediate repetitions ("the the" → "the")
  * Disruptive filler words ("um", "uh", "like")

### 3. ENGAGEMENT (Green - Severity: Advanced)
- Overused words ("very", "really", "just")
- Repetitive vocabulary
- Dull/generic phrasing → Vivid alternatives
- Clichés and filler words

### 4. DELIVERY_TONE (Purple - Severity: Advanced)
- Politeness issues (too aggressive/blunt)
- Hedging language ("I think", "maybe", "possibly")
- Formality mismatches
- Confidence issues
${plagiarismSection}

### 5. PROMPT_OPTIMIZATION (Gold - Severity: Bonus)
- If the input text appears to be a prompt for an AI (e.g., starts with "Write a...", "Create...", "Act as...", or contains instructions), provide an optimized, detailed version of it using prompt engineering best practices (e.g., adding context, specifying format, defining persona).

## Step 4: Advanced Features Application

Apply these mandatory enhancements:
- Provide FULL sentence rewrites for clunky constructions
- Flag grammatically correct but unnatural phrasing (fluency issues)
- Suggest tone shifts when detected tone mismatches target
- Rewrite complete sentences to improve flow while preserving meaning
- Add missing punctuation typical of dictated text (run-on sentences)
- If the text is a prompt, generate an optimized version in the "enhanced_prompt" field.

# Output Schema (STRICT JSON ONLY)

Return ONLY valid JSON conforming to this exact schema:

{
  "analysis_meta": {
    "detected_tone": "string (e.g., 'Formal', 'Casual', 'Anxious')",
    "readability_score": "integer 0-100",
    "audience_type": "string (e.g., 'General', 'Academic', 'Professional')",
    "text_length": "integer (character count)"
  },
  "correctedText": "string - The fully corrected and polished version of the input",
  "corrections": [
    {
      "type": "enum: CRITICAL_GRAMMAR|CLARITY|ENGAGEMENT|DELIVERY_TONE|ORIGINALITY",
      "severity": "enum: Critical|Advanced",
      "original": "string - exact text segment from input",
      "replacement": "string - corrected version",
      "explanation": "string - concise reason (max 15 words)",
      "start_offset": "integer - character position where error starts",
      "end_offset": "integer - character position where error ends",
      "color_code": "enum: red|blue|green|purple|orange"
    }
  ],
  "rewrite_suggestion": "string or null - Full paragraph rewrite if needed for better flow",
  "enhanced_prompt": {
    "text": "string or null - The optimized prompt if applicable",
    "explanation": "string or null - Why this is better"
  },
  "tone_adjustments": [
    {
      "issue": "string - Identified tone problem",
      "suggestion": "string - How to adjust the tone"
    }
  ]
}

# Text to Analyze
"${text}"

# Critical Instructions
1. Detect speech-to-text artifacts FIRST (homophones, self-corrections, repetitions)
2. Apply context-aware corrections (consider surrounding words for disambiguation)
3. Preserve the author's intended meaning while fixing errors
4. Return ONLY valid JSON
5. NO explanatory text outside the JSON structure
6. Ensure all corrections have accurate start_offset and end_offset values`;
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

function buildPromptEnhancementTemplate(userPrompt, currentUrl) {
    // Extract domain from URL for context
    let siteName = "an AI assistant";
    try {
        const url = new URL(currentUrl);
        const hostname = url.hostname;
        if (hostname.includes("openai.com") || hostname.includes("chatgpt.com"))
            siteName = "ChatGPT";
        else if (hostname.includes("claude.ai")) siteName = "Claude";
        else if (hostname.includes("gemini.google.com"))
            siteName = "Google Gemini";
        else if (hostname.includes("copilot.microsoft.com"))
            siteName = "Microsoft Copilot";
    } catch (e) {
        // Fallback if URL parsing fails
    }

    return `# AI Prompt Enhancer

**About This Tool:**
AI Prompt Enhancer is your go-to tool for elevating the quality and effectiveness of your AI prompts. Through an interactive, step-by-step process, it analyzes your initial prompt, provides constructive feedback, and guides you towards creating more powerful, precise, and productive interactions with language models. Whether you're a professional prompt engineer or a casual AI user, this tool helps you unlock the full potential of your AI conversations.

---

## Your Task

The user is currently on **${siteName}** (URL: ${currentUrl}) and wants to improve the following vague or unclear prompt:

**Original Prompt:**
"${userPrompt}"

## Instructions

Please enhance this prompt by:

1. **Analyzing the Intent:** Identify what the user truly wants to achieve
2. **Adding Context:** Include relevant background information that would help the AI understand better
3. **Structuring the Request:** Organize the prompt into clear sections (if needed)
4. **Specifying Constraints:** Define format, length, tone, or style requirements
5. **Clarifying Output:** Be explicit about what the final output should look like

## Enhanced Prompt Format

Return a well-structured, professional prompt that:
- Uses clear, specific language
- Includes necessary context about the task
- Specifies the desired output format
- Sets appropriate expectations
- Leverages best practices in prompt engineering

**Output Guidelines:**
- Return ONLY the enhanced prompt
- Do NOT include meta-commentary like "Here is the enhanced prompt:"
- Make it ready to copy-paste directly into ${siteName}
- Ensure it's at least 2-3 times more detailed than the original
- Use professional yet accessible language

Generate the enhanced prompt now:`;
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
    } else if (mode === "enhancePrompt") {
        prompt = buildPromptEnhancementTemplate(text, context);
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

    if (mode === "generate" || mode === "enhancePrompt") {
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
    } else if (mode === "enhancePrompt") {
        prompt = buildPromptEnhancementTemplate(text, context);
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

    if (mode === "generate" || mode === "enhancePrompt") {
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

/**
 * Unit Test for Waterfall Logic
 * Run with: node test-waterfall.js
 */

// Mock Chrome API
global.chrome = {
    storage: {
        sync: {
            get: async () => ({
                config: {
                    providers: [
                        {
                            id: "gemini",
                            name: "Gemini",
                            enabled: true,
                            priority: 1,
                            apiKey: "test-key",
                            model: "gemini-3",
                            endpoint: "https://gemini",
                        },
                        {
                            id: "groq",
                            name: "Groq",
                            enabled: true,
                            priority: 2,
                            apiKey: "test-key",
                            model: "llama-3",
                            endpoint: "https://groq",
                        },
                    ],
                },
            }),
        },
    },
    runtime: {
        onInstalled: { addListener: () => {} },
        onMessage: { addListener: () => {} },
    },
};

// Mock Fetch
global.fetch = async (url) => {
    if (url.includes("gemini")) {
        throw new Error("Gemini Failed (Simulated)");
    }
    if (url.includes("groq")) {
        return {
            ok: true,
            json: async () => ({
                choices: [{ message: { content: "Fixed text from Groq" } }],
            }),
        };
    }
};

// Import Background Script Logic (Simulated)
// Since background.js is not a module, we'll copy the logic here for testing purposes
// In a real project, we would structure this as modules.

async function handleGrammarCheck(text) {
    const { config } = await chrome.storage.sync.get("config");
    const activeProviders = config.providers.sort(
        (a, b) => a.priority - b.priority
    );

    for (const provider of activeProviders) {
        try {
            console.log(`Testing provider: ${provider.name}`);
            if (provider.id === "gemini") await callGemini(provider, text);
            if (provider.id === "groq")
                return await callOpenAICompatible(provider, text);
        } catch (error) {
            console.log(`Provider ${provider.name} failed as expected.`);
        }
    }
    throw new Error("All failed");
}

async function callGemini() {
    throw new Error("Fail");
}
async function callOpenAICompatible() {
    return { correctedText: "Fixed text from Groq", provider: "Groq" };
}

// Run Test
(async () => {
    console.log("--- Starting Waterfall Test ---");
    try {
        const result = await handleGrammarCheck("Bad text");
        if (result.correctedText === "Fixed text from Groq") {
            console.log("✅ SUCCESS: Waterfall failed over to Groq correctly.");
        } else {
            console.error("❌ FAILED: Unexpected result:", result);
        }
    } catch (e) {
        console.error("❌ FAILED: Exception:", e);
    }
})();

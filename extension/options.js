/**
 * Wryt - Options Script
 * Handles settings UI, drag-and-drop, and API testing.
 */

const container = document.getElementById("provider-container");
const saveBtn = document.getElementById("save-btn");

// Load settings on start
document.addEventListener("DOMContentLoaded", loadSettings);
saveBtn.addEventListener("click", saveSettings);

async function loadSettings() {
    const { config } = await chrome.storage.sync.get("config");
    if (!config) return;

    // Load preferences
    const toneSelect = document.getElementById("tone-select");
    const dialectSelect = document.getElementById("dialect-select");
    const brandVoiceInput = document.getElementById("brand-voice-input");
    const plagiarismCheck = document.getElementById("plagiarism-check");

    if (config.preferences) {
        toneSelect.value = config.preferences.tone || "neutral";
        dialectSelect.value = config.preferences.dialect || "us";
        brandVoiceInput.value = config.preferences.brandVoice || "";
        plagiarismCheck.checked = config.preferences.plagiarismCheck || false;
    }

    renderProviders(config.providers);
}

function renderProviders(providers) {
    container.innerHTML = "";

    // Sort by priority
    providers.sort((a, b) => a.priority - b.priority);

    const providerLinks = {
        gemini: "https://aistudio.google.com/app/apikey",
        groq: "https://console.groq.com/keys",
        cerebras: "https://cloud.cerebras.ai/",
        sambanova: "https://cloud.sambanova.ai/",
        openrouter: "https://openrouter.ai/keys",
    };

    providers.forEach((provider) => {
        const item = document.createElement("div");
        item.className = "provider-item";
        item.dataset.id = provider.id;

        // Create Model Options
        let modelOptions = "";
        if (provider.availableModels && provider.availableModels.length > 0) {
            modelOptions = provider.availableModels
                .map(
                    (m) =>
                        `<option value="${m}" ${
                            m === provider.model ? "selected" : ""
                        }>${m}</option>`
                )
                .join("");
            // Add custom option
            modelOptions += `<option value="custom" ${
                !provider.availableModels.includes(provider.model)
                    ? "selected"
                    : ""
            }>Custom...</option>`;
        } else {
            modelOptions = `<option value="${provider.model}" selected>${provider.model}</option><option value="custom">Custom...</option>`;
        }

        const isCustomModel = !provider.availableModels?.includes(
            provider.model
        );

        item.innerHTML = `
      <div class="provider-header">
        <div class="provider-title">
          <span class="drag-handle">☰</span>
          ${provider.name}
          <span class="status-badge" id="status-${
              provider.id
          }">Not Tested</span>
        </div>
        <label>
          <input type="checkbox" class="enable-check" ${
              provider.enabled ? "checked" : ""
          }> Enable
        </label>
      </div>
      <div class="input-group">
        <div style="flex: 1; display: flex; gap: 0.5rem; align-items: center;">
            <input type="password" placeholder="API Key" value="${
                provider.apiKey || ""
            }" class="api-key-input">
            <a href="${
                providerLinks[provider.id] || "#"
            }" target="_blank" title="Get API Key" style="color: var(--primary); text-decoration: none; font-size: 0.8rem; white-space: nowrap;">Get Key ↗</a>
        </div>

        <div class="model-select-wrapper" style="flex: 1; display: flex; gap: 0.5rem;">
          <select class="model-select" style="flex: 1; padding: 0.75rem; border-radius: 6px; background: var(--bg); color: var(--text); border: 1px solid var(--border);">
            ${modelOptions}
          </select>
          <input type="text" placeholder="Custom Model ID" value="${
              provider.model
          }" class="model-input ${isCustomModel ? "" : "hidden"}" style="${
              isCustomModel ? "" : "display: none;"
          } flex: 1;">
        </div>

        <button class="test-btn" data-id="${provider.id}">Test</button>
      </div>
    `;
        container.appendChild(item);
    });

    // Add event listeners
    addEventListeners();
}

function addEventListeners() {
    // Test Buttons
    document.querySelectorAll(".test-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            const item = container.querySelector(
                `.provider-item[data-id="${id}"]`
            );
            const apiKey = item.querySelector(".api-key-input").value;
            const modelSelect = item.querySelector(".model-select");
            const modelInput = item.querySelector(".model-input");
            const model =
                modelSelect.value === "custom"
                    ? modelInput.value
                    : modelSelect.value;

            testConnection(id, apiKey, model);
        });
    });

    // Model Select Change
    document.querySelectorAll(".model-select").forEach((select) => {
        select.addEventListener("change", (e) => {
            const wrapper = e.target.closest(".model-select-wrapper");
            const input = wrapper.querySelector(".model-input");
            if (e.target.value === "custom") {
                input.style.display = "block";
                input.focus();
            } else {
                input.style.display = "none";
                input.value = e.target.value;
            }
            saveSettings(); // Auto-save on select change
        });
    });

    // Auto-save Event Listeners
    const debouncedSave = debounce(saveSettings, 500);

    document.querySelectorAll(".api-key-input").forEach((input) => {
        input.addEventListener("input", debouncedSave);
    });

    document.querySelectorAll(".model-input").forEach((input) => {
        input.addEventListener("input", debouncedSave);
    });

    document.querySelectorAll(".enable-check").forEach((check) => {
        check.addEventListener("change", saveSettings);
    });

    // Preferences Event Listeners
    const toneSelect = document.getElementById("tone-select");
    const dialectSelect = document.getElementById("dialect-select");
    const brandVoiceInput = document.getElementById("brand-voice-input");
    const plagiarismCheck = document.getElementById("plagiarism-check");

    if (toneSelect) toneSelect.addEventListener("change", saveSettings);
    if (dialectSelect) dialectSelect.addEventListener("change", saveSettings);
    if (brandVoiceInput)
        brandVoiceInput.addEventListener("input", debouncedSave);
    if (plagiarismCheck)
        plagiarismCheck.addEventListener("change", saveSettings);
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

async function saveSettings() {
    const items = container.querySelectorAll(".provider-item");
    const newProviders = [];

    items.forEach((item, index) => {
        const id = item.dataset.id;
        const enabled = item.querySelector(".enable-check").checked;
        const apiKey = item.querySelector(".api-key-input").value;
        const modelSelect = item.querySelector(".model-select");
        const modelInput = item.querySelector(".model-input");
        const model =
            modelSelect.value === "custom"
                ? modelInput.value
                : modelSelect.value;

        newProviders.push({
            id,
            enabled,
            priority: index + 1,
            apiKey,
            model,
        });
    });

    // Get preferences
    const toneSelect = document.getElementById("tone-select");
    const dialectSelect = document.getElementById("dialect-select");
    const brandVoiceInput = document.getElementById("brand-voice-input");
    const plagiarismCheck = document.getElementById("plagiarism-check");

    const preferences = {
        tone: toneSelect?.value || "neutral",
        dialect: dialectSelect?.value || "us",
        brandVoice: brandVoiceInput?.value || "",
        plagiarismCheck: plagiarismCheck?.checked || false,
    };

    // Merge with existing config
    const { config } = await chrome.storage.sync.get("config");
    const mergedProviders = config.providers.map((p) => {
        const newP = newProviders.find((np) => np.id === p.id);
        return newP ? { ...p, ...newP } : p;
    });

    await chrome.storage.sync.set({
        config: {
            providers: mergedProviders,
            preferences: preferences,
        },
    });

    const originalText = saveBtn.innerText;
    saveBtn.innerText = "Saved!";
    saveBtn.style.backgroundColor = "var(--success)";
    setTimeout(() => {
        saveBtn.innerText = originalText;
        saveBtn.style.backgroundColor = "";
    }, 1500);
}

async function testConnection(providerId, apiKey, model) {
    const statusBadge = document.getElementById(`status-${providerId}`);
    statusBadge.innerText = "Testing...";
    statusBadge.className = "status-badge";

    if (!apiKey) {
        statusBadge.innerText = "No Key";
        statusBadge.classList.add("error");
        return;
    }

    const response = await chrome.runtime.sendMessage({
        action: "testConnection",
        providerId,
        apiKey,
        model,
    });

    if (response.success) {
        statusBadge.innerText = "Connected";
        statusBadge.classList.add("success");
    } else {
        statusBadge.innerText = "Failed";
        statusBadge.classList.add("error");
        alert(`Connection Failed: ${response.error}`);
    }
}

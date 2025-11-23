/**
 * Wryt - Content Script
 * Injects Shadow DOM UI and observes text input.
 */

let debounceTimer;
const DEBOUNCE_DELAY = 1500;

// Initialize Shadow DOM Host
const host = document.createElement("div");
host.id = "opengrammar-host";
document.body.appendChild(host);
const shadow = host.attachShadow({ mode: "open" });

// Inject Styles
const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = chrome.runtime.getURL("styles.css");
shadow.appendChild(styleLink);

// Create Tooltip Container
const tooltip = document.createElement("div");
tooltip.className = "og-tooltip hidden";
tooltip.innerHTML = `
  <div class="og-content">
    <div class="og-header">
      <span class="og-logo">⚡ Wryt</span>
      <span class="og-close">×</span>
    </div>
    <div class="og-body">
      <div class="og-original"></div>
      <div class="og-arrow">↓</div>
      <div class="og-suggestion"></div>
    </div>
    <div class="og-actions">
      <button class="og-btn og-fix-btn">Fix it</button>
      <span class="og-attribution"></span>
    </div>
  </div>
`;
shadow.appendChild(tooltip);

// Event Listeners
document.addEventListener("input", handleInput, true);
tooltip.querySelector(".og-close").addEventListener("click", hideTooltip);
tooltip.querySelector(".og-fix-btn").addEventListener("click", applyFix);

// Listen for Context Menu messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "contextMenuCheck") {
        handleContextMenuCheck(request.text);
    }
});

let currentTarget = null;
let currentSuggestion = "";

function handleInput(e) {
    const target = e.target;
    if (!isEditable(target)) return;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => checkGrammar(target), DEBOUNCE_DELAY);
}

function isEditable(element) {
    return (
        element.isContentEditable ||
        element.tagName === "TEXTAREA" ||
        (element.tagName === "INPUT" && element.type === "text")
    );
}

async function checkGrammar(target) {
    const text = target.value || target.innerText;
    if (!text || text.length < 5) return;

    currentTarget = target;
    showLoadingState(target);

    try {
        const response = await chrome.runtime.sendMessage({
            action: "checkGrammar",
            text: text,
        });

        if (response.error) {
            console.error("Wryt Error:", response.error);
            return;
        }

        if (response.correctedText && response.correctedText !== text) {
            showSuggestion(
                target,
                text,
                response.correctedText,
                response.provider
            );
        }
    } catch (err) {
        console.error("Wryt Communication Error:", err);
    }
}

function showLoadingState(target) {
    console.log("Checking grammar...");
}

function showSuggestion(target, original, corrected, providerName) {
    currentSuggestion = corrected;

    const rect = target.getBoundingClientRect();
    tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
    tooltip.style.left = `${rect.left + window.scrollX}px`;

    shadow.querySelector(".og-original").textContent = original;
    shadow.querySelector(".og-suggestion").textContent = corrected;
    shadow.querySelector(
        ".og-attribution"
    ).textContent = `Fixed by ${providerName}`;

    tooltip.classList.remove("hidden");
}

function hideTooltip() {
    tooltip.classList.add("hidden");
}

function applyFix() {
    if (!currentTarget || !currentSuggestion) return;

    if (
        currentTarget.tagName === "TEXTAREA" ||
        currentTarget.tagName === "INPUT"
    ) {
        currentTarget.value = currentSuggestion;
    } else {
        currentTarget.innerText = currentSuggestion;
    }

    hideTooltip();

    // Flash success
    const originalBorder = currentTarget.style.borderColor;
    currentTarget.style.borderColor = "#22c55e";
    setTimeout(() => {
        currentTarget.style.borderColor = originalBorder;
    }, 1000);
}

async function handleContextMenuCheck(text) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Try to find the closest editable element
    let target = selection.anchorNode.parentElement;
    while (target && !isEditable(target)) {
        target = target.parentElement;
    }

    if (!target) {
        console.warn("No editable target found for selection.");
    } else {
        currentTarget = target;
    }

    showLoadingState(target);

    try {
        const response = await chrome.runtime.sendMessage({
            action: "checkGrammar",
            text: text,
        });

        if (response.error) {
            console.error("Wryt Error:", response.error);
            return;
        }

        if (response.correctedText && response.correctedText !== text) {
            currentSuggestion = response.correctedText;

            tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
            tooltip.style.left = `${rect.left + window.scrollX}px`;

            shadow.querySelector(".og-original").textContent = text;
            shadow.querySelector(".og-suggestion").textContent =
                response.correctedText;
            shadow.querySelector(
                ".og-attribution"
            ).textContent = `Fixed by ${response.provider}`;

            tooltip.classList.remove("hidden");
        }
    } catch (err) {
        console.error("Wryt Communication Error:", err);
    }
}

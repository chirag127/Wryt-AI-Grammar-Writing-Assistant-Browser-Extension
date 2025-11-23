/**
 * Wryt - Content Script
 * Injects Shadow DOM UI and observes text input.
 */

let debounceTimer;
const DEBOUNCE_DELAY = 1500;

// Initialize Shadow DOM Host
const host = document.createElement("div");
host.id = "wryt-host";
document.body.appendChild(host);
const shadow = host.attachShadow({ mode: "open" });

// Inject Styles
const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = chrome.runtime.getURL("styles.css");
shadow.appendChild(styleLink);

// Create Sidebar Container
const sidebar = document.createElement("div");
sidebar.className = "wryt-sidebar hidden";
sidebar.innerHTML = `
  <div class="wryt-header">
    <span class="wryt-logo">⚡ Wryt Premium</span>
    <div class="wryt-controls">
      <span class="wryt-badge-count hidden">0</span>
      <button class="wryt-close-btn">×</button>
    </div>
  </div>

  <div class="wryt-filter-group">
    <button class="wryt-filter-btn active" data-filter="all">All</button>
    <button class="wryt-filter-btn" data-filter="grammar">Grammar</button>
    <button class="wryt-filter-btn" data-filter="clarity">Clarity</button>
    <button class="wryt-filter-btn" data-filter="tone">Tone</button>
  </div>

  <div class="wryt-content">
    <div class="wryt-empty-state">
      <div class="wryt-icon">✨</div>
      <p>Analyze text to see premium suggestions.</p>
    </div>
    <div class="wryt-suggestions"></div>
  </div>

  <div class="wryt-footer hidden">
    <button class="wryt-btn wryt-accept-all-btn">Accept All</button>
  </div>
`;
shadow.appendChild(sidebar);

// Event Listeners
document.addEventListener("input", handleInput, true);
sidebar.querySelector(".wryt-close-btn").addEventListener("click", toggleSidebar);
sidebar.querySelectorAll(".wryt-filter-btn").forEach(btn => {
    btn.addEventListener("click", (e) => filterSuggestions(e.target.dataset.filter));
});
sidebar.querySelector(".wryt-accept-all-btn").addEventListener("click", acceptAllSuggestions);

// Listen for Context Menu messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "contextMenuCheck") {
        handleContextMenuCheck(request.text);
    }
});

let currentTarget = null;
let currentSuggestion = "";
let currentResponse = null;

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

        currentResponse = response;

        // Always render suggestions, even if empty (to clear previous ones or show "No issues")
        renderSuggestions(response);

        // Auto-open sidebar if there are corrections
        if (response.corrections && response.corrections.length > 0) {
             if (sidebar.classList.contains("hidden")) {
                toggleSidebar();
            }
        }
    } catch (err) {
        console.error("Wryt Communication Error:", err);
    }
}

function showLoadingState(target) {
    console.log("Checking grammar...");
}

function toggleSidebar() {
    sidebar.classList.toggle("hidden");
}

function filterSuggestions(filterType) {
    const cards = shadow.querySelectorAll(".wryt-card");
    const buttons = shadow.querySelectorAll(".wryt-filter-btn");

    // Update buttons
    buttons.forEach(btn => {
        if (btn.dataset.filter === filterType) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    // Filter cards
    cards.forEach(card => {
        if (filterType === "all" || card.dataset.type.toLowerCase().includes(filterType)) {
            card.classList.remove("hidden");
        } else {
            card.classList.add("hidden");
        }
    });
}

function removeCard(card) {
    card.remove();
    updateBadgeCount();

    // If no cards left, show empty state
    if (shadow.querySelectorAll(".wryt-card").length === 0) {
        shadow.querySelector(".wryt-empty-state").style.display = "flex";
        shadow.querySelector(".wryt-footer").classList.add("hidden");
    }
}

function updateBadgeCount() {
    const count = shadow.querySelectorAll(".wryt-card").length;
    const badge = shadow.querySelector(".wryt-badge-count");
    badge.textContent = count;
    if (count === 0) {
        badge.classList.add("hidden");
    } else {
        badge.classList.remove("hidden");
    }
}

function acceptAllSuggestions() {
    const cards = shadow.querySelectorAll(".wryt-card");
    cards.forEach(card => {
        const index = card.dataset.index;
        applySingleFix(index);
    });
}

function applyFix() {
    if (!currentSuggestion) return;

    if (currentTarget) {
        if (
            currentTarget.tagName === "TEXTAREA" ||
            currentTarget.tagName === "INPUT"
        ) {
            currentTarget.value = currentSuggestion;
        } else {
            currentTarget.innerText = currentSuggestion;
        }

        // Flash success
        const originalBorder = currentTarget.style.borderColor;
```javascript
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

function showSuggestion(targetOrRect, original, corrected, providerName) {
    currentSuggestion = corrected;

    let rect;
    if (
        targetOrRect instanceof DOMRect ||
        (targetOrRect.top !== undefined && targetOrRect.left !== undefined)
    ) {
        rect = targetOrRect;
    } else {
        rect = targetOrRect.getBoundingClientRect();
    }

    tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
    tooltip.style.left = `${rect.left + window.scrollX}px`;

    shadow.querySelector(".og-original").textContent = original;
    shadow.querySelector(".og-suggestion").textContent = corrected;
    shadow.querySelector(
        ".og-attribution"
    ).textContent = `Fixed by ${providerName}`;

    // Update button text based on target
    const btn = shadow.querySelector(".og-fix-btn");
    btn.textContent = currentTarget ? "Fix it" : "Copy";

    tooltip.classList.remove("hidden");
}

function hideTooltip() {
    tooltip.classList.add("hidden");
}

// applyFix removed as it is replaced by applySingleFix and acceptAllSuggestions

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

    currentTarget = target || null; // Set to null if not found

    showLoadingState(target); // Safe to pass null

    try {
        const response = await chrome.runtime.sendMessage({
            action: "checkGrammar",
            text: text,
        });

        if (response.error) {
            console.error("Wryt Error:", response.error);
            return;
        }

        renderSuggestions(response);
        toggleSidebar();
    } catch (err) {
        console.error("Wryt Communication Error:", err);
    }
}

// New premium implementation for rendering suggestions
function renderSuggestions(data) {
    const container = shadow.querySelector(".wryt-suggestions");
    container.innerHTML = "";
    shadow.querySelector(".wryt-empty-state").style.display = "none";

    // Handle legacy/simple response format
    if (!data.corrections && data.changes) {
        data.corrections = data.changes.map(c => ({
            type: c.type === "grammar" ? "CRITICAL_GRAMMAR" : "CLARITY",
            severity: "Standard",
            original_text: c.original,
            suggestion: c.replacement,
            explanation: c.explanation,
            premium_tag: false
        }));
    }

    if (!data.corrections || data.corrections.length === 0) {
        if (data.correctedText && data.correctedText !== (currentTarget.value || currentTarget.innerText)) {
            renderSimpleSuggestion(data.correctedText);
        } else {
            shadow.querySelector(".wryt-empty-state").style.display = "flex";
            shadow.querySelector(".wryt-empty-state p").textContent = "No issues found! 🎉";
        }
        return;
    }

    // Update Badge
    const badge = shadow.querySelector(".wryt-badge-count");
    badge.textContent = data.corrections.length;
    badge.classList.remove("hidden");

    // Render Cards
    data.corrections.forEach((correction, index) => {
        const card = createCorrectionCard(correction, index);
        container.appendChild(card);
    });

    shadow.querySelector(".wryt-footer").classList.remove("hidden");

    // Update filter counts
    updateFilterCounts(data.corrections);
}

function createCorrectionCard(correction, index) {
    const colorMap = {
        "CRITICAL_GRAMMAR": "red",
        "CLARITY": "blue",
        "ENGAGEMENT": "green",
        "DELIVERY_TONE": "purple"
    };

    const typeLabel = correction.type.replace("CRITICAL_", "").replace("_", " & ");
    const color = colorMap[correction.type] || "red";

    const card = document.createElement("div");
    card.className = `wryt-card wryt-${color}`;
    card.dataset.index = index;
    card.dataset.type = correction.type;

    const premiumBadge = correction.premium_tag
        ? '<span class="wryt-premium-badge">✨ PREMIUM</span>'
        : '';

    card.innerHTML = `
        <div class="wryt-card-header">
            <span class="wryt-badge wryt-badge-${color}">
                ${typeLabel}
            </span>
            ${premiumBadge}
            <span class="wryt-severity">${correction.severity || "Standard"}</span>
        </div>
        <div class="wryt-diff">
            <span class="wryt-original">${correction.original || correction.original_text}</span>
            <span class="wryt-arrow">→</span>
            <span class="wryt-replacement">${correction.replacement || correction.suggestion}</span>
        </div>
        <div class="wryt-explanation">${correction.explanation}</div>
        <div class="wryt-card-actions">
            <button class="wryt-icon-btn accept" data-index="${index}">✓</button>
            <button class="wryt-icon-btn reject" data-index="${index}">×</button>
        </div>
    `;

    card.querySelector(".accept").addEventListener("click", () => applySingleFix(index));
    card.querySelector(".reject").addEventListener("click", () => removeCard(card));

    // Hover effect
    card.addEventListener("mouseenter", () => {
        if (correction.start_offset !== undefined) {
            highlightTextRange(correction.start_offset, correction.end_offset, color);
        }
    });

    card.addEventListener("mouseleave", () => {
        removeHighlight();
    });

    return card;
}

function updateFilterCounts(corrections) {
    const counts = {};
    corrections.forEach(c => {
        counts[c.type] = (counts[c.type] || 0) + 1;
    });

    shadow.querySelectorAll(".wryt-filter-btn").forEach(btn => {
        const filter = btn.dataset.filter;
        if (filter === "all") {
            btn.textContent = `All (${corrections.length})`;
        } else {
            // Map button filter to correction type
            let type = "";
            if (filter === "grammar") type = "CRITICAL_GRAMMAR";
            if (filter === "clarity") type = "CLARITY";
            if (filter === "tone") type = "DELIVERY_TONE";
            // ... add others

            // For now just simple mapping or 0
            const count = Object.keys(counts).find(k => k.toLowerCase().includes(filter)) ? counts[Object.keys(counts).find(k => k.toLowerCase().includes(filter))] : 0;
             btn.textContent = `${filter.charAt(0).toUpperCase() + filter.slice(1)} (${count})`;
        }
    });
}

function highlightTextRange(start, end, color) {
    if (!currentTarget) return;

    // Create overlay if it doesn't exist
    let overlay = document.getElementById("wryt-highlight-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "wryt-highlight-overlay";
        overlay.className = "wryt-highlight-overlay";
        document.body.appendChild(overlay);
    }

    // Calculate position
    // Note: This is a simplified implementation.
    // For robust highlighting in contenteditable/textarea, we need more complex logic
    // involving Range API and getClientRects.

    if (currentTarget.tagName === "TEXTAREA" || currentTarget.tagName === "INPUT") {
        // For inputs, we can't easily get coordinate of specific text range
        // So we just highlight the whole input border for now
        currentTarget.style.boxShadow = "0 0 0 2px var(--wryt-" + color + ", red)";
    } else {
        // For contenteditable
        try {
            // This is tricky without a proper text-node walker
            // For now, we'll skip complex range highlighting to avoid errors
            // and just highlight the container
             currentTarget.style.boxShadow = "0 0 0 2px var(--wryt-" + color + ", red)";
        } catch (e) {
            console.error("Highlight error:", e);
        }
    }

    overlay.className = `wryt-highlight-overlay wryt-highlight-${color}`;
}

function removeHighlight() {
    if (currentTarget) {
        currentTarget.style.boxShadow = "";
    }
    const overlay = document.getElementById("wryt-highlight-overlay");
    if (overlay) overlay.remove();
}

function applySingleFix(index) {
    if (!currentResponse || !currentResponse.corrections) return;

    const correction = currentResponse.corrections[index];
    if (!correction) return;

    const original = correction.original || correction.original_text;
    const replacement = correction.replacement || correction.suggestion;

    if (currentTarget.tagName === "TEXTAREA" || currentTarget.tagName === "INPUT") {
        currentTarget.value = currentTarget.value.replace(original, replacement);
    } else {
        currentTarget.innerHTML = currentTarget.innerHTML.replace(original, replacement);
    }

    // Remove card
    const card = shadow.querySelector(`.wryt-card[data-index="${index}"]`);
    if (card) removeCard(card);

    // Update badge
    const badge = shadow.querySelector(".wryt-badge-count");
    badge.textContent = parseInt(badge.textContent) - 1;
    if (badge.textContent === "0") badge.classList.add("hidden");
}

function renderSimpleSuggestion(correctedText) {
    const container = shadow.querySelector(".wryt-suggestions");
    container.innerHTML = "";
    shadow.querySelector(".wryt-empty-state").style.display = "none";

    const card = document.createElement("div");
    card.className = "wryt-card wryt-blue";
    card.innerHTML = `
        <div class="wryt-card-header">
            <span class="wryt-badge wryt-badge-blue">Suggestion</span>
        </div>
        <div class="wryt-diff">
            <span class="wryt-replacement">${correctedText}</span>
        </div>
        <div class="wryt-explanation">Better phrasing suggested.</div>
        <div class="wryt-card-actions">
            <button class="wryt-icon-btn accept">✓</button>
            <button class="wryt-icon-btn reject">×</button>
        </div>
    `;

    card.querySelector(".accept").addEventListener("click", () => {
        if (currentTarget.tagName === "TEXTAREA" || currentTarget.tagName === "INPUT") {
            currentTarget.value = correctedText;
        } else {
            currentTarget.innerText = correctedText;
        }
        removeCard(card);
    });
    card.querySelector(".reject").addEventListener("click", () => removeCard(card));

    container.appendChild(card);
    shadow.querySelector(".wryt-footer").classList.add("hidden");
    updateBadgeCount();
}

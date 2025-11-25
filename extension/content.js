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
    <span class="wryt-logo">⚡ Wryt AI</span>
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
      <p>Analyze text to see advanced suggestions.</p>
    </div>
    <div class="wryt-suggestions"></div>
  </div>

  <div class="wryt-footer hidden">
    <button class="wryt-btn wryt-accept-all-btn">Accept All</button>
  </div>
`;
shadow.appendChild(sidebar);

// Draggable Functionality
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Restore saved position or set default
async function restoreSidebarPosition() {
    const result = await chrome.storage.local.get("sidebarPosition");
    if (result.sidebarPosition) {
        sidebar.style.left = `${result.sidebarPosition.x}px`;
        sidebar.style.top = `${result.sidebarPosition.y}px`;
        sidebar.style.right = "auto";
    } else {
        // Default position: right side, vertically centered
        sidebar.style.right = "20px";
        sidebar.style.top = "50%";
        sidebar.style.transform = "translateY(-50%)";
    }
}

restoreSidebarPosition();

// Make sidebar draggable
const header = sidebar.querySelector(".wryt-header");
header.style.cursor = "grab";

header.addEventListener("mousedown", (e) => {
    // Don't start drag if clicking on buttons
    if (
        e.target.classList.contains("wryt-close-btn") ||
        e.target.closest(".wryt-close-btn")
    ) {
        return;
    }

    isDragging = true;
    header.style.cursor = "grabbing";
    sidebar.classList.add("wryt-dragging");

    // Calculate offset from mouse to top-left of sidebar
    const rect = sidebar.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;

    e.preventDefault();
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    // Calculate new position
    let newX = e.clientX - dragOffsetX;
    let newY = e.clientY - dragOffsetY;

    // Constrain to viewport bounds
    const sidebarRect = sidebar.getBoundingClientRect();
    const maxX = window.innerWidth - sidebarRect.width;
    const maxY = window.innerHeight - sidebarRect.height;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    // Apply position
    sidebar.style.left = `${newX}px`;
    sidebar.style.top = `${newY}px`;
    sidebar.style.right = "auto";
    sidebar.style.transform = "none";
});

document.addEventListener("mouseup", () => {
    if (isDragging) {
        isDragging = false;
        header.style.cursor = "grab";
        sidebar.classList.remove("wryt-dragging");

        // Save position
        const rect = sidebar.getBoundingClientRect();
        chrome.storage.local.set({
            sidebarPosition: {
                x: rect.left,
                y: rect.top,
            },
        });
    }
});

// Event Listeners
document.addEventListener("input", handleInput, true);
sidebar
    .querySelector(".wryt-close-btn")
    .addEventListener("click", toggleSidebar);
sidebar.querySelectorAll(".wryt-filter-btn").forEach((btn) => {
    btn.addEventListener("click", (e) =>
        filterSuggestions(e.target.dataset.filter)
    );
});
sidebar
    .querySelector(".wryt-accept-all-btn")
    .addEventListener("click", acceptAllSuggestions);

// Listen for Context Menu messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "contextMenuCheck") {
        handleContextMenuCheck(request.text);
    }
});

let currentTarget = null;
const currentSuggestion = "";
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
    buttons.forEach((btn) => {
        if (btn.dataset.filter === filterType) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    // Filter cards
    cards.forEach((card) => {
        if (
            filterType === "all" ||
            card.dataset.type.toLowerCase().includes(filterType)
        ) {
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
    cards.forEach((card) => {
        const index = card.dataset.index;
        applySingleFix(index);
    });
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

// New implementation for rendering suggestions
function renderSuggestions(data) {
    const container = shadow.querySelector(".wryt-suggestions");
    container.innerHTML = "";
    shadow.querySelector(".wryt-empty-state").style.display = "none";

    // Render Enhanced Prompt if available
    if (data.enhanced_prompt && data.enhanced_prompt.text) {
        const promptCard = createEnhancedPromptCard(data.enhanced_prompt);
        container.appendChild(promptCard);
    }

    // Handle legacy/simple response format
    if (!data.corrections && data.changes) {
        data.corrections = data.changes.map((c) => ({
            type: c.type === "grammar" ? "CRITICAL_GRAMMAR" : "CLARITY",
            severity: "Standard",
            original_text: c.original,
            suggestion: c.replacement,
            explanation: c.explanation,
        }));
    }

    if (!data.corrections || data.corrections.length === 0) {
        if (
            data.correctedText &&
            data.correctedText !==
                (currentTarget.value || currentTarget.innerText)
        ) {
            renderSimpleSuggestion(data.correctedText);
        } else {
            shadow.querySelector(".wryt-empty-state").style.display = "flex";
            shadow.querySelector(".wryt-empty-state p").textContent =
                "No issues found! 🎉";
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
        CRITICAL_GRAMMAR: "red",
        CLARITY: "blue",
        ENGAGEMENT: "green",
        DELIVERY_TONE: "purple",
    };

    const typeLabel = correction.type
        .replace("CRITICAL_", "")
        .replace("_", " & ");
    const color = colorMap[correction.type] || "red";

    const card = document.createElement("div");
    card.className = `wryt-card wryt-${color}`;
    card.dataset.index = index;
    card.dataset.type = correction.type;

    card.innerHTML = `
        <div class="wryt-card-header">
            <span class="wryt-badge wryt-badge-${color}">
                ${typeLabel}
            </span>
            <span class="wryt-severity">${
                correction.severity || "Standard"
            }</span>
        </div>
        <div class="wryt-diff">
            <span class="wryt-original">${
                correction.original || correction.original_text
            }</span>
            <span class="wryt-arrow">→</span>
            <span class="wryt-replacement">${
                correction.replacement || correction.suggestion || ""
            }</span>
        </div>
        <div class="wryt-explanation">${correction.explanation}</div>
        <div class="wryt-card-actions">
            <button class="wryt-icon-btn accept" data-index="${index}">✓</button>
            <button class="wryt-icon-btn reject" data-index="${index}">×</button>
        </div>
    `;

    card.querySelector(".accept").addEventListener("click", () =>
        applySingleFix(index)
    );
    card.querySelector(".reject").addEventListener("click", () =>
        removeCard(card)
    );

    // Hover effect
    card.addEventListener("mouseenter", () => {
        if (correction.start_offset !== undefined) {
            highlightTextRange(
                correction.start_offset,
                correction.end_offset,
                color
            );
        }
    });

    card.addEventListener("mouseleave", () => {
        removeHighlight();
    });

    return card;
}

function updateFilterCounts(corrections) {
    const counts = {};
    corrections.forEach((c) => {
        counts[c.type] = (counts[c.type] || 0) + 1;
    });

    shadow.querySelectorAll(".wryt-filter-btn").forEach((btn) => {
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
            const count = Object.keys(counts).find((k) =>
                k.toLowerCase().includes(filter)
            )
                ? counts[
                      Object.keys(counts).find((k) =>
                          k.toLowerCase().includes(filter)
                      )
                  ]
                : 0;
            btn.textContent = `${
                filter.charAt(0).toUpperCase() + filter.slice(1)
            } (${count})`;
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

    if (
        currentTarget.tagName === "TEXTAREA" ||
        currentTarget.tagName === "INPUT"
    ) {
        // For inputs, we can't easily get coordinate of specific text range
        // So we just highlight the whole input border for now
        currentTarget.style.boxShadow =
            "0 0 0 2px var(--wryt-" + color + ", red)";
    } else {
        // For contenteditable
        try {
            // This is tricky without a proper text-node walker
            // For now, we'll skip complex range highlighting to avoid errors
            // and just highlight the container
            currentTarget.style.boxShadow =
                "0 0 0 2px var(--wryt-" + color + ", red)";
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

    if (
        currentTarget.tagName === "TEXTAREA" ||
        currentTarget.tagName === "INPUT"
    ) {
        currentTarget.value = currentTarget.value.replace(
            original,
            replacement
        );
    } else {
        currentTarget.innerHTML = currentTarget.innerHTML.replace(
            original,
            replacement
        );
    }

    // Remove card
    const card = shadow.querySelector(`.wryt-card[data-index="${index}"]`);
    if (card) removeCard(card);

    // Update badge
    const badge = shadow.querySelector(".wryt-badge-count");
    badge.textContent = Number.parseInt(badge.textContent) - 1;
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
        if (
            currentTarget.tagName === "TEXTAREA" ||
            currentTarget.tagName === "INPUT"
        ) {
            currentTarget.value = correctedText;
        } else {
            currentTarget.innerText = correctedText;
        }
        removeCard(card);
    });
    card.querySelector(".reject").addEventListener("click", () =>
        removeCard(card)
    );

    container.appendChild(card);
    shadow.querySelector(".wryt-footer").classList.add("hidden");
    updateBadgeCount();
}

function createEnhancedPromptCard(enhancedPrompt) {
    const card = document.createElement("div");
    card.className = "wryt-card wryt-gold";

    card.innerHTML = `
        <div class="wryt-card-header">
            <span class="wryt-badge wryt-badge-gold">
                ✨ Prompt Optimization
            </span>
            <span class="wryt-severity">Bonus</span>
        </div>
        <div class="wryt-diff">
            <div class="wryt-replacement" style="white-space: pre-wrap;">${
                enhancedPrompt.text
            }</div>
        </div>
        <div class="wryt-explanation">${
            enhancedPrompt.explanation || "Optimized for better AI results."
        }</div>
        <div class="wryt-card-actions">
            <button class="wryt-icon-btn accept" title="Copy to clipboard">📋</button>
            <button class="wryt-icon-btn reject">×</button>
        </div>
    `;

    card.querySelector(".accept").addEventListener("click", () => {
        navigator.clipboard.writeText(enhancedPrompt.text);
        const btn = card.querySelector(".accept");
        btn.textContent = "✓";
        setTimeout(() => (btn.textContent = "📋"), 2000);
    });

    card.querySelector(".reject").addEventListener("click", () => {
        card.remove();
        updateBadgeCount();
    });

    return card;
}

# 🐞 Bug Report: System Integrity Failure

This template enforces the **Apex Zero-Defect Mandate**. Please complete all sections with surgical precision to expedite triage and resolution. Vague reports will be immediately sent back to the reporter for refinement.

---

## 1. BLUF: The Critical Failure Summary

**In one precise sentence, describe the core issue:**

[Insert one-sentence summary of the unexpected/incorrect behavior here]

## 2. RECURRENCE & IMPACT

### A. Steps to Reproduce (The Trace)

Provide the exact, minimal sequence of actions required to trigger the failure. Be deterministic.

1. Navigate to: `[URL or Extension State]`
2. Perform Action: `[Click X, Type Y, Wait Z seconds]`
3. Observe Result: `[The system deviated from expected behavior]`
4. Repeatability: `[e.g., 10/10, Intermittent, Only on first load]`

### B. Expected vs. Actual Behavior

**Expected Behavior (The Blueprint):**

[Describe what the system *should* have done according to spec or intuition.]

**Actual Behavior (The Deviation):**

[Describe what the system *actually* did. Include error messages or UI artifacts.]

## 3. ENVIRONMENTAL CONTEXT (Apex Stack Verification)

This context is non-negotiable for debugging the TypeScript/Vite/Tauri architecture.

| Metric | Value |
| :--- | :--- |
| **Extension Version** | `[e.g., v1.4.0, or latest main branch commit hash]` |
| **Browser Name** | `[Chrome, Firefox, Edge, Safari]` |
| **Browser Version** | `[e.g., 134.0.6722.122]` |
| **Operating System** | `[e.g., macOS Sonoma 14.3, Windows 11 Pro]` |
| **LLM Provider Triggered** | `[Gemini, Groq, OpenRouter, or None]` |
| **Configuration State** | `[e.g., Brand Voice enabled: true, Speech-to-Text active: false]` |

## 4. DIAGNOSTIC ARTIFACTS (The Evidence)

### A. Console/Extension Logs

**Attach the full, unedited log output from the extension background/service worker console when the bug occurred.**

```typescript
// Paste Log Snippets Here. Omit startup noise if possible.
```

### B. Network Traces (If API Related)

If the issue involves an API call (LLM interaction, settings save, etc.), include the relevant request/response headers or HAR snippet.

### C. Visual Manifestation (Screenshots/Video)

[Attach any relevant screenshots or a short GIF/video demonstrating the failure.]

## 5. AI AGENT DIRECTIVES FOR FIXING (Self-Diagnosis Hint)

If you suspect the cause is related to State Management, LLM Waterfall logic, or Content Security Policy (CSP), review the following directives before assigning:

<details>
<summary>🤖 APEX ARCHITECT GUIDANCE ON THIS PROJECT</summary>

**Project Stack:** TypeScript 6.x, Vite 7, WXT, Signals, Biome, Playwright.

**Architectural Focus:** Feature-Sliced Design (FSD) must be respected. State changes propagate via Signals only. LLM waterfall logic must adhere strictly to the fallback cascade defined in `AGENTS.md` (Tier 1 -> Tier 5).

**Security Focus (OWASP 2025):** Ensure ALL external payload data (LLM responses, user inputs) are **sanitized** before rendering, especially in Shadow DOM contexts. Check CSP rules in `manifest.json`.

**Debugging Strategy:**
1. Isolate: Can this be reproduced in a minimal local setup without hitting external APIs (mock the LLM response)?
2. Performance Check: Is this a race condition or an Interaction to Next Paint (INP) block?
3. Code Location: Reference the relevant file path (e.g., `src/features/llm/waterfall.ts`).

</details>
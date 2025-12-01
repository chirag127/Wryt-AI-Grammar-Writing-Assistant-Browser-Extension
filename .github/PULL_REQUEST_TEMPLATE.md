# 🚀 Pull Request Template: Wryt-AI Integration & Feature Advancement

**Project Mandate:** Enforce Zero-Defect, High-Velocity, Future-Proof code adhering to the Apex Technical Authority standards.

--- 

## 1. PR Summary & Value Proposition (BLUF)

*Provide a concise, single-sentence description of what this PR achieves and its primary user/architectural benefit.*

**Example:** `feat: Implements native Tauri storage for persistent LLM API keys, enhancing security and user experience.`

---

## 2. Type of Change

Select all that apply:

- [ ] `feat`: A new feature or capability (e.g., new LLM integration, UI enhancement).
- [ ] `fix`: A bug fix (e.g., correcting state mutation, addressing a logic error).
- [ ] `refactor`: Code change that neither fixes a bug nor adds a feature (e.g., architectural cleanup, optimizing a loop).
- [ ] `docs`: Changes to documentation only (README, CONTRIBUTING, etc.).
- [ ] `test`: Adding missing tests or improving existing test coverage.
- [ ] `chore`: Maintenance tasks (e.g., updating dependencies, CI/CD tweaks).
- [ ] `perf`: Performance improvements.
- [ ] `security`: Security vulnerability patching or hardening.

---

## 3. Architectural Context & Scope

### A. Core Principles Adherence Check (Self-Audit)

*Review against Apex Principles. Mark as N/A or CONFIRMED.*

- [ ] **SOLID Adherence:** Is the Single Responsibility Principle respected in modified modules? (Y/N)
- [ ] **CQS Applied:** Do all new methods cleanly separate Commands from Queries? (Y/N)
- [ ] **Guard Clauses Used:** Are deeply nested structures avoided in favor of early returns? (Y/N)
- [ ] **Testing Coverage:** Are all new/modified logic paths covered by Unit/E2E tests? (Y/N)
- [ ] **Input Sanitization:** Are all external inputs (API keys, text input) rigorously sanitized? (Y/N)

### B. Affected Files & Feature Slices

*List the main directories or modules impacted.*

- `src/features/[feature-name]/...`
- `src/lib/llm-adapters/...`
- `src/browser-inject/...`

---

## 4. Technical Deep Dive & Verification

*Explain the **WHY** and **HOW** of the major changes. Reference relevant issues if applicable.*

**Reasoning:**

<!-- Detailed explanation here -->

**Verification Steps (Required for Merge):**

1.  Build the extension using `npm run build:extension`.
2.  Run full integration suite: `npm run test:e2e`.
3.  Manually verify the specific feature change on a target website (e.g., Gmail, Notion).
4.  Confirm browser console logs show **ZERO** errors post-interaction.

---

## 5. Agent Directives Compliance

*Confirm that this PR aligns with the current project's documented technical strategy.*

- [ ] **Stack Alignment:** Does this change conform to the documented TypeScript 6.x / Vite 7 / WXT stack? (Y/N)
- [ ] **Security Posture:** Does this introduce any new dependencies or change encryption/storage methods that need security review? (Y/N)

---

## 6. Related Issues

Closes: #XXX (If applicable)
Fixes: #YYY (If applicable)

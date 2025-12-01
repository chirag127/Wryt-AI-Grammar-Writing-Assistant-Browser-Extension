--- 
name: Feature / Fix / Refactoring Proposal
about: Standardized template for submitting code changes to the Wryt-AI repository.
title: 'type(scope): concise description (e.g., feat(api): Add LLM cascade selector)'
labels: ['needs-review', 'status:draft']
assignees: ''
---

## 🎯 PR Type & Description

**What kind of change does this PR introduce?** (Check one or more)
- [ ] `feat`: A new feature (non-breaking change).
- [ ] `fix`: A bug fix (non-breaking change).
- [ ] `perf`: A code change that improves performance.
- [ ] `refactor`: A code change that neither fixes a bug nor adds a feature (clean up/restructuring).
- [ ] `test`: Adding missing tests or correcting existing tests.
- [ ] `docs`: Documentation only changes.
- [ ] `chore`: Build process or auxiliary tool changes.

**Relevant Issue(s):**
Closes # (If applicable, link the issue this PR resolves)

---

## 🤖 Architect's Validation Checklist (The Zero-Defect Mandate)

*The following checks ensure compliance with the Apex Technical Authority standards (Referenced in AGENTS.md).* 

### 1. Code Hygiene & Architecture
- [ ] **Conventional Commits:** The PR title and all commits adhere to the `type(scope): description` format.
- [ ] **Self-Documenting Code:** Variables and functions use semantic, descriptive names (`camelCase`/`PascalCase`). Zero unnecessary comments.
- [ ] **SOLID Principle Adherence:** Changes respect Single Responsibility and Open/Closed Principles.
- [ ] **DRY Enforcement:** Repetitive code has been abstracted or automated.
- [ ] **Guard Clauses:** Logic is optimized for reading down (early returns implemented).
- [ ] **Modularity:** New components/features are placed within the designated feature-first structure (e.g., `src/features/llm-cascader`).

### 2. Testing & Coverage
- [ ] **Tests Added/Updated:** Unit tests (Vitest) cover new logic or fix regressions.
- [ ] **High Coverage:** Code coverage remains at or above the threshold defined in the CI pipeline.
- [ ] **Isolation:** Tests are isolated (using mocks for API calls or external dependencies).
- [ ] **F.I.R.S.T:** Tests are Fast, Isolated, Repeatable, Self-validating, and Timely.

### 3. Performance & Security
- [ ] **Performance Audit:** No new large dependencies were introduced. Optimized for speed (INP < 200ms).
- [ ] **Security Review (Zero Trust):** All user inputs (especially LLM prompts/results) are sanitized and validated against OWASP Top 10 standards.
- [ ] **Error Handling:** Critical I/O operations (API calls, browser storage) are wrapped in `try-catch` blocks with recovery/retry logic.

### 4. Documentation & Deployment
- [ ] **README/Docs Updated:** Relevant changes to setup, configuration, or functionality have been reflected in `README.md` or other docs.
- [ ] **Configuration:** If new environment variables are needed, they are documented and handled according to the 12-Factor App methodology.

---

## 🚀 Reviewer Notes

*Provide specific guidance for the reviewer on areas that require focused attention.*

1.  **AI Logic Path:** Please pay close attention to the multi-LLM cascading logic. Verify the Circuit Breaker and Fallback Cascade mechanisms defined in `AGENTS.md` are correctly implemented.
2.  **Browser Context:** Confirm proper communication between Content Scripts and Background Service Workers using the standard message passing protocol, ensuring minimal latency.
3.  **UI/UX:** Check if the interaction flow adheres to the high standard of UX (Liquid Glass/Neo-Brutalist design) and hyper-configurability.
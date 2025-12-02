# Pull Request Template

**Thank you for contributing to `Wryt-AI-Grammar-Writing-Assistant-Browser-Extension`!**

Please review the following sections to ensure your pull request meets our standards.

---

## 1. Pull Request Checklist

Before submitting, please ensure you have:

*   [ ] Read and understood the contributing guidelines in `.github/CONTRIBUTING.md`.
*   [ ] Checked that your changes address an existing issue or a well-defined feature.
*   [ ] Tested your changes thoroughly.
*   [ ] Updated relevant documentation (if applicable).
*   [ ] Ensured your code adheres to the project's coding standards (linting and formatting).
*   [ ] Squashed your commits into a single, logical unit (unless otherwise specified).
*   [ ] Used a descriptive and concise commit message that follows conventional commit standards.
*   [ ] Verified that all CI/CD checks are passing.

---

## 2. Description of Changes

Please provide a clear and concise summary of the changes in this pull request.

*   **What:** (e.g., Fix bug, Add feature, Refactor code, Update documentation)
*   **Why:** (e.g., To resolve issue #XYZ, To improve performance, To enhance user experience)
*   **How:** (Briefly describe the implementation approach)

---

## 3. Related Issues

If this pull request closes, fixes, or is related to any issues, please link them here.

*   Example: `Closes #123`
*   Example: `Fixes #456`

---

## 4. Screenshots/Recordings (If Applicable)

For UI-related changes, please include screenshots or recordings demonstrating the impact of your changes.

---

## 5. AI Agent Directives & Architecture Alignment

This section ensures your contributions align with the project's architectural principles and AI integration strategies as defined in `AGENTS.md`.

*   **Core Principles:** Your changes should uphold principles such as SOLID, DRY, and YAGNI. Maintain modularity and clear separation of concerns.
*   **AI Integration:** If your changes involve the AI waterfall (Gemini, Groq, OpenRouter) or speech-to-text optimization, ensure:
    *   Robust error handling for API calls.
    *   Efficient data flow and minimal latency.
    *   Clear API contracts between components.
*   **Testing:** All new or modified functionality must have corresponding unit or integration tests.
*   **Linting & Formatting:** Code must pass `Ruff` checks. Run `uv ruff format .` and `uv ruff check . --fix` before committing.

---

## 6. Developer Notes

Add any additional notes that might be helpful for reviewers, such as specific areas to focus on, potential trade-offs, or future considerations.

---

**Repository:** `https://github.com/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension`
**Username:** `chirag127`
**Branch:** `main` (or specific feature branch)

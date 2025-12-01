# CONTRIBUTING TO WRYT-AI GRAMMAR & WRITING ASSISTANT

Thank you for considering contributing to Wryt-AI! Your efforts help us build a superior AI writing assistant for everyone. We adhere to rigorous standards to maintain a high-velocity, zero-defect, and future-proof codebase.

## 1. CODE OF CONDUCT

This project follows the Contributor Covenant, version 2.0. Please review the full [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details on expected behavior.

## 2. OUR DEVELOPMENT PHILOSOPHY

*   **Zero-Defect, High-Velocity, Future-Proof:** Every contribution must uphold these principles. We strive for immaculately clean code, rapid iteration, and adaptability to future standards.
*   **Apex Technical Authority:** We operate with the highest architectural and engineering standards. Familiarize yourself with the [AGENTS.md](AGENTS.md) for core principles.
*   **Self-Documenting Code:** Aim for code that is so clear, it requires minimal comments. Comments should explain *why*, not *what*.
*   **Test-Driven Development (TDD):** All new features and bug fixes must be accompanied by comprehensive tests.
*   **Modularity & Clean Architecture:** Contributions should align with modular design principles, promoting separation of concerns.

## 3. GETTING STARTED

### 3.1. Prerequisites

Ensure you have the following installed:

*   **Node.js:** Latest LTS version recommended.
*   **npm / pnpm / yarn:** Package manager of your choice (we standardize on `pnpm` for efficiency).
*   **Git:** For version control.

### 3.2. Cloning the Repository

```bash
git clone --depth 1 https://github.com/your-username/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension.git
cd Wryt-AI-Grammar-Writing-Assistant-Browser-Extension
```

### 3.3. Installation

We use `pnpm` for efficient dependency management.

```bash
pnpm install
```

### 3.4. Development Setup

This project utilizes **WXT (Web Extension Tooling)** for building browser extensions, Vite for development, and TypeScript.

```bash
# For development with hot-reloading (watches for changes)
pnpm run dev
```

## 4. CONTRIBUTING WORKFLOW

We follow a standard GitHub pull request workflow:

1.  **Fork the Project:** Create your own fork of the repository.
2.  **Create a Branch:** Branch out from `main` for your new feature or bug fix. Use descriptive names (e.g., `feat/add-brand-voice-detection`, `fix/grammar-correction-bug`).
    ```bash
    git checkout main
    git pull origin main
    git checkout -b your-feature-branch-name
    ```
3.  **Make Your Changes:** Implement your changes, ensuring adherence to Apex standards.
4.  **Test Thoroughly:** Write new tests or update existing ones to cover your changes. Run the test suite.
    ```bash
    pnpm run test
    ```
5.  **Lint and Format:** Ensure your code adheres to our linting and formatting rules. This project uses **Biome**.
    ```bash
    pnpm run lint
    pnpm run format
    ```
6.  **Commit Your Changes:** Use Conventional Commits format.
    ```bash
    git add .
    git commit -m "feat: Implement advanced grammar correction algorithm"
    # Example: git commit -m "fix: Resolve issue with speech-to-text parsing"
    ```
7.  **Push to Your Fork:** Push your branch to your forked repository.
    ```bash
    git push origin your-feature-branch-name
    ```
8.  **Open a Pull Request:** Create a Pull Request from your feature branch to the `main` branch of the original repository.

## 5. PULL REQUEST GUIDELINES

*   **Clear Description:** Explain the *what* and *why* of your changes. Reference any related issues.
*   **Small, Focused PRs:** Aim for pull requests that address a single concern.
*   **CI/CD Green:** Ensure all automated checks (linting, testing, building) pass before submitting.
*   **Code Review:** Be responsive to feedback during the code review process.

## 6. ISSUE TRACKING

*   **Reporting Bugs:** Please use the provided [Bug Report Issue Template](.github/ISSUE_TEMPLATE/bug_report.md). Provide clear steps to reproduce, expected vs. actual behavior, and relevant environment details.
*   **Requesting Features:** Use the [Feature Request Issue Template](.github/ISSUE_TEMPLATE/feature_request.md).
*   **Discussions:** For general questions or ideas, please use the [GitHub Discussions](https://github.com/your-username/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension/discussions) tab.

## 7. PROJECT STANDARDS & GUIDES

*   **Tech Stack:** TypeScript, WXT, Vite, React (if applicable), TailwindCSS, Biome, Vitest, Playwright.
*   **Architecture:** Feature-sliced design principles (if applicable), SOLID, DRY, KISS.
*   **Security:** Adhere to DevSecOps principles. Sanitize all inputs, handle sensitive data securely.
*   **AI Integration:** Follow guidelines in [AGENTS.md](AGENTS.md) for interacting with LLM providers.

## 8. LICENSE

This project is licensed under the [CC BY-NC 4.0 License](LICENSE) - see the `LICENSE` file for details. Contributions are also subject to this license.

--- 

We appreciate your contribution to making Wryt-AI the best writing assistant available! For any questions, please reach out on GitHub or open an issue.

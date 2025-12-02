# Contributing to Wryt-AI-Grammar-Writing-Assistant-Browser-Extension

Thank you for your interest in contributing to the Wryt-AI-Grammar-Writing-Assistant-Browser-Extension project! We value your input and aim to foster a collaborative, high-velocity, and zero-defect development environment.

This project is managed under the **Apex Technical Authority** standards, emphasizing professional archival, clear architectural patterns, and rapid iteration.

## 1. Code of Conduct

All contributors are expected to adhere to the [CODE_OF_CONDUCT.md](https://github.com/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension/blob/main/CODE_OF_CONDUCT.md) (Please ensure this file exists in the repository. If not, it should be created).

## 2. Getting Started

To contribute, please follow these steps:

1.  **Fork the Repository:** Create your own fork of `https://github.com/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension`.
2.  **Clone Your Fork:** Clone your forked repository to your local machine.
    bash
    git clone https://github.com/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension.git
    cd Wryt-AI-Grammar-Writing-Assistant-Browser-Extension
    
3.  **Setup Development Environment:**
    *   Follow the setup instructions in the main `README.md`.
    *   Ensure you have Node.js, npm/yarn/pnpm, and the necessary browser development tools installed.
    *   Install dependencies:
        bash
        # Using npm (example, adapt if pnpm/yarn is preferred)
        npm install
        
4.  **Create a Branch:** Create a new branch for your feature or bug fix. Use a descriptive name.
    bash
    git checkout -b feature/your-feature-name
    # or
    git checkout -b bugfix/issue-description
    

## 3. Contribution Workflow

We follow a standard GitHub pull request workflow:

1.  **Develop Your Changes:** Make your changes in your local branch.
2.  **Write Tests:** Ensure your changes are covered by automated tests. Refer to the testing strategy outlined in the `README.md` and `AGENTS.md`.
3.  **Lint and Format:** Run the linter and formatter to ensure code quality and consistency.
    bash
    # Example commands - adapt based on the project's actual setup
    npm run lint
    npm run format
    
4.  **Commit Your Changes:** Commit your changes with clear, concise commit messages.
    bash
    git add .
    git commit -m "feat: Add new feature X for writing assistant"
    # or
    git commit -m "fix: Resolve bug Y in LLM waterfall"
    
5.  **Push Your Branch:** Push your branch to your fork on GitHub.
    bash
    git push origin feature/your-feature-name
    
6.  **Open a Pull Request:** Open a Pull Request from your branch to the `main` branch of the `chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension` repository.
    *   **Title:** Provide a clear and concise title for your PR.
    *   **Description:** Explain the changes made, the problem they solve, and any relevant context. Reference any related issues.
    *   **Link to Issues:** If applicable, link to the issue your PR addresses (e.g., `Fixes #123`).

## 4. Code Standards & Guidelines

*   **Language:** TypeScript (Strict mode is enforced).
*   **Framework:** React.
*   **Styling:** Tailwind CSS.
*   **Bundler:** Vite.
*   **Extension Framework:** WXT.
*   **Architecture:** Feature-Sliced Design (FSD) is preferred. Follow principles of SOLID, DRY, and YAGNI.
*   **AI Integration:** Ensure AI integrations (Gemini, Groq, OpenRouter) are robust, handle errors gracefully, and adhere to API best practices.
*   **Testing:** All new features or significant bug fixes must include comprehensive unit and/or integration tests.
*   **Code Reviews:** All pull requests will be reviewed by core maintainers. Be prepared to address feedback and iterate on your changes.

## 5. Reporting Issues

If you find a bug or have a feature request, please open an issue on the GitHub repository.

*   **Bug Reports:** Provide a clear title, a detailed description of the bug, steps to reproduce it, expected behavior, and actual behavior. Include relevant environment details (browser, OS, etc.).
*   **Feature Requests:** Describe the desired feature, explain why it would be beneficial, and provide use cases.

## 6. Architectural Principles (AI Agent Directives)

As per the `AGENTS.md` file, this project adheres to the following principles:

*   **AI Agent Alignment:** All code should be designed to be understandable and maintainable by AI agents. This includes clear naming, modular design, and comprehensive documentation.
*   **LLM Waterfall:** Understand and contribute to the multi-LLM waterfall strategy. Ensure new integrations maintain the spirit of leveraging multiple models for optimal results.
*   **Technical Editor Focus:** Prioritize the core functionality of elevating writing through grammar correction, brand voice enforcement, and speech-to-text optimization.
*   **Security:** Follow the guidelines in `.github/SECURITY.md`. Prioritize security best practices, especially when handling API keys and user data.

## 7. Communication

*   **Primary Channel:** GitHub Issues and Pull Requests are the primary means of communication.
*   **Questions:** If you have questions, please ask them in the relevant issue or PR, or consider opening a discussion.

By contributing, you agree to uphold these standards and help us build a powerful, reliable, and intelligent writing assistant.

Thank you for contributing!

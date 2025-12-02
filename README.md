<!-- Hero Banner Placeholder: Replace with your project's custom banner -->
<p align="center">
  <a href="https://github.com/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension">
    <img src="https://assets.website-files.com/62be207559e358b4385a21e0/62be207559e35824535a2283_hero-banner-image-1.png" alt="Wryt AI Banner" width="full">
  </a>
</p>

<p align="center">
  <!-- Build Status -->
  <a href="https://github.com/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension/actions/workflows/ci.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension/ci.yml?branch=main&style=flat-square" alt="Build Status">
  </a>
  <!-- Code Coverage -->
  <a href="https://codecov.io/gh/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension">
    <img src="https://img.shields.io/codecov/c/github/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension?style=flat-square&token=YOUR_CODECOV_TOKEN_HERE" alt="Code Coverage">
  </a>
  <!-- Tech Stack -->
  <img src="https://img.shields.io/badge/Stack-TS%20%7C%20React%20%7C%20WXT%20%7C%20TailwindCSS-informational?style=flat-square&logo=typescript&logoColor=white&color=blueviolet" alt="Tech Stack">
  <!-- Lint/Format -->
  <img src="https://img.shields.io/badge/Lint%2FFmt-Biome-333333?style=flat-square&logo=biome&logoColor=white" alt="Biome">
  <!-- License -->
  <a href="https://github.com/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey?style=flat-square" alt="License">
  </a>
  <!-- GitHub Stars -->
  <a href="https://github.com/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension/stargazers">
    <img src="https://img.shields.io/github/stars/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension?style=flat-square&label=Stars&colorB=586069" alt="GitHub Stars">
  </a>
  <!-- Version -->
  <img src="https://img.shields.io/github/package-json/v/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension?style=flat-square" alt="Version">
</p>

<p align="center">
  <a href="https://github.com/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension/stargazers">
    <img alt="Star ⭐ this Repo" src="https://img.shields.io/badge/Star%20%E2%AD%90%20this%20Repo-lightgrey?style=social&logo=github" />
  </a>
</p>

---

## 🚀 Wryt-AI-Grammar-Writing-Assistant-Browser-Extension

**Wryt-AI** is an advanced open-source browser extension designed to revolutionize your writing experience across the web. It intelligently elevates your text with a dynamic multi-LLM waterfall system (Gemini, Groq, OpenRouter) for unparalleled grammar, brand voice enforcement, and integrated speech-to-text capabilities, acting as a hyper-aware technical editor in every text field you encounter.

### 🏛️ Architecture: Feature-Sliced Design (FSD)

Wryt-AI is architected using the **Feature-Sliced Design (FSD)** methodology, providing a robust, scalable, and maintainable structure. This approach organizes the codebase into distinct layers (App, Pages, Widgets, Features, Entities, Shared) and slices, enforcing strict boundaries to manage complexity and promote reusability.

mermaid
graph TD
    A[App] --> P[Pages]
    P --> W[Widgets]
    W --> F[Features]
    F --> E[Entities]
    E --> S[Shared]

    subgraph Layers
        direction LR
        L1(App)
        L2(Pages)
        L3(Widgets)
        L4(Features)
        L5(Entities)
        L6(Shared)
    end

    style L1 fill:#f9f,stroke:#333,stroke-width:2px;
    style L2 fill:#bbf,stroke:#333,stroke-width:2px;
    style L3 fill:#bfb,stroke:#333,stroke-width:2px;
    style L4 fill:#fbb,stroke:#333,stroke-width:2px;
    style L5 fill:#eef,stroke:#333,stroke-width:2px;
    style L6 fill:#ffc,stroke:#333,stroke-width:2px;


*   **App:** Global configuration and routing.
*   **Pages:** Full-page components specific to the extension's UI (e.g., popup, options).
*   **Widgets:** Standalone UI blocks that can be placed on pages (e.g., AI suggestion box).
*   **Features:** Business logic and UI related to a specific user story (e.g., grammar correction, brand voice detection).
*   **Entities:** Domain-specific data and logic (e.g., LLM models, user settings).
*   **Shared:** Reusable UI components, utilities, and constants independent of business logic.

### 📋 Table of Contents

*   [🚀 Wryt-AI-Grammar-Writing-Assistant-Browser-Extension](#-wryt-ai-grammar-writing-assistant-browser-extension)
    *   [🏛️ Architecture: Feature-Sliced Design (FSD)](#️-architecture-feature-sliced-design-fsd)
    *   [📋 Table of Contents](#-table-of-contents)
    *   [🤖 AI Agent Directives](#-ai-agent-directives)
    *   [⚙️ Development Standards & Setup](#️-development-standards--setup)
        *   [Prerequisites](#prerequisites)
        *   [Installation](#installation)
        *   [Running Locally](#running-locally)
        *   [Build for Production](#build-for-production)
        *   [Available Scripts](#available-scripts)
        *   [Core Principles](#core-principles)
    *   [🤝 Contributing](#-contributing)
    *   [🛡️ Security](#️-security)
    *   [📝 License](#-license)
    *   [☕ Support Wryt-AI](#udos-support-wryt-ai)

### 🤖 AI Agent Directives

<details>
<summary><strong>Expand for AI Agent Operating Instructions</strong></summary>

# SYSTEM: APEX TECHNICAL AUTHORITY & ELITE ARCHITECT (DECEMBER 2025 EDITION)

## 1. IDENTITY & PRIME DIRECTIVE
**Role:** You are a Senior Principal Software Architect and Master Technical Copywriter with **40+ years of elite industry experience**. You operate with absolute precision, enforcing FAANG-level standards and the wisdom of "Managing the Unmanageable."
**Context:** Current Date is **December 2025**. You are building for the 2026 standard.
**Output Standard:** Deliver **EXECUTION-ONLY** results. No plans, no "reporting"—only executed code, updated docs, and applied fixes.
**Philosophy:** "Zero-Defect, High-Velocity, Future-Proof."

---

## 2. INPUT PROCESSING & COGNITION
*   **SPEECH-TO-TEXT INTERPRETATION PROTOCOL:**
    *   **Context:** User inputs may contain phonetic errors (homophones, typos).
    *   **Semantic Correction:** **STRICTLY FORBIDDEN** from executing literal typos. You must **INFER** technical intent based on the project context.
    *   **Logic Anchor:** Treat the `README.md` as the **Single Source of Truth (SSOT)**.
*   **MANDATORY MCP INSTRUMENTATION:**
    *   **No Guessing:** Do not hallucinate APIs.
    *   **Research First:** Use `linkup`/`brave` to search for **December 2025 Industry Standards**, **Security Threats**, and **2026 UI Trends**.
    *   **Validation:** Use `docfork` to verify *every* external API signature.
    *   **Reasoning:** Engage `clear-thought-two` to architect complex flows *before* writing code.

---

## 3. CONTEXT-AWARE APEX TECH STACKS (LATE 2025 STANDARDS)
**Directives:** This project, `Wryt-AI-Grammar-Writing-Assistant-Browser-Extension`, is a modern browser extension built with TypeScript, React, and WXT.

*   **PRIMARY SCENARIO: WEB / APP / EXTENSION (Modern Frontend)**
    *   **Stack:** This project leverages **TypeScript 6.x (Strict)** for robust type safety, **React 19+** for a declarative UI, **WXT** for streamlined browser extension development, **Vite 7 (Rolldown)** for fast bundling, and **TailwindCSS v4** for utility-first styling.
    *   **Architecture:** Adheres to the **Feature-Sliced Design (FSD)**, ensuring a scalable and maintainable codebase by organizing features into layers and slices, promoting modularity and clear dependencies.
    *   **AI Integration:** Deeply integrated with a **multi-LLM waterfall system** (Gemini, Groq, OpenRouter) for advanced natural language processing, grammar correction, style enforcement, and speech-to-text optimization. Prioritize modular adapters for each LLM, robust fallback mechanisms, and secure API key management.
    *   **Linting & Formatting:** Uses **Biome** for lightning-fast, all-in-one linting and formatting, ensuring code quality and consistency.
    *   **Testing:** Employs **Vitest** for unit and component testing, and **Playwright** for end-to-end browser extension testing, covering core functionalities and user interactions across multiple browsers.

---

## 4. APEX NAMING CONVENTION (THE "STAR VELOCITY" ENGINE)
**Formula:** `<Product-Name>-<Primary-Function>-<Platform>-<Type>`
**Format:** `Title-Case-With-Hyphens` (e.g., `ChatFlow-AI-Powered-Real-Time-Chat-Web-App`)
**Compliance:** The current repository name, `Wryt-AI-Grammar-Writing-Assistant-Browser-Extension`, strictly adheres to this standard.

---

## 5. REPOSITORY INTEGRITY & PURPOSE PIVOT PROTOCOL
**Current Status:** This repository is professionally maintained and active. No pivot or archival is required.

---

## 6. CODE QUALITY & DEVELOPMENT STANDARDS
*   **Principles:** Adhere to **SOLID**, **DRY** (Don't Repeat Yourself), and **YAGNI** (You Ain't Gonna Need It) principles.
*   **Code Review:** All changes require thorough code review by at least one other senior engineer.
*   **Documentation:** In-line code comments for complex logic, clear JSDoc/TSDoc for public APIs.
*   **Commit Messages:** Use Conventional Commits specification.

---

## 7. VERIFICATION & AUTOMATION PROTOCOL
*   **Continuous Integration (CI):** All pushes to `main` and pull requests must pass automated CI checks (linting, testing, build).
*   **Automated Testing:**
    *   `pnpm test`: Run all unit and component tests with Vitest.
    *   `pnpm test:e2e`: Run end-to-end tests with Playwright across supported browsers.
*   **Code Formatting:** `pnpm lint:fix` (using Biome) automatically formats the codebase.
*   **Build Verification:** `pnpm build` must complete successfully, producing optimized extension bundles for all target browsers.

---

## 8. SECURITY & COMPLIANCE
*   **Dependency Audits:** Regularly audit dependencies for vulnerabilities (`pnpm audit`).
*   **API Key Management:** Strictly use environment variables for API keys; never hardcode. Implement secure credential storage and retrieval for extensions.
*   **Content Security Policy (CSP):** Maintain a strict CSP for the browser extension to mitigate XSS and other injection attacks.
*   **Data Privacy:** Adhere to GDPR, CCPA, and other relevant data privacy regulations, especially concerning user input sent to LLMs.
*   **Secure Coding Practices:** Follow OWASP Top 10 for web applications and specific secure coding guidelines for browser extensions.

---

## 9. RELEASE MANAGEMENT PROTOCOL
*   **Versioning:** Semantic Versioning (SemVer) adhered to strictly.
*   **Release Process:** Automated changelog generation, GitHub Releases, and publishing to Chrome Web Store, Firefox Add-ons, etc.
*   **Rollback Strategy:** Clear procedures for hotfixes and rolling back problematic releases.

---
</details>

### ⚙️ Development Standards & Setup

This section outlines the process for setting up and developing the Wryt-AI Browser Extension locally.

#### Prerequisites

Ensure you have the following installed:

*   Node.js (LTS version, e.g., 20.x)
*   pnpm (recommended package manager)
    bash
    npm install -g pnpm
    

#### Installation

1.  **Clone the repository:**
    bash
    git clone https://github.com/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension.git
    cd Wryt-AI-Grammar-Writing-Assistant-Browser-Extension
    
2.  **Install dependencies:**
    bash
    pnpm install
    
3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory based on `.env.example`.
    
    # Example .env content
    VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    VITE_GROQ_API_KEY=YOUR_GROQ_API_KEY
    VITE_OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY
    # Add other necessary API keys or configurations
    

#### Running Locally

To run the extension in development mode with hot-reloading:

bash
pnpm dev


This will build the extension and watch for changes. You can then load the unpacked extension into your browser:

*   **Chrome:**
    1.  Go to `chrome://extensions/`.
    2.  Enable "Developer mode".
    3.  Click "Load unpacked" and select the `dist/chrome` folder within your project.
*   **Firefox:**
    1.  Go to `about:debugging#/runtime/this-firefox`.
    2.  Click "Load Temporary Add-on..." and select the `dist/firefox/manifest.json` file.

#### Build for Production

To build the optimized extension for production:

bash
pnpm build


This will generate production-ready bundles in the `dist/` directory (e.g., `dist/chrome`, `dist/firefox`).

#### Available Scripts

| Script             | Description                                                   |
| :----------------- | :------------------------------------------------------------ |
| `pnpm dev`         | Starts the development server with hot-reloading.             |
| `pnpm build`       | Builds the extension for production across all targets.       |
| `pnpm lint`        | Runs Biome linter and formatter checks.                       |
| `pnpm lint:fix`    | Runs Biome linter and formatter, automatically fixing issues. |
| `pnpm test`        | Runs unit and component tests with Vitest.                    |
| `pnpm test:e2e`    | Runs end-to-end tests with Playwright.                        |
| `pnpm coverage`    | Generates test coverage report.                               |
| `pnpm format`      | Formats the codebase using Biome.                             |
| `pnpm typecheck`   | Checks TypeScript types.                                      |

#### Core Principles

We adhere strictly to modern software engineering principles:

*   **SOLID Principles:** Ensuring maintainable, flexible, and understandable code.
*   **DRY (Don't Repeat Yourself):** Minimizing redundancy to improve maintainability.
*   **YAGNI (You Ain't Gonna Need It):** Developing only features that are immediately required.
*   **Code-first Documentation:** Clear, concise inline comments and JSDoc/TSDoc for complex logic and public APIs.
*   **Atomic Commits:** Small, focused commits that are easy to review and revert.

### 🤝 Contributing

We welcome contributions from the community! Please refer to our [CONTRIBUTING.md](https://github.com/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension/blob/main/.github/CONTRIBUTING.md) for detailed guidelines on how to get started, report bugs, suggest features, and submit pull requests.

### 🛡️ Security

Security is paramount. Please review our [SECURITY.md](https://github.com/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension/blob/main/.github/SECURITY.md) to understand our security policies and how to report vulnerabilities responsibly.

### 📝 License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** License. See the [LICENSE](https://github.com/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension/blob/main/LICENSE) file for details.

### ☕ Support Wryt-AI

If you find Wryt-AI helpful, please consider starring this repository ⭐ to show your support!

---

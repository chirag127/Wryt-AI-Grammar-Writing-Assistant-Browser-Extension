<p align="center">
  <img src="https://github.com/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension/blob/main/docs/assets/wryt-logo.png?raw=true" alt="Wryt Logo" width="150"/>
</p>
<h1 align="center">Wryt-AI-Grammar-Writing-Assistant-Browser-Extension</h1>

<p align="center">
  <a href="https://github.com/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension/actions/workflows/ci.yml">
    <img src="https://github.com/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension/actions/workflows/ci.yml/badge.svg" alt="Build Status" style="max-width: 100%;">
  </a>
  <a href="https://codecov.io/gh/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension">
    <img src="https://codecov.io/gh/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension/branch/main/graph/badge.svg?token=YOUR_CODECOV_TOKEN" alt="Code Coverage" style="max-width: 100%;">
  </a>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" style="max-width: 100%;">
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" style="max-width: 100%;">
  <img src="https://img.shields.io/badge/WXT-FF4E00?style=flat-square&logo=browserstack&logoColor=white" alt="WXT" style="max-width: 100%;">
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" style="max-width: 100%;">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" style="max-width: 100%;">
  <img src="https://img.shields.io/badge/Lint_Format-Biome-blue?style=flat-square&logo=biome" alt="Biome" style="max-width: 100%;">
  <img src="https://img.shields.io/badge/Test-Vitest-6E9EE8?style=flat-square&logo=vitest" alt="Vitest" style="max-width: 100%;">
  <img src="https://img.shields.io/badge/E2E_Test-Playwright-2F80ED?style=flat-square&logo=playwright" alt="Playwright" style="max-width: 100%;">
  <img src="https://img.shields.io/badge/License-CC_BY--NC_4.0-lightgrey?style=flat-square" alt="License" style="max-width: 100%;">
  <img src="https://img.shields.io/github/stars/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension?style=flat-square&label=Stars&logo=github" alt="GitHub Stars" style="max-width: 100%;">
</p>

<p align="center">
  <a href="https://github.com/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension/stargazers">
    <img src="https://img.shields.io/github/stars/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension?style=social" alt="Star us on GitHub!">
  </a>
</p>


## 🚀 Overview

Wryt is an open-source, AI-powered browser extension designed to meticulously refine your writing across the web, employing a multi-LLM waterfall for unparalleled accuracy and adaptability. It acts as your personal, hyper-aware technical editor, ensuring grammatical precision, consistent brand voice, and seamless speech-to-text optimization in any text field.

## ✨ Features

*   **Multi-LLM Waterfall Architecture:** Dynamically leverages the strengths of Gemini, Groq, and OpenRouter APIs for optimal performance and accuracy.
*   **Real-time Grammar & Style Correction:** Instantly identifies and suggests improvements for grammatical errors, punctuation, and stylistic inconsistencies.
*   **Brand Voice Enforcement:** Custom-train Wryt to maintain your unique brand tone and specific terminology across all written content.
*   **Speech-to-Text Optimization:** Enhances the accuracy and coherence of dictated text, making voice input more reliable.
*   **Context-Aware Suggestions:** Provides intelligent, context-sensitive recommendations based on the surrounding text and document type.
*   **Open-Source & Extensible:** Built with transparency in mind, allowing community contributions and custom integrations.
*   **Cross-Browser Compatibility:** Seamlessly integrates with Chrome, Firefox, and other Chromium-based browsers via WXT.

## 🏗️ Architecture

Wryt employs a robust Feature-Sliced Design (FSD) architecture, ensuring modularity, scalability, and maintainability. The browser extension logic is separated into background, content, and UI scripts, communicating through a clear message passing system. AI interactions are managed by a dedicated service orchestrating a multi-LLM waterfall.

mermaid
graph TD
    A[Wryt Browser Extension] --> B(Background Script);
    A --> C(Content Script);
    A --> D(Popup/Options UI);

    B -- Messages --> C;
    C -- DOM Interaction --> E(Webpage Content);
    C -- Messages --> B;
    D -- State Sync/Messages --> B;

    B -- LLM Calls (Waterfall) --> F(Gemini API);
    B -- LLM Calls (Waterfall) --> G(Groq API);
    B -- LLM Calls (Waterfall) --> H(OpenRouter API);

    subgraph Feature-Sliced Design
        direction LR
        appLayer[App Layer] --> pagesLayer[Pages Layer];
        pagesLayer --> widgetsLayer[Widgets Layer];
        widgetsLayer --> featuresLayer[Features Layer];
        featuresLayer --> entitiesLayer[Entities Layer];
        entitiesLayer --> sharedLayer[Shared Layer];
    end

    subgraph Core Features
        I[Grammar & Style Check]
        J[Brand Voice Enforcement]
        K[Speech-to-Text Optimization]
    end

    C --> I;
    C --> J;
    C --> K;

    style appLayer fill:#f9f,stroke:#333,stroke-width:2px;
    style pagesLayer fill:#bbf,stroke:#333,stroke-width:2px;
    style widgetsLayer fill:#fbf,stroke:#333,stroke-width:2px;
    style featuresLayer fill:#ffc,stroke:#333,stroke-width:2px;
    style entitiesLayer fill:#ccf,stroke:#333,stroke-width:2px;
    style sharedLayer fill:#cfc,stroke:#333,stroke-width:2px;


## ⚙️ Tech Stack

*   **Language:** TypeScript (Strict Mode)
*   **Extension Framework:** WXT (Web Extension Toolkit)
*   **Frontend Library:** React 19+
*   **Build Tool:** Vite 7 (with Rolldown)
*   **Styling:** TailwindCSS v4 (JIT Mode)
*   **Linting & Formatting:** Biome
*   **Unit & Component Testing:** Vitest
*   **End-to-End Testing:** Playwright
*   **AI/LLM Integration:** Google Gemini API, Groq API, OpenRouter API
*   **Package Manager:** pnpm

## 🤖 AI Agent Directives

<details>
<summary><b>🤖 AI AGENT DIRECTIVES (INTERNAL PROTOCOL: APEX TECHNICAL AUTHORITY)</b></summary>

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
**Directives:** Detect the project type and apply the corresponding **Apex Toolchain**. This repository, `Wryt-AI-Grammar-Writing-Assistant-Browser-Extension`, is a TypeScript-based browser extension leveraging AI.

*   **PRIMARY SCENARIO: WEB / APP / EXTENSION (TypeScript)**
    *   **Stack:** This project leverages **TypeScript 6.x (Strict Mode)**, **WXT (Web Extension Toolkit)** for robust browser extension development, **React 19+** for UI components, and **Vite 7 (with Rolldown)** as the build tool. Styling is managed with **TailwindCSS v4 (JIT Mode)**.
    *   **LLM Integration:** Deeply integrated with a **multi-LLM waterfall** strategy (e.g., Gemini, Groq, OpenRouter) for intelligent text analysis and generation. Prioritize modular design, clear API contracts, and robust error handling for all AI model interactions, including intelligent fallback mechanisms.
    *   **Architecture:** Adheres to the **Feature-Sliced Design (FSD)** methodology, ensuring clear separation of concerns across layers (app, pages, widgets, features, entities, shared) and slices, promoting scalability and maintainability for the extension's complex UI and background logic.
    *   **Linting & Formatting:** Utilizes **Biome** for lightning-fast, comprehensive linting and code formatting, ensuring consistent code quality and style.
    *   **Testing:** Employs **Vitest** for unit and component testing of React components and core logic, and **Playwright** for end-to-end (E2E) testing across different browser environments to ensure extension functionality and UI interactions are robust.

*   **SECONDARY SCENARIO B: SYSTEMS / PERFORMANCE (Low Level) - *Not applicable for this project's primary function. Reference only for potential Rust/Go microservices.***
    *   **Stack:** Rust (Cargo) or Go (Modules).
    *   **Lint:** Clippy / GolangCI-Lint.
    *   **Architecture:** Hexagonal Architecture (Ports & Adapters).

*   **SECONDARY SCENARIO C: DATA / AI / SCRIPTS (Python) - *Not applicable for this project's primary function. Reference only for potential Python backend services.***
    *   **Stack:** uv (Manager), Ruff (Linter), Pytest (Test).
    *   **Architecture:** Modular Monolith or Microservices.

---

## 4. ARCHITECTURAL PATTERNS & PRINCIPLES
*   **Feature-Sliced Design (FSD):** Strictly apply FSD for structuring the codebase, organizing features into layers and slices (e.g., `app`, `pages`, `widgets`, `features`, `entities`, `shared`).
*   **SOLID Principles:** Ensure adherence to Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.
*   **DRY (Don't Repeat Yourself):** Promote reusable components, hooks, and utility functions.
*   **YAGNI (You Aren't Gonna Need It):** Avoid over-engineering; implement features only when truly required.
*   **Atomic Design:** For React components, follow Atomic Design principles (Atoms, Molecules, Organisms, Templates, Pages) to build a scalable and maintainable UI system.
*   **Reactive Programming:** Utilize modern React patterns (hooks, context API, state managers like Zustand/Jotai if needed) for efficient state management and reactivity.
*   **Modularity & Decoupling:** Components and services should be highly modular and loosely coupled, facilitating independent development, testing, and maintenance.

---

## 5. VERIFICATION & QUALITY ASSURANCE PROTOCOL
To ensure "Zero-Defect, High-Velocity, Future-Proof" operation, the following commands are the **absolute minimum** for verification:

*   **Dependency Management:**
    bash
    pnpm install
    
*   **Build & Bundling:**
    bash
    pnpm run build
    
*   **Linting & Formatting (Biome):**
    bash
    pnpm run lint
    pnpm run format
    
*   **Unit & Component Testing (Vitest):**
    bash
    pnpm run test
    
*   **End-to-End Testing (Playwright):**
    bash
    pnpm run test:e2e
    
*   **Type Checking (TypeScript):**
    bash
    pnpm run type-check
    
*   **Dev Server (WXT):
    bash
    pnpm run dev
    

**Mandatory:** Before any pull request or deployment, all checks MUST pass with zero errors. Any deviation requires immediate remediation.

---
</details>

## 🚀 Getting Started

Follow these steps to set up Wryt for development or local testing.

### Prerequisites

Ensure you have the following installed:

*   Node.js (LTS version, v18+ recommended)
*   pnpm (v8+ recommended): `npm install -g pnpm`
*   A modern web browser (Chrome, Firefox, Edge, Brave, etc.)

### Installation

1.  **Clone the repository:**
    bash
    git clone https://github.com/chirag127/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension.git
    cd Wryt-AI-Grammar-Writing-Assistant-Browser-Extension
    

2.  **Install dependencies:**
    bash
    pnpm install
    

3.  **Environment Variables:**
    Create a `.env` file in the root directory based on `.env.example`. You will need API keys for the LLM providers (Gemini, Groq, OpenRouter).
    
    # Example .env content
    VITE_GEMINI_API_KEY=your_gemini_api_key
    VITE_GROQ_API_KEY=your_groq_api_key
    VITE_OPENROUTER_API_KEY=your_openrouter_api_key
    

4.  **Start Development Server:**
    bash
    pnpm run dev
    
    This will start the WXT development server. Follow the instructions in your console to load the unpacked extension into your browser.

### Development Scripts

| Script              | Description                                                          |
| :------------------ | :------------------------------------------------------------------- |
| `pnpm dev`          | Starts the development server and watches for changes.               |
| `pnpm build`        | Builds the production-ready extension for various browsers.          |
| `pnpm lint`         | Lints the codebase using Biome to ensure code quality.               |
| `pnpm format`       | Formats the codebase using Biome.                                    |
| `pnpm test`         | Runs unit and component tests with Vitest.                           |
| `pnpm test:e2e`     | Runs end-to-end tests across browsers with Playwright.               |
| `pnpm type-check`   | Performs static type checking using TypeScript.                      |
| `pnpm storybook`    | Launches Storybook for isolated component development (if integrated). |

## 🧪 Testing

Wryt utilizes a comprehensive testing suite to ensure reliability and stability:

*   **Unit Tests:** Written with Vitest to cover individual functions, components, and services.
*   **Component Tests:** Vitest is also used for testing React components in isolation.
*   **End-to-End (E2E) Tests:** Playwright is employed for robust E2E tests, simulating real user interactions across different browser environments to verify core extension functionalities and UI flows.

To run all tests:

bash
pnpm run test
pnpm run test:e2e


## 🤝 Contributing

We welcome contributions from the community! Please refer to our [CONTRIBUTING.md](.github/CONTRIBUTING.md) for detailed guidelines on how to get started, report bugs, suggest features, and submit pull requests.

## 📜 License

This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) License](LICENSE).

## 🛡️ Security

Security is a top priority. Please review our [SECURITY.md](.github/SECURITY.md) to understand our security policies and learn how to report vulnerabilities responsibly.

## ⭐ Show Your Support

If you find Wryt useful, please consider giving us a star ⭐ on GitHub! Your support helps us grow and improve the project.


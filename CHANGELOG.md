# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2025-11-24

### Added

-   **Draggable UI**: The extension sidebar is now draggable and remembers its position across sessions.
-   **AI Prompt Enhancement**: New backend logic to enhance user prompts for AI chat websites (ChatGPT, Claude, Gemini, Copilot).
-   **Biome Integration**: Replaced ESLint and Prettier with Biome for faster, unified linting and formatting.
-   **Permissions**: Added `tabs` permission and host permissions for major AI chat platforms to support prompt enhancement.

### Changed

-   **Code Style**: Standardized codebase with Biome (4-space indent, double quotes, semicolons).
-   **Manifest**: Updated to version 1.2.0.
-   **Dependencies**: Removed `eslint`, `prettier`, and related packages in favor of `@biomejs/biome`.

### Fixed

-   Improved error handling in AI provider waterfall logic.
-   Fixed potential syntax errors in prompt template generation.

## [1.1.0] - 2025-11-23

### Added

-   **Multi-Provider Support**: Added support for Google Gemini, Groq, OpenRouter, Cerebras, and SambaNova.
-   **Waterfall Failover**: Implemented intelligent failover system to switch providers on failure.
-   **Speech-to-Text Correction**: Specialized prompt engineering for fixing dictation errors.
-   **4-Tier Analysis**: Critical Grammar, Clarity, Engagement, and Delivery & Tone categories.
-   **Brand Voice**: Added setting to enforce specific brand voice guidelines.
-   **Originality Check**: Added plagiarism/cliché detection.

### Changed

-   Updated UI to support new analysis categories.
-   Enhanced options page with drag-and-drop provider ordering.

## [1.0.0] - 2025-11-20

### Added

-   Initial release of Wryt.
-   Basic grammar and spell checking.
-   Single AI provider integration.
-   Context menu integration.

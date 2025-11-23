# Wryt - AI Writing & Grammar Checker

A free, multi-provider, resilient browser extension that acts as a Grammarly alternative using a "Waterfall" of free LLM APIs.

## Features

-   **Waterfall Failover**: Automatically switches between Gemini, Groq, Cerebras, SambaNova, and OpenRouter if one fails.
-   **Privacy First**: Your API keys are stored locally. No data is sent to our servers.
-   **Modern UI**: Glassmorphism design with Shadow DOM isolation.
-   **Customizable**: Reorder providers, select specific models, and bring your own keys.

## Supported Providers & Models

-   **Google Gemini**: Gemini 2.0 Flash, 1.5 Pro, 1.5 Flash
-   **Groq**: Llama 3.3 70B, Mixtral 8x7B, Gemma 2
-   **Cerebras**: Llama 3.1 8B/70B (Fast Inference)
-   **SambaNova**: Llama 3.1 405B, DeepSeek R1
-   **OpenRouter**: Access to DeepSeek, Qwen, and more.

## Installation

1.  Open Chrome/Edge and go to `chrome://extensions`.
2.  Enable **Developer Mode** (top right).
3.  Click **Load unpacked**.
4.  Select this folder (`Wryt-AI-Writing-and-Grammar-Checker-Browser-Extension`).

## Configuration

1.  Click the extension icon or go to the **Options** page.
2.  Enter your API keys for the providers you want to use:
    -   **Google Gemini**: [Get Key](https://aistudio.google.com/app/apikey)
    -   **Groq**: [Get Key](https://console.groq.com/keys)
    -   **Cerebras**: [Get Key](https://inference.cerebras.ai/)
    -   **SambaNova**: [Get Key](https://cloud.sambanova.ai/)
    -   **OpenRouter**: [Get Key](https://openrouter.ai/keys)
3.  Select your preferred model for each provider.
4.  Drag to reorder priority.
5.  Click **Save Settings**.

## Usage

1.  Navigate to any website with a text input.
2.  Type your text.
3.  Wait 1.5 seconds after typing.
4.  If grammar issues are found, a "Magic Card" tooltip will appear.
5.  Click **Fix it** to apply the changes.

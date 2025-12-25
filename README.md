# 🎙️ VoiceContext
> **Context-Aware Voice Typing for the Web, powered by Gemini 2.0**

VoiceContext changes how you interact with the web. Instead of just "speech-to-text", it uses AI to understand **where you are** and **what you need**, transforming your spoken thoughts into perfectly formatted content instantly.

## 🚀 Key Features

*   **🧠 Context Intelligence**: Automatically detects if you are on **Gmail**, **Twitter/X**, or **LinkedIn** and adapts the writing style.
    *   *Gmail* -> Professional, polite emails.
    *   *Twitter* -> Insightful, viral micro-blogs (under 280 chars).
    *   *LinkedIn* -> Engaging career updates.
*   **⚡ Powered by Gemini 2.0**: Uses Google's latest `gemini-2.0-flash` model for lightning-fast reasoning and natural language generation.
*   **🎯 One-Click Insertion**: Generates the text and inserts it directly into the active text box (no copy-pasting required).
*   **🗣️ Continuous Listening**: Intelligent voice recognition that doesn't cut you off when you pause to think.

## 🛠️ How It Works

1.  **Click & Speak**: Tap the microphone icon and speak naturally (e.g., *"Write a thank you note to Sarah for the meeting"*).
2.  **AI Processing**: The extension captures your voice, identifies the website you are on (Gmail, etc.), and sends a contextual prompt to the Gemini API.
3.  **Instant Draft**: In seconds, a polished draft appears in the popup.
4.  **Insert**: Click "Insert Text" to drop it straight into your email or post.

## 💻 Tech Stack

*   **Frontend**: HTML5, Vanilla CSS (Glassmorphism UI), JavaScript (ES6+).
*   **AI Model**: Google Gemini 2.0 Flash (`gemini-2.0-flash`).
*   **Core APIs**: 
    *   Chrome Extension Manifest V3
    *   Web Speech API (Native Browser Speech-to-Text)
    *   Chrome Scripting & Storage API

## 📦 Installation (Local Dev)

1.  Clone this repository:
    ```bash
    git clone https://github.com/Advaith-S2/Voice-Context.git
    ```
2.  Open Chrome and navigate to `chrome://extensions`.
3.  Enable **Developer Mode** (top right toggle).
4.  Click **Load Unpacked**.
5.  Select the folder where you cloned this repo.
6.  Pin the extension and add your Gemini API Key in the settings!

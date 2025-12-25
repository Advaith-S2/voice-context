/**
 * gemini-context.js
 * Handles context detection and Gemini API interactions.
 */

const CONTEXTS = {
    GMAIL: {
        id: 'GMAIL',
        pattern: /mail\.google\.com/,
        prompt: "You are a professional email assistant. Rewrite the following voice transcript into a SINGLE, polished, and professional email draft. Choose the best tone based on the context. Do not provide multiple options or meta-commentary. Transcript: "
    },
    TWITTER: {
        id: 'TWITTER',
        pattern: /twitter\.com|x\.com/,
        prompt: "You are a social media manager. Convert the following transcript into an engaging tweet. Include relevant emojis and 2-3 trending hashtags. Keep it under 280 characters. Transcript: "
    },
    LINKEDIN: {
        id: 'LINKEDIN',
        pattern: /linkedin\.com/,
        prompt: "You are a professional networking expert. Rewrite the following transcript into a SINGLE professional LinkedIn post. Focus on engagement and career value. Do not provide options. Transcript: "
    },
    GENERIC: {
        id: 'GENERIC',
        pattern: /.*/, // Fallback
        prompt: "Fix the grammar and clarity of the following text. Keep the tone neutral and professional. Transcript: "
    }
};

export function detectContext(url) {
    if (!url) return CONTEXTS.GENERIC;

    if (CONTEXTS.GMAIL.pattern.test(url)) return CONTEXTS.GMAIL;
    if (CONTEXTS.TWITTER.pattern.test(url)) return CONTEXTS.TWITTER;
    if (CONTEXTS.LINKEDIN.pattern.test(url)) return CONTEXTS.LINKEDIN;

    return CONTEXTS.GENERIC;
}

// Hardcoded fallback list based on User's available models.
const FALLBACK_MODELS = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-001",
    "gemini-flash-latest",
    "gemini-2.5-flash"
];

export async function generateText(transcript, context, apiKey) {
    if (!apiKey) {
        throw new Error("Gemini API Key is missing. Please set it in the extension.");
    }

    const promptText = `${context.prompt} "${transcript}"`;
    let lastError = null;

    for (const modelName of FALLBACK_MODELS) {
        try {
            console.log(`Attempting model: ${modelName}`);
            return await callGemini(modelName, promptText, apiKey);
        } catch (error) {
            console.warn(`Model ${modelName} failed:`, error.message);
            // If it's a "Not Found" or "Rate Limit", we try the next one.
            // If it's "Invalid Key", we should probably stop, but for simplicity we loop.
            lastError = error;
        }
    }

    throw new Error(`All models failed. Last error: ${lastError?.message}. \n\nAttempted models: ${FALLBACK_MODELS.join(", ")}`);
}

export async function debugModelList(apiKey) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        if (data.models) {
            return data.models.map(m => m.name).join("\n");
        }
        return "No models found in list response.";
    } catch (e) {
        return "Failed to fetch model list: " + e.message;
    }
}

async function callGemini(modelName, promptText, apiKey) {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;

    const response = await fetch(`${API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: promptText }]
            }]
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`[${response.status}] ${modelName}: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
    } else {
        throw new Error("No response generated from Gemini.");
    }
}

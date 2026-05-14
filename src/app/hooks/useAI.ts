import { getFallbackResponse, formatFallbackMessage } from "../data/fallbackAI";

interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const SYSTEM_PROMPT = `You are Aura, a friendly, intelligent, and emotionally supportive beauty assistant created by Habbah. Your tone is warm, personal, and empowering — like a knowledgeable best friend who happens to be a skincare expert.

You provide safe, personalized skincare and beauty advice tailored to the user's skin type and concerns. You never make medical diagnoses or claims. You respond with empathy first, then practical advice.

When giving skincare advice, structure your response as:
1. A warm, personal acknowledgment of their concern
2. A brief explanation of why this happens
3. Personalized routine steps (morning and/or night)
4. Optional product suggestions with key ingredients to look for

Keep responses conversational, encouraging, and never overwhelming. Use emojis thoughtfully to add warmth. Always end with an encouraging note or follow-up question.`;

export async function sendToAI(
  userMessage: string,
  apiKey: string,
  chatHistory: AIMessage[],
  userProfile: { name: string; skinType: string; concerns: string[] }
): Promise<string> {
  // Add profile context to system prompt if available
  let systemContent = SYSTEM_PROMPT;
  if (userProfile.name) {
    systemContent += `\n\nUser Profile: Name: ${userProfile.name}. Skin type: ${userProfile.skinType || "not specified"}. Concerns: ${userProfile.concerns.join(", ") || "not specified"}. Always use their name naturally in responses.`;
  }

  if (!apiKey) {
    // Use fallback
    const fallback = getFallbackResponse(userMessage);
    return formatFallbackMessage(fallback);
  }

  try {
    const messages: AIMessage[] = [
      { role: "system", content: systemContent },
      ...chatHistory.slice(-10), // Keep last 10 messages for context
      { role: "user", content: userMessage },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 600,
        temperature: 0.75,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("OpenAI error:", err);
      throw new Error(err.error?.message || "API error");
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "I'm here for you! Could you tell me more about your skin concern? 💜";
  } catch (error) {
    console.error("AI error, using fallback:", error);
    const fallback = getFallbackResponse(userMessage);
    return formatFallbackMessage(fallback);
  }
}

export async function transcribeAudio(audioBlob: Blob, apiKey: string): Promise<string> {
  if (!apiKey) {
    return "";
  }
  try {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");
    formData.append("model", "whisper-1");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) throw new Error("Transcription failed");
    const data = await response.json();
    return data.text || "";
  } catch {
    return "";
  }
}

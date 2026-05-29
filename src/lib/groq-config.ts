import Constants from "expo-constants";

interface GroqExtra {
  groqApiKey?: string;
}

export function getGroqApiKey(): string {
  const extra = Constants.expoConfig?.extra as GroqExtra | undefined;
  const apiKey = extra?.groqApiKey?.trim();

  if (!apiKey) {
    throw new Error("Groq API key is not configured.");
  }

  return apiKey;
}

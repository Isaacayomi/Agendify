import { getGroqApiKey } from "@/src/lib/groq-config";

export interface GroqTip {
  topic: string;
  tip: string;
}

interface GroqTipsPayload {
  tips: GroqTip[];
}

interface GroqChatMessage {
  content?: string | null;
}

interface GroqChatChoice {
  message?: GroqChatMessage;
}

interface GroqChatResponse {
  choices?: GroqChatChoice[];
}

function isGroqTipArray(value: unknown): value is GroqTip[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as GroqTip).topic === "string" &&
        typeof (item as GroqTip).tip === "string"
    )
  );
}

function parseTipsPayload(content: string): GroqTip[] {
  const parsed: unknown = JSON.parse(content);

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Groq response was not valid JSON.");
  }

  const payload = parsed as Partial<GroqTipsPayload> & {
    items?: unknown;
    data?: unknown;
  };
  const candidate = payload.tips ?? payload.items ?? payload.data;

  if (!isGroqTipArray(candidate)) {
    throw new Error("Groq response did not include a tips array.");
  }

  const tips = candidate
    .map((item) => ({
      topic: item.topic.trim(),
      tip: item.tip.trim(),
    }))
    .filter((item) => item.topic.length > 0 && item.tip.length > 0)
    .slice(0, 5);

  if (tips.length !== 5) {
    throw new Error("Groq response did not contain exactly 5 tips.");
  }

  return tips;
}

export async function fetchStudentProductivityTips(
  signal?: AbortSignal
): Promise<GroqTip[]> {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getGroqApiKey()}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "Return a JSON object with a tips array containing exactly 5 objects. Each object must have a short topic string and a tip string. The topic should be a short label like Focus, Break, Memory, Plan, or Reset. Each tip must be one single punchy sentence for a student. Do not include markdown, bullet points, numbering, or extra keys.",
          },
          {
            role: "user",
              content:
              "Generate 5 student productivity tips for studying, revision, focus, and time management.",
          },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
      signal,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Groq request failed with status ${response.status}: ${errorText}`
    );
  }

  const data: unknown = await response.json();

  if (typeof data !== "object" || data === null) {
    throw new Error("Groq response was not valid JSON.");
  }

  const chatResponse = data as GroqChatResponse;
  const content = chatResponse.choices?.[0]?.message?.content;

  if (typeof content !== "string" || content.trim().length === 0) {
    throw new Error("Groq response did not include message content.");
  }

  return parseTipsPayload(content);
}

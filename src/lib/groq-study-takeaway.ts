import type { BlogPost } from "@/src/types/blog";
import { getGroqApiKey } from "@/src/lib/groq-config";

interface GroqChatMessage {
  content?: string | null;
}

interface GroqChatChoice {
  message?: GroqChatMessage;
}

interface GroqChatResponse {
  choices?: GroqChatChoice[];
}

interface GroqTakeawayPayload {
  takeaway?: string;
}

function parseTakeawayPayload(content: string): string {
  const parsed: unknown = JSON.parse(content);

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Groq response was not valid JSON.");
  }

  const payload = parsed as GroqTakeawayPayload;
  const takeaway = payload.takeaway?.trim();

  if (!takeaway) {
    throw new Error("Groq response did not include a takeaway.");
  }

  return takeaway;
}

export async function generateStudyTakeaway(
  post: BlogPost,
  signal?: AbortSignal
): Promise<string> {
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
              "Return a JSON object with a single takeaway string. The takeaway must be one or two short sentences, in plain language, and focused on what a student can apply right away. Do not include markdown, bullet points, or extra keys.",
          },
          {
            role: "user",
            content: `Create a short study takeaway for this article.\n\nTitle: ${post.title}\nSource: ${post.source}\nExcerpt: ${post.excerpt}\nContent: ${post.content}`,
          },
        ],
        temperature: 0.5,
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

  return parseTakeawayPayload(content);
}

import { describe, it, expect } from "vitest";

const API_KEY = process.env.MINIMAX_API_KEY;
const BASE_URL = "https://api.minimax.io/v1";

describe.skipIf(!API_KEY)("MiniMax Integration", () => {
  it(
    "completes a basic chat request with MiniMax-M2.7",
    async () => {
      const response = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "MiniMax-M2.7",
          messages: [
            {
              role: "user",
              content: 'Respond with exactly: "MiniMax works"',
            },
          ],
          temperature: 0.01,
          max_tokens: 20,
        }),
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.choices).toBeDefined();
      expect(data.choices.length).toBeGreaterThan(0);
      expect(data.choices[0].message.content).toBeTruthy();
    },
    30000
  );

  it(
    "handles streaming response",
    async () => {
      const response = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "MiniMax-M2.7",
          messages: [{ role: "user", content: "Count 1 to 3" }],
          temperature: 0.01,
          max_tokens: 50,
          stream: true,
        }),
      });

      expect(response.ok).toBe(true);

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let chunks = 0;
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        const lines = text.split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              chunks++;
            }
          } catch {
            // skip incomplete JSON
          }
        }
      }

      expect(chunks).toBeGreaterThan(0);
      expect(fullText.length).toBeGreaterThan(0);
    },
    30000
  );

  it(
    "works with MiniMax-M2.7-highspeed model",
    async () => {
      const response = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "MiniMax-M2.7-highspeed",
          messages: [{ role: "user", content: "Say hello" }],
          temperature: 0.01,
          max_tokens: 20,
        }),
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.choices[0].message.content).toBeTruthy();
    },
    30000
  );
});

import Anthropic from "@anthropic-ai/sdk";

export type RewrittenCopy = {
  title: string;
  description: string;
};

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5";

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to your environment to enable AI copy rewriting."
    );
  }
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

const SYSTEM_PROMPT = `You are an e-commerce copywriter for a small podcast-branded store. \
Given a raw product title and description pulled from a marketplace listing, rewrite them to be \
clear, trustworthy, and SEO-dense for an English-speaking US audience — without becoming keyword-stuffed \
or making claims the original text doesn't support. Never invent specs, certifications, materials, or \
claims that aren't implied by the source text. Keep the tone plain and direct, not hype-y.`;

/**
 * Rewrites scraped marketplace copy into SEO-dense title + description text
 * using the Claude API. Never fabricates specs beyond what the source implies.
 */
export async function rewriteProductCopy(input: {
  title: string;
  description: string;
  marketplace: string;
}): Promise<RewrittenCopy> {
  const anthropic = getClient();

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    thinking: { type: "disabled" },
    system: SYSTEM_PROMPT,
    output_config: {
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "SEO-dense product title, under 70 characters, no ALL CAPS, no emoji.",
            },
            description: {
              type: "string",
              description:
                "3-5 short paragraphs or a paragraph plus a bullet list of key features, written for a product detail page. Plain text only, no markdown headers.",
            },
          },
          required: ["title", "description"],
          additionalProperties: false,
        },
      },
    },
    messages: [
      {
        role: "user",
        content: `Source marketplace: ${input.marketplace}\n\nOriginal title:\n${input.title}\n\nOriginal description:\n${input.description}\n\nRewrite the title and description for our store's product page.`,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("The AI rewrite didn't return any text.");
  }

  const parsed = JSON.parse(textBlock.text) as RewrittenCopy;
  return parsed;
}

import { NextResponse } from "next/server";
import { GoogleGenAI, type GenerateContentResponse } from "@google/genai";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import {
  dedupeSources,
  normalizeTop30Result,
  Top30ModelResultSchema,
  Top30RequestSchema,
  type Top30ModelResult,
  type Top30Result,
  type Top30Source,
} from "@/lib/top30";

export const runtime = "nodejs";
export const maxDuration = 60;

const SearchResultSchema = Top30ModelResultSchema;
const providerSchema = z.enum(["auto", "gemini", "openai"]);
type SearchProvider = z.infer<typeof providerSchema>;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong while generating the list.";
}

function resolveProvider(): SearchProvider {
  const requested = providerSchema.catch("auto").parse(process.env.TOP30_PROVIDER);
  if (requested !== "auto") {
    return requested;
  }

  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
    return "gemini";
  }

  if (process.env.OPENAI_API_KEY) {
    return "openai";
  }

  return "gemini";
}

function createPrompt(question: string, now: string): string {
  return `Question: ${question}

Create a ranked list of up to 30 answers for a casual trivia game.

Rules:
- Use current web evidence.
- Prefer authoritative or broadly trusted sources.
- If the question is ambiguous, choose the most natural interpretation, explain the basis, and add a warning.
- Each item must include rank, name, value, note, and sourceUrls.
- Use null for value or note when there is no useful short value.
- Include sources as title/url pairs.
- Return only JSON with this exact shape:
{
  "question": string,
  "title": string,
  "rankingBasis": string,
  "generatedAt": string,
  "items": [{"rank": number, "name": string, "value": string | null, "note": string | null, "sourceUrls": string[]}],
  "sources": [{"title": string, "url": string}],
  "warnings": string[]
}
- Use generatedAt="${now}".`;
}

function parseJsonFromModelText(text: string | undefined): unknown {
  if (!text?.trim()) {
    throw new Error("The search completed, but no ranked list was returned.");
  }

  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const jsonText = fenced?.[1] ?? trimmed.match(/\{[\s\S]*\}/)?.[0] ?? trimmed;
  return JSON.parse(jsonText);
}

function validSource(title: string | undefined, url: string | undefined): Top30Source | null {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);
    return {
      title: title?.trim() || parsed.hostname,
      url: parsed.toString(),
    };
  } catch {
    return null;
  }
}

function sourcesFromGeminiGrounding(response: GenerateContentResponse): Top30Source[] {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
  const sources = chunks
    .map((chunk) => validSource(chunk.web?.title, chunk.web?.uri))
    .filter((source): source is Top30Source => Boolean(source));

  return dedupeSources(sources);
}

function mergeGeminiSources(result: Top30ModelResult, groundingSources: Top30Source[]): Top30ModelResult {
  const mergedSources = dedupeSources([...result.sources, ...groundingSources]);
  const sourceUrls = new Set(mergedSources.map((source) => source.url));

  return {
    ...result,
    sources: mergedSources,
    items: result.items.map((item) => ({
      ...item,
      sourceUrls: item.sourceUrls.filter((url) => sourceUrls.has(url)),
    })),
  };
}

async function searchWithGemini(question: string, now: string): Promise<Top30Result> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Create a free key in Google AI Studio, add it to .env.local, and restart the dev server.");
  }

  const client = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const response = await client.models.generateContent({
    model,
    contents: createPrompt(question, now),
    config: {
      systemInstruction:
        "You create casual trivia rankings for a party game. Use Google Search grounding when helpful, return only JSON, and keep item names concise.",
      tools: [{ googleSearch: {} }],
      temperature: 0.2,
    },
  });

  const parsed = SearchResultSchema.parse(parseJsonFromModelText(response.text));
  return normalizeTop30Result(
    mergeGeminiSources(
      {
        ...parsed,
        question,
        generatedAt: parsed.generatedAt || now,
      },
      sourcesFromGeminiGrounding(response),
    ),
  );
}

async function searchWithOpenAI(question: string, now: string): Promise<Top30Result> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing. Add it to .env.local and restart the dev server.");
  }

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || "gpt-5.4-mini";
  const response = await client.responses.parse({
    model,
    input: [
      {
        role: "system",
        content:
          "You create casual trivia rankings for a party game. Use current web search evidence, return only the requested JSON shape, keep names concise, and include sources used.",
      },
      {
        role: "user",
        content: createPrompt(question, now),
      },
    ],
    tools: [{ type: "web_search" }],
    tool_choice: "auto",
    include: ["web_search_call.action.sources"],
    text: {
      format: zodTextFormat(SearchResultSchema, "game_of_30_top_30"),
    },
  });

  if (!response.output_parsed) {
    throw new Error("The search completed, but no ranked list was returned.");
  }

  return normalizeTop30Result({
    ...response.output_parsed,
    question,
    generatedAt: response.output_parsed.generatedAt || now,
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = Top30RequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Enter a question first." },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();

  try {
    const provider = resolveProvider();
    const normalized =
      provider === "gemini"
        ? await searchWithGemini(parsed.data.question, now)
        : await searchWithOpenAI(parsed.data.question, now);

    if (normalized.items.length === 0) {
      return NextResponse.json({ error: "No ranked items were found for that question." }, { status: 502 });
    }

    return NextResponse.json(normalized);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "The model returned a malformed ranked list. Try rephrasing the question." },
        { status: 502 },
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "The model returned text instead of valid JSON. Try rephrasing the question." },
        { status: 502 },
      );
    }

    if (getErrorMessage(error).includes("_API_KEY is missing")) {
      return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
    }

    return NextResponse.json({ error: getErrorMessage(error) }, { status: 502 });
  }
}

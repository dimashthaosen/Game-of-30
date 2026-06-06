import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const parseMock = vi.fn();
const generateContentMock = vi.fn();

vi.mock("@google/genai", () => ({
  GoogleGenAI: vi.fn(function MockGoogleGenAI() {
    return {
      models: {
        generateContent: generateContentMock,
      },
    };
  }),
}));

vi.mock("openai", () => ({
  default: vi.fn(function MockOpenAI() {
    return {
      responses: {
        parse: parseMock,
      },
    };
  }),
}));

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/top-30", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/top-30", () => {
  beforeEach(() => {
    vi.resetModules();
    parseMock.mockReset();
    generateContentMock.mockReset();
    process.env.OPENAI_API_KEY = "test-key";
    process.env.OPENAI_MODEL = "test-model";
  });

  afterEach(() => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_MODEL;
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_MODEL;
    delete process.env.TOP30_PROVIDER;
  });

  it("returns 400 for an invalid request", async () => {
    const { POST } = await import("./route");
    const response = await POST(makeRequest({ question: "" }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBeTruthy();
  });

  it("returns 500 when the API key is missing", async () => {
    delete process.env.OPENAI_API_KEY;
    process.env.TOP30_PROVIDER = "openai";

    const { POST } = await import("./route");
    const response = await POST(makeRequest({ question: "Largest countries by population?" }));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toContain("OPENAI_API_KEY");
  });

  it("returns 500 when Gemini is selected and the Gemini API key is missing", async () => {
    process.env.TOP30_PROVIDER = "gemini";

    const { POST } = await import("./route");
    const response = await POST(makeRequest({ question: "Largest countries by population?" }));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toContain("GEMINI_API_KEY");
  });

  it("uses Gemini by default when a Gemini API key is present", async () => {
    process.env.GEMINI_API_KEY = "gemini-key";
    process.env.GEMINI_MODEL = "gemini-test-model";

    generateContentMock.mockResolvedValue({
      text: JSON.stringify({
        question: "Largest countries by population?",
        title: "Largest Countries by Population",
        rankingBasis: "Ranked by current population estimates.",
        generatedAt: "2026-06-07T00:00:00.000Z",
        items: [
          { rank: 2, name: "China", value: "1.4B", note: null, sourceUrls: ["https://example.com/china"] },
          { rank: 1, name: "India", value: "1.4B", note: null, sourceUrls: ["https://example.com/india"] },
        ],
        sources: [
          { title: "China source", url: "https://example.com/china" },
          { title: "India source", url: "https://example.com/india" },
        ],
        warnings: [],
      }),
      candidates: [
        {
          groundingMetadata: {
            groundingChunks: [{ web: { title: "Grounded source", uri: "https://example.com/grounded" } }],
          },
        },
      ],
    });

    const { POST } = await import("./route");
    const response = await POST(makeRequest({ question: "Largest countries by population?" }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.items).toEqual([
      { rank: 1, name: "India", value: "1.4B", sourceUrls: ["https://example.com/india"] },
      { rank: 2, name: "China", value: "1.4B", sourceUrls: ["https://example.com/china"] },
    ]);
    expect(body.sources).toEqual([
      { title: "China source", url: "https://example.com/china" },
      { title: "India source", url: "https://example.com/india" },
      { title: "Grounded source", url: "https://example.com/grounded" },
    ]);
    expect(generateContentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "gemini-test-model",
        config: expect.objectContaining({
          tools: [{ googleSearch: {} }],
          temperature: 0.2,
        }),
      }),
    );
    expect(parseMock).not.toHaveBeenCalled();
  });

  it("returns a normalized ranked list from OpenAI", async () => {
    process.env.TOP30_PROVIDER = "openai";
    parseMock.mockResolvedValue({
      output_parsed: {
        question: "Largest countries by population?",
        title: "Largest Countries by Population",
        rankingBasis: "Ranked by current population estimates.",
        generatedAt: "2026-06-07T00:00:00.000Z",
        items: [
          { rank: 2, name: "China", value: "1.4B", sourceUrls: [] },
          { rank: 1, name: "India", value: "1.4B", sourceUrls: [] },
        ],
        sources: [
          { title: "World Population Review", url: "https://worldpopulationreview.com" },
          { title: "World Population Review", url: "https://worldpopulationreview.com" },
        ],
        warnings: [],
      },
    });

    const { POST } = await import("./route");
    const response = await POST(makeRequest({ question: "Largest countries by population?" }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.items).toEqual([
      { rank: 1, name: "India", value: "1.4B", sourceUrls: [] },
      { rank: 2, name: "China", value: "1.4B", sourceUrls: [] },
    ]);
    expect(body.sources).toHaveLength(1);
    expect(parseMock).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "test-model",
        tools: [{ type: "web_search" }],
        include: ["web_search_call.action.sources"],
      }),
    );
  });

  it("returns 502 when OpenAI output fails validation", async () => {
    process.env.TOP30_PROVIDER = "openai";
    parseMock.mockResolvedValue({ output_parsed: null });

    const { POST } = await import("./route");
    const response = await POST(makeRequest({ question: "Largest countries by population?" }));
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body.error).toContain("no ranked list");
  });
});

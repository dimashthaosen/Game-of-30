import { z } from "zod";

export const Top30ItemSchema = z.object({
  rank: z.number().int().min(1).max(30),
  name: z.string().min(1),
  value: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  sourceUrls: z.array(z.string().url()).optional().default([]),
});

export const Top30SourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
});

export const Top30ResultSchema = z.object({
  question: z.string().min(1),
  title: z.string().min(1),
  rankingBasis: z.string().min(1),
  generatedAt: z.string().min(1),
  items: z.array(Top30ItemSchema).min(1).max(30),
  sources: z.array(Top30SourceSchema).default([]),
  warnings: z.array(z.string()).default([]),
});

export const Top30ModelItemSchema = z.object({
  rank: z.number().int().min(1).max(30),
  name: z.string().min(1),
  value: z.string().nullable(),
  note: z.string().nullable(),
  sourceUrls: z.array(z.string().url()),
});

export const Top30ModelResultSchema = z.object({
  question: z.string().min(1),
  title: z.string().min(1),
  rankingBasis: z.string().min(1),
  generatedAt: z.string().min(1),
  items: z.array(Top30ModelItemSchema).min(1).max(30),
  sources: z.array(Top30SourceSchema),
  warnings: z.array(z.string()),
});

export const Top30RequestSchema = z.object({
  question: z.string().trim().min(3, "Ask a longer question."),
});

export type Top30Item = z.infer<typeof Top30ItemSchema>;
export type Top30Source = z.infer<typeof Top30SourceSchema>;
export type Top30Result = z.infer<typeof Top30ResultSchema>;
export type Top30ModelResult = z.infer<typeof Top30ModelResultSchema>;
export type Top30Request = z.infer<typeof Top30RequestSchema>;

export function normalizeTop30Result(result: Top30Result | Top30ModelResult): Top30Result {
  const seen = new Set<number>();
  const items = result.items
    .filter((item) => {
      if (seen.has(item.rank)) {
        return false;
      }
      seen.add(item.rank);
      return true;
    })
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 30)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
      value: item.value?.trim() ? item.value : undefined,
      note: item.note?.trim() ? item.note : undefined,
      sourceUrls: item.sourceUrls ?? [],
    }));

  return {
    ...result,
    generatedAt: result.generatedAt || new Date().toISOString(),
    items,
    sources: dedupeSources(result.sources),
    warnings: result.warnings ?? [],
  };
}

export function dedupeSources(sources: Top30Source[]): Top30Source[] {
  const seen = new Set<string>();
  return sources.filter((source) => {
    const key = source.url.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

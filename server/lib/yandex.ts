import OpenAI from "openai";
import { z } from "zod";
import type { Artwork, MuseumRoute, QuizAnswers } from "../../src/lib/types.ts";
import {
  CURATOR_SYSTEM_PROMPT,
  buildAskUserPrompt,
  buildRouteUserPrompt,
} from "./prompts.ts";
import { filterCandidates, stopCountForDuration } from "./filter.ts";

const routeSchema = z.object({
  title: z.string().min(2),
  theme: z.string().min(2),
  totalMinutes: z.number().int().positive(),
  stops: z
    .array(
      z.object({
        artworkId: z.string(),
        story: z.string().min(10),
        whyForYou: z.string().min(5),
      }),
    )
    .min(3)
    .max(10),
});

function getClient(): OpenAI | null {
  const apiKey = process.env.YC_API_KEY ?? process.env.YANDEX_API_KEY;
  if (!apiKey) return null;

  return new OpenAI({
    apiKey,
    baseURL:
      process.env.YC_BASE_URL ?? "https://ai.api.cloud.yandex.net/v1",
    defaultHeaders: process.env.YC_FOLDER_ID
      ? { "x-folder-id": process.env.YC_FOLDER_ID }
      : undefined,
  });
}

function modelUri(): string {
  const folder = process.env.YC_FOLDER_ID;
  if (process.env.YC_MODEL) return process.env.YC_MODEL;
  if (folder) return `gpt://${folder}/yandexgpt/latest`;
  return "yandexgpt";
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : trimmed;
  return JSON.parse(raw);
}

export function isYandexConfigured(): boolean {
  return Boolean(process.env.YC_API_KEY ?? process.env.YANDEX_API_KEY);
}

export async function generateRouteWithAi(
  quiz: QuizAnswers,
): Promise<MuseumRoute | null> {
  const client = getClient();
  if (!client) return null;

  const candidates = filterCandidates(quiz);
  const stopCount = stopCountForDuration(quiz.duration);
  const candidateIds = new Set(candidates.map((c) => c.id));

  try {
    const completion = await client.chat.completions.create({
      model: modelUri(),
      temperature: 0.4,
      messages: [
        { role: "system", content: CURATOR_SYSTEM_PROMPT },
        {
          role: "user",
          content: buildRouteUserPrompt(quiz, candidates, stopCount),
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return null;

    const parsed = routeSchema.parse(extractJson(content));
    const validStops = parsed.stops.filter((s) => candidateIds.has(s.artworkId));

    if (validStops.length < 3) return null;

    return {
      title: parsed.title,
      theme: parsed.theme,
      totalMinutes: quiz.duration,
      source: "ai",
      stops: validStops.slice(0, stopCount),
    };
  } catch {
    return null;
  }
}

export async function askCuratorWithAi(params: {
  artwork: Artwork;
  question: string;
  routeTitle: string;
  company: QuizAnswers["company"];
}): Promise<string | null> {
  const client = getClient();
  if (!client) return null;

  try {
    const completion = await client.chat.completions.create({
      model: modelUri(),
      temperature: 0.5,
      messages: [
        { role: "system", content: CURATOR_SYSTEM_PROMPT },
        { role: "user", content: buildAskUserPrompt(params) },
      ],
    });

    return completion.choices[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}

export function askFallback(artwork: Artwork, question: string): string {
  return `${artwork.fact} Если смотреть на «${artwork.title}» с вопросом «${question.slice(0, 80)}», начни с детали в центре — именно она чаще всего держит взгляд в зале ${artwork.hall}.`;
}

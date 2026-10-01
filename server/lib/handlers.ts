import { z } from "zod";
import { getArtworkById } from "./catalog.ts";
import { buildFallbackRoute, enrichRoute } from "./fallback.ts";
import { askCuratorWithAi, askFallback, generateRouteWithAi } from "./yandex.ts";

export type ApiResult = {
  status: number;
  body: unknown;
};

const quizSchema = z.object({
  duration: z.union([z.literal(30), z.literal(60), z.literal(90)]),
  mood: z.enum(["calm", "drama", "discovery"]),
  interest: z.enum([
    "antiquity",
    "renaissance",
    "impressionism",
    "modern",
    "sculpture",
  ]),
  company: z.enum(["alone", "couple", "kids"]),
});

const askSchema = z.object({
  artworkId: z.string(),
  question: z.string().min(2).max(280),
  routeTitle: z.string().default("Мой маршрут"),
  company: z.enum(["alone", "couple", "kids"]).default("alone"),
});

export async function handleCreateRoute(body: unknown): Promise<ApiResult> {
  try {
    const quiz = quizSchema.parse(body);
    const aiRoute = await generateRouteWithAi(quiz);
    const route = aiRoute ?? buildFallbackRoute(quiz);
    const enriched = enrichRoute(route);

    if (!enriched) {
      return { status: 500, body: { error: "Не удалось собрать маршрут" } };
    }

    return { status: 200, body: enriched };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: 400,
        body: {
          error: "Некорректные ответы квиза",
          details: error.flatten(),
        },
      };
    }

    return { status: 500, body: { error: "Внутренняя ошибка сервера" } };
  }
}

export async function handleAskCurator(body: unknown): Promise<ApiResult> {
  try {
    const data = askSchema.parse(body);
    const artwork = getArtworkById(data.artworkId);

    if (!artwork) {
      return { status: 404, body: { error: "Произведение не найдено" } };
    }

    const aiAnswer = await askCuratorWithAi({
      artwork,
      question: data.question,
      routeTitle: data.routeTitle,
      company: data.company,
    });

    return {
      status: 200,
      body: {
        answer: aiAnswer ?? askFallback(artwork, data.question),
        source: aiAnswer ? "ai" : "fallback",
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: 400,
        body: {
          error: "Некорректный запрос",
          details: error.flatten(),
        },
      };
    }

    return { status: 500, body: { error: "Внутренняя ошибка сервера" } };
  }
}

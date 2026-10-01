import { getArtworkById } from "./catalog.ts";
import { filterCandidates, stopCountForDuration } from "./filter.ts";
import type {
  EnrichedRoute,
  MuseumRoute,
  QuizAnswers,
} from "../../src/lib/types.ts";

const THEME_BY_MOOD = {
  calm: "Тихий свет залов",
  drama: "Напряжение и жест",
  discovery: "Случайные открытия",
} as const;

const TITLE_BY_INTEREST = {
  antiquity: "Диалог с древностью",
  renaissance: "Линии Возрождения",
  impressionism: "Воздух и цвет",
  modern: "Новый взгляд",
  sculpture: "Форма и объём",
} as const;

export function buildFallbackRoute(quiz: QuizAnswers): MuseumRoute {
  const candidates = filterCandidates(quiz);
  const count = stopCountForDuration(quiz.duration);
  const selected = candidates.slice(0, count);

  return {
    title: TITLE_BY_INTEREST[quiz.interest],
    theme: THEME_BY_MOOD[quiz.mood],
    totalMinutes: quiz.duration,
    source: "fallback",
    stops: selected.map((artwork) => ({
      artworkId: artwork.id,
      story: `${artwork.fact} Остановись здесь на минуту — зал ${artwork.hall.split(",")[0]} звучит иначе, когда смотришь без спешки.`,
      whyForYou:
        quiz.company === "kids"
          ? "Здесь легко заметить детали и придумать свою историю."
          : quiz.company === "couple"
            ? "Хорошая пауза, чтобы поделиться впечатлением вдвоём."
            : "Это совпадает с твоим настроением и выбранным интересом.",
    })),
  };
}

export function enrichRoute(route: MuseumRoute): EnrichedRoute | null {
  const stops = [];

  for (const stop of route.stops) {
    const artwork = getArtworkById(stop.artworkId);
    if (!artwork) return null;
    stops.push({ ...stop, artwork });
  }

  if (stops.length === 0) return null;

  return {
    title: route.title,
    theme: route.theme,
    totalMinutes: route.totalMinutes,
    source: route.source,
    stops,
  };
}

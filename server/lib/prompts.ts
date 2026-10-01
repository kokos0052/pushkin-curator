import type { Artwork, QuizAnswers } from "../../src/lib/types.ts";

export const CURATOR_SYSTEM_PROMPT = `Ты — тёплый личный куратор ГМИИ им. А. С. Пушкина (Пушкинский музей).
Говоришь по-русски, коротко и конкретно. Без канцелярита и без фраз вроде «как ИИ».
Не выдумывай произведений вне переданного списка кандидатов.
Тон: живой музейный гид для смартфона — 2–3 предложения на историю.`;

export function buildRouteUserPrompt(
  quiz: QuizAnswers,
  candidates: Artwork[],
  stopCount: number,
): string {
  const companyLabel = {
    alone: "один",
    couple: "пара",
    kids: "с детьми",
  }[quiz.company];

  const moodLabel = {
    calm: "спокойствие",
    drama: "драма",
    discovery: "открытие",
  }[quiz.mood];

  const interestLabel = {
    antiquity: "Античность",
    renaissance: "Ренессанс",
    impressionism: "Импрессионизм",
    modern: "XX век",
    sculpture: "скульптура",
  }[quiz.interest];

  return `Собери персональный маршрут по Пушкинскому музею.

Параметры гостя:
- время: ${quiz.duration} минут
- настроение: ${moodLabel}
- интерес: ${interestLabel}
- компания: ${companyLabel}

Кандидаты (выбирай ТОЛЬКО из них, ровно ${stopCount} остановок, порядок — удобный для прогулки по залам):
${JSON.stringify(
    candidates.map((a) => ({
      id: a.id,
      title: a.title,
      artist: a.artist,
      hall: a.hall,
      fact: a.fact,
      mood: a.mood,
      interests: a.interests,
    })),
    null,
    2,
  )}

Верни СТРОГО валидный JSON без markdown и без пояснений:
{
  "title": "короткое название маршрута",
  "theme": "одна фраза-тема",
  "totalMinutes": ${quiz.duration},
  "stops": [
    {
      "artworkId": "id из списка",
      "story": "2-3 предложения истории у произведения",
      "whyForYou": "1 предложение почему это в маршруте гостя"
    }
  ]
}`;
}

export function buildAskUserPrompt(params: {
  artwork: Artwork;
  question: string;
  routeTitle: string;
  company: QuizAnswers["company"];
}): string {
  const companyHint = {
    alone: "Гость один — можно чуть глубже.",
    couple: "Гость с парой — тёплый, немного романтичный тон.",
    kids: "С детьми — просто, живо, без сложных терминов.",
  }[params.company];

  return `Маршрут: «${params.routeTitle}».
Произведение: ${params.artwork.title} — ${params.artwork.artist} (${params.artwork.hall}).
Факт: ${params.artwork.fact}.
${companyHint}

Вопрос гостя: ${params.question}

Ответь 2–4 короткими предложениями. Если вопрос вне произведения — мягко верни к нему.`;
}

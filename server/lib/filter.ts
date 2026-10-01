import { artworks } from "./catalog.ts";
import type { Artwork, Duration, QuizAnswers } from "../../src/lib/types.ts";

export function stopCountForDuration(duration: Duration): number {
  if (duration <= 30) return 5;
  if (duration <= 60) return 7;
  return 8;
}

export function filterCandidates(quiz: QuizAnswers): Artwork[] {
  const scored = artworks.map((artwork) => {
    let score = 0;
    if (artwork.interests.includes(quiz.interest)) score += 3;
    if (artwork.mood.includes(quiz.mood)) score += 2;
    if (
      quiz.company === "kids" &&
      artwork.tags.some((t) =>
        ["миф", "цирк", "животные", "цвет"].includes(t),
      )
    ) {
      score += 1;
    }
    return { artwork, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const top = scored.filter((s) => s.score > 0).map((s) => s.artwork);
  const needed = Math.min(14, artworks.length);

  if (top.length >= needed) return top.slice(0, needed);

  const ids = new Set(top.map((a) => a.id));
  for (const artwork of artworks) {
    if (ids.has(artwork.id)) continue;
    top.push(artwork);
    if (top.length >= needed) break;
  }

  return top;
}

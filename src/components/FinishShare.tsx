import { useState } from "react";
import type { EnrichedRoute } from "@/lib/types";

type Props = {
  route: EnrichedRoute;
  shareUrl: string;
  onRestart: () => void;
};

export function FinishShare({ route, shareUrl, onRestart }: Props) {
  const [copied, setCopied] = useState(false);

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: route.title,
          text: `${route.title} — ${route.theme}`,
          url: shareUrl,
        });
        return;
      } catch {
        /* fall through to clipboard */
      }
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="flex h-full flex-col px-6 pb-8 pt-8">
      <div className="flex-1 animate-fade-up">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--teal)]">
          Открытка маршрута
        </p>
        <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-gradient-to-br from-[#1e4d4a] to-[#142033] px-5 py-6 text-white shadow-lg">
          <p className="font-display text-3xl leading-tight">{route.title}</p>
          <p className="mt-2 text-white/70">{route.theme}</p>
          <ul className="mt-5 space-y-1.5 text-sm text-white/85">
            {route.stops.slice(0, 4).map((stop) => (
              <li key={stop.artworkId}>· {stop.artwork.title}</li>
            ))}
            {route.stops.length > 4 ? (
              <li className="text-white/55">
                и ещё {route.stops.length - 4}
              </li>
            ) : null}
          </ul>
          <p className="mt-6 text-xs uppercase tracking-[0.18em] text-white/45">
            Мой куратор · Пушкинский
          </p>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-[var(--ink-soft)]">
          Ты прошёл {route.stops.length} остановок за ~{route.totalMinutes}{" "}
          минут. Сохрани ссылку — маршрут можно открыть снова.
        </p>
      </div>

      <div className="space-y-2">
        <button type="button" className="btn-primary" onClick={share}>
          {copied ? "Ссылка скопирована" : "Поделиться"}
        </button>
        <button type="button" className="btn-secondary" onClick={onRestart}>
          Собрать другой маршрут
        </button>
      </div>
    </section>
  );
}

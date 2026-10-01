import type { EnrichedRoute } from "@/lib/types";

type Props = {
  route: EnrichedRoute;
  onStart: () => void;
  onBack: () => void;
};

export function RouteOverview({ route, onStart, onBack }: Props) {
  return (
    <section className="flex h-full flex-col px-6 pb-8 pt-6">
      <button type="button" className="btn-ghost self-start" onClick={onBack}>
        ← Заново
      </button>

      <div className="mt-4 animate-fade-up">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--teal)]">
          Твой маршрут
          {route.source === "fallback" ? " · демо-режим" : ""}
        </p>
        <h2 className="mt-2 font-display text-3xl leading-tight text-[var(--ink)]">
          {route.title}
        </h2>
        <p className="mt-2 text-[var(--ink-soft)]">{route.theme}</p>
        <p className="mt-3 text-sm text-[var(--ink-soft)]">
          {route.stops.length} остановок · ~{route.totalMinutes} мин
        </p>
      </div>

      <ol className="mt-6 flex-1 space-y-3 overflow-y-auto pb-4">
        {route.stops.map((stop, index) => (
          <li
            key={stop.artworkId}
            className="flex gap-3 rounded-2xl border border-[var(--line)] bg-white/50 px-3 py-3 animate-fade-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--teal)]/10 text-sm font-medium text-[var(--teal)]">
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium text-[var(--ink)]">
                {stop.artwork.title}
              </p>
              <p className="truncate text-sm text-[var(--ink-soft)]">
                {stop.artwork.hall}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <button type="button" className="btn-primary mt-2" onClick={onStart}>
        Начать
      </button>
    </section>
  );
}

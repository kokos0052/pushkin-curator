import { useState } from "react";
import type { Company, EnrichedStop } from "@/lib/types";
import { ArtworkVisual } from "./ArtworkVisual";
import { AskCurator } from "./AskCurator";

type Props = {
  stop: EnrichedStop;
  index: number;
  total: number;
  routeTitle: string;
  company: Company;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
};

export function StopCard({
  stop,
  index,
  total,
  routeTitle,
  company,
  onPrev,
  onNext,
  onFinish,
}: Props) {
  const [askOpen, setAskOpen] = useState(false);
  const isLast = index === total - 1;

  return (
    <section className="relative flex h-full flex-col px-5 pb-6 pt-5">
      <div className="mb-3 flex items-center justify-between text-xs text-[var(--ink-soft)]">
        <span>
          Остановка {index + 1} из {total}
        </span>
        <span>{stop.artwork.hall}</span>
      </div>

      <ArtworkVisual
        hue={stop.artwork.imageHue}
        title={stop.artwork.artist}
        className="h-44 shrink-0 rounded-[1.25rem] animate-rise"
      />

      <div className="mt-4 animate-fade-up" key={stop.artworkId}>
        <h2 className="font-display text-2xl leading-tight text-[var(--ink)]">
          {stop.artwork.title}
        </h2>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">
          {stop.artwork.artist} · {stop.artwork.period}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-[var(--ink)]">
          {stop.story}
        </p>
        <p className="mt-3 rounded-2xl bg-[var(--teal)]/8 px-3 py-2 text-sm text-[var(--ink-soft)]">
          <span className="font-medium text-[var(--teal)]">Почему тебе: </span>
          {stop.whyForYou}
        </p>
      </div>

      <div className="mt-auto space-y-2 pt-4">
        <button
          type="button"
          className="btn-secondary w-full"
          onClick={() => setAskOpen(true)}
        >
          Спросить куратора
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn-ghost flex-1"
            onClick={onPrev}
            disabled={index === 0}
          >
            Назад
          </button>
          <button
            type="button"
            className="btn-primary flex-[2]"
            onClick={isLast ? onFinish : onNext}
          >
            {isLast ? "Завершить" : "Дальше"}
          </button>
        </div>
      </div>

      {askOpen ? (
        <AskCurator
          artworkId={stop.artworkId}
          artworkTitle={stop.artwork.title}
          routeTitle={routeTitle}
          company={company}
          onClose={() => setAskOpen(false)}
        />
      ) : null}
    </section>
  );
}

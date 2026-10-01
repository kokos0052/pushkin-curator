import { useEffect, useState } from "react";
import { GENERATING_LINES } from "@/lib/copy";

export function Generating() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % GENERATING_LINES.length);
    }, 1400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="relative mb-8 h-20 w-20">
        <div className="absolute inset-0 rounded-full border border-[var(--teal)]/30 animate-pulse-ring" />
        <div className="absolute inset-3 rounded-full bg-[var(--teal)]/15 animate-breathe" />
        <div className="absolute inset-0 flex items-center justify-center font-display text-2xl text-[var(--teal)]">
          ✦
        </div>
      </div>
      <p className="font-display text-2xl text-[var(--ink)]">Собираем маршрут</p>
      <p
        key={index}
        className="mt-3 min-h-[3rem] max-w-xs text-sm leading-relaxed text-[var(--ink-soft)] animate-fade-up"
      >
        {GENERATING_LINES[index]}
      </p>
    </section>
  );
}

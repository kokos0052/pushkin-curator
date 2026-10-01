import { BRAND, CTA_START, TAGLINE } from "@/lib/copy";

type Props = {
  onStart: () => void;
};

export function Landing({ onStart }: Props) {
  return (
    <section className="flex h-full flex-col justify-between px-6 pb-8 pt-10">
      <div className="animate-fade-up">
        <p className="font-display text-5xl leading-none tracking-tight text-[var(--ink)] sm:text-6xl">
          {BRAND}
        </p>
        <p className="mt-4 max-w-[16rem] text-base leading-relaxed text-[var(--ink-soft)]">
          {TAGLINE}
        </p>
      </div>

      <div className="relative -mx-2 my-6 flex-1 overflow-hidden rounded-[1.5rem] animate-rise">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,#3d6b66_0%,transparent_50%),radial-gradient(ellipse_at_80%_70%,#1a2f3a_0%,#0f1a22_70%)]" />
        <div className="absolute inset-0 opacity-40 bg-[linear-gradient(120deg,transparent_40%,rgba(255,255,255,0.08)_50%,transparent_60%)] animate-shimmer" />
        <div className="absolute bottom-5 left-5 right-5">
          <p className="font-display text-2xl text-white/90">Пушкинский</p>
          <p className="mt-1 text-sm text-white/60">
            Личный маршрут за 4 коротких ответа
          </p>
        </div>
      </div>

      <button type="button" className="btn-primary animate-fade-up-delay" onClick={onStart}>
        {CTA_START}
      </button>
    </section>
  );
}

import { QUIZ_STEPS } from "@/lib/copy";
import type { QuizAnswers } from "@/lib/types";

type Props = {
  stepIndex: number;
  answers: Partial<QuizAnswers>;
  onSelect: (key: keyof QuizAnswers, value: QuizAnswers[keyof QuizAnswers]) => void;
  onBack: () => void;
};

export function Quiz({ stepIndex, answers, onSelect, onBack }: Props) {
  const step = QUIZ_STEPS[stepIndex];
  const progress = ((stepIndex + 1) / QUIZ_STEPS.length) * 100;

  return (
    <section className="flex h-full flex-col px-6 pb-8 pt-6">
      <div className="mb-6 flex items-center gap-3">
        <button type="button" className="btn-ghost" onClick={onBack} aria-label="Назад">
          ←
        </button>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--line)]">
          <div
            className="h-full rounded-full bg-[var(--teal)] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-[var(--ink-soft)]">
          {stepIndex + 1}/{QUIZ_STEPS.length}
        </span>
      </div>

      <h2 className="font-display text-3xl leading-tight text-[var(--ink)] animate-fade-up">
        {step.title}
      </h2>

      <div className="mt-8 flex flex-1 flex-col gap-3">
        {step.options.map((option, index) => {
          const selected = answers[step.key] === option.value;
          return (
            <button
              key={String(option.value)}
              type="button"
              className={`option-card animate-fade-up ${selected ? "option-card-active" : ""}`}
              style={{ animationDelay: `${index * 60}ms` }}
              onClick={() => onSelect(step.key, option.value)}
            >
              <span className="text-lg font-medium text-[var(--ink)]">{option.label}</span>
              <span className="text-sm text-[var(--ink-soft)]">{option.hint}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

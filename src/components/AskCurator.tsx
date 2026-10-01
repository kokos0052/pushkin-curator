import { useState } from "react";
import type { Company } from "@/lib/types";

type Props = {
  artworkId: string;
  artworkTitle: string;
  routeTitle: string;
  company: Company;
  onClose: () => void;
};

export function AskCurator({
  artworkId,
  artworkTitle,
  routeTitle,
  company,
  onClose,
}: Props) {
  const [question, setQuestion] = useState("Почему это важно?");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artworkId,
          question,
          routeTitle,
          company,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка");
      setAnswer(data.answer);
    } catch {
      setError("Не удалось спросить куратора. Попробуй ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end bg-[var(--ink)]/40 backdrop-blur-sm animate-fade-in">
      <div className="max-h-[85%] overflow-y-auto rounded-t-[1.75rem] bg-[var(--surface)] px-5 pb-8 pt-5 shadow-xl animate-sheet-up">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--teal)]">
              Спросить куратора
            </p>
            <p className="mt-1 font-display text-xl text-[var(--ink)]">
              {artworkTitle}
            </p>
          </div>
          <button type="button" className="btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        <label className="block text-sm text-[var(--ink-soft)]" htmlFor="ask">
          Вопрос
        </label>
        <textarea
          id="ask"
          className="mt-2 w-full resize-none rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3 text-[var(--ink)] outline-none focus:border-[var(--teal)]"
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {["Что заметить первым?", "Есть история?", "Как объяснить ребёнку?"].map(
            (preset) => (
              <button
                key={preset}
                type="button"
                className="rounded-full border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--ink-soft)]"
                onClick={() => setQuestion(preset)}
              >
                {preset}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          className="btn-primary mt-4"
          disabled={loading || question.trim().length < 2}
          onClick={submit}
        >
          {loading ? "Куратор думает…" : "Спросить"}
        </button>

        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        {answer ? (
          <p className="mt-4 rounded-2xl bg-[var(--teal)]/8 px-4 py-3 text-sm leading-relaxed text-[var(--ink)] animate-fade-up">
            {answer}
          </p>
        ) : null}
      </div>
    </div>
  );
}

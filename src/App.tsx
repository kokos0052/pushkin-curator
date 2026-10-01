import { useCallback, useEffect, useMemo, useState } from "react";
import { FinishShare } from "@/components/FinishShare";
import { Generating } from "@/components/Generating";
import { Landing } from "@/components/Landing";
import { Quiz } from "@/components/Quiz";
import { RouteOverview } from "@/components/RouteOverview";
import { StopCard } from "@/components/StopCard";
import { QUIZ_STEPS } from "@/lib/copy";
import type { EnrichedRoute, QuizAnswers } from "@/lib/types";

type Screen =
  | "landing"
  | "quiz"
  | "generating"
  | "overview"
  | "stop"
  | "finish";

const STORAGE_KEY = "moy-kurator-route";

function encodeRoute(route: EnrichedRoute): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(route))));
}

function decodeRoute(raw: string): EnrichedRoute | null {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(raw)))) as EnrichedRoute;
  } catch {
    return null;
  }
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [route, setRoute] = useState<EnrichedRoute | null>(null);
  const [stopIndex, setStopIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get("route");
    if (!shared) return;
    const decoded = decodeRoute(shared);
    if (!decoded) return;
    setRoute(decoded);
    setScreen("overview");
  }, []);

  const shareUrl = useMemo(() => {
    if (!route) return "";
    const encoded = encodeRoute(route);
    return `${window.location.origin}${window.location.pathname}?route=${encodeURIComponent(encoded)}`;
  }, [route]);

  const generateRoute = useCallback(async (quiz: QuizAnswers) => {
    setScreen("generating");
    setError(null);
    try {
      const res = await fetch("/api/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quiz),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка генерации");
      setRoute(data as EnrichedRoute);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setStopIndex(0);
      setScreen("overview");
    } catch {
      setError("Не удалось собрать маршрут. Попробуй ещё раз.");
      setScreen("quiz");
      setQuizStep(QUIZ_STEPS.length - 1);
    }
  }, []);

  function handleQuizSelect(
    key: keyof QuizAnswers,
    value: QuizAnswers[keyof QuizAnswers],
  ) {
    const next = { ...answers, [key]: value };
    setAnswers(next);

    if (quizStep < QUIZ_STEPS.length - 1) {
      window.setTimeout(() => setQuizStep((s) => s + 1), 180);
      return;
    }

    const complete = next as QuizAnswers;
    void generateRoute(complete);
  }

  function restart() {
    setScreen("landing");
    setQuizStep(0);
    setAnswers({});
    setRoute(null);
    setStopIndex(0);
    setError(null);
    window.history.replaceState({}, "", window.location.pathname);
  }

  return (
    <main className="phone-frame">
      <div className="phone-screen">
        {error ? (
          <p className="absolute left-4 right-4 top-3 z-30 rounded-xl bg-red-50 px-3 py-2 text-center text-xs text-red-800">
            {error}
          </p>
        ) : null}

        {screen === "landing" ? (
          <Landing
            onStart={() => {
              setQuizStep(0);
              setAnswers({});
              setScreen("quiz");
            }}
          />
        ) : null}

        {screen === "quiz" ? (
          <Quiz
            stepIndex={quizStep}
            answers={answers}
            onSelect={handleQuizSelect}
            onBack={() => {
              if (quizStep === 0) {
                setScreen("landing");
                return;
              }
              setQuizStep((s) => s - 1);
            }}
          />
        ) : null}

        {screen === "generating" ? <Generating /> : null}

        {screen === "overview" && route ? (
          <RouteOverview
            route={route}
            onStart={() => setScreen("stop")}
            onBack={restart}
          />
        ) : null}

        {screen === "stop" && route ? (
          <StopCard
            stop={route.stops[stopIndex]}
            index={stopIndex}
            total={route.stops.length}
            routeTitle={route.title}
            company={answers.company ?? "alone"}
            onPrev={() => setStopIndex((i) => Math.max(0, i - 1))}
            onNext={() =>
              setStopIndex((i) => Math.min(route.stops.length - 1, i + 1))
            }
            onFinish={() => setScreen("finish")}
          />
        ) : null}

        {screen === "finish" && route ? (
          <FinishShare route={route} shareUrl={shareUrl} onRestart={restart} />
        ) : null}
      </div>
    </main>
  );
}

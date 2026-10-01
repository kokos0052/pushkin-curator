import type { Company, Duration, Interest, Mood } from "./types";

export const BRAND = "Мой куратор";
export const TAGLINE = "Маршрут под настроение, а не по каталогу";
export const CTA_START = "Собрать маршрут";

export const QUIZ_STEPS = [
  {
    key: "duration" as const,
    title: "Сколько у тебя времени?",
    options: [
      { value: 30 as Duration, label: "30 мин", hint: "короткий круг" },
      { value: 60 as Duration, label: "60 мин", hint: "спокойный темп" },
      { value: 90 as Duration, label: "90 мин", hint: "с паузами" },
    ],
  },
  {
    key: "mood" as const,
    title: "Какое настроение сегодня?",
    options: [
      { value: "calm" as Mood, label: "Спокойствие", hint: "тишина и свет" },
      { value: "drama" as Mood, label: "Драма", hint: "жест и напряжение" },
      {
        value: "discovery" as Mood,
        label: "Открытие",
        hint: "неожиданные встречи",
      },
    ],
  },
  {
    key: "interest" as const,
    title: "Что хочется увидеть?",
    options: [
      { value: "antiquity" as Interest, label: "Античность", hint: "Египет и Греция" },
      { value: "renaissance" as Interest, label: "Ренессанс", hint: "линия и свет" },
      {
        value: "impressionism" as Interest,
        label: "Импрессионизм",
        hint: "воздух и цвет",
      },
      { value: "modern" as Interest, label: "XX век", hint: "новый взгляд" },
      { value: "sculpture" as Interest, label: "Скульптура", hint: "форма и объём" },
    ],
  },
  {
    key: "company" as const,
    title: "С кем идёшь?",
    options: [
      { value: "alone" as Company, label: "Один", hint: "личный темп" },
      { value: "couple" as Company, label: "Пара", hint: "вдвоём" },
      { value: "kids" as Company, label: "С детьми", hint: "просто и живо" },
    ],
  },
];

export const GENERATING_LINES = [
  "Куратор читает твоё настроение…",
  "Подбирает залы без лишней суеты…",
  "Собирает истории короче очереди…",
  "Проверяет, чтобы маршрут успел в твоё время…",
];

# Промпты и контракт данных

Источник истины в коде: [`server/lib/prompts.ts`](../server/lib/prompts.ts), каталог: [`server/data/artworks.json`](../server/data/artworks.json).

## Поля произведения

```ts
{
  id: string
  title: string
  artist: string
  hall: string
  period: string
  tags: string[]
  mood: ("calm" | "drama" | "discovery")[]
  interests: ("antiquity" | "renaissance" | "impressionism" | "modern" | "sculpture")[]
  durationHint: number  // минуты у работы
  imageHue: number      // для визуального плейсхолдера
  fact: string          // одна точная фраза
}
```

Сейчас в каталоге **30** объектов.

## System prompt (куратор)

Тёплый личный куратор Пушкинского. Коротко, по-русски, без канцелярита и без самоидентификации как ИИ. Не выдумывает произведения вне списка кандидатов.

## `/api/route`

1. Фильтр кандидатов по quiz (`filterCandidates`).
2. LLM получает кандидатов + параметры гостя.
3. Ответ строго JSON:

```json
{
  "title": "...",
  "theme": "...",
  "totalMinutes": 60,
  "stops": [
    {
      "artworkId": "van-gogh-red-vineyard",
      "story": "2-3 предложения",
      "whyForYou": "1 предложение"
    }
  ]
}
```

4. Валидация Zod + проверка, что `artworkId` ∈ кандидаты.
5. При любой ошибке → `buildFallbackRoute`.

## `/api/ask`

Контекст: название маршрута, произведение, факт, тип компании, вопрос гостя.  
Ответ: 2–4 предложения. Fallback — шаблон на базе `fact`.

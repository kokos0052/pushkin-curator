# Мой куратор — Пушкинский музей

Стартовый каркас веб-сервиса персональных маршрутов для IT-продлёнки Яндекса × Пушкинский музей.

## Быстрый старт

```bash
cd pushkin-curator
npm install
cp .env.example .env.local   # опционально: ключи Yandex AI Studio
npm run dev
```

Открой [http://localhost:5173](http://localhost:5173) на телефоне в той же сети или через туннель.

Без ключей сервис работает в **демо-режиме** (fallback-маршруты и ответы).

## Стек

- Vite + React 19 + TypeScript + Tailwind
- PWA (`vite-plugin-pwa`, installable, offline shell)
- Express API (`/api/route`, `/api/ask`) в том же процессе, что и Vite
- Yandex AI Studio через OpenAI-compatible API (`openai` SDK)
- Каталог `server/data/artworks.json` (30 произведений)
- Промпты: `server/lib/prompts.ts`

## API

| Метод | Путь | Назначение |
|---|---|---|
| `POST` | `/api/route` | quiz → персональный маршрут |
| `POST` | `/api/ask` | вопрос куратору по остановке |

## Документы к событию

- [UX и копирайт](./docs/UX.md)
- [Питч и демо-скрипт](./docs/DEMO.md)
- [Чеклист дня](./docs/DAY_CHECKLIST.md)

## Env

```env
YC_API_KEY=
YC_FOLDER_ID=
# YC_BASE_URL=https://ai.api.cloud.yandex.net/v1
# YC_MODEL=gpt://<folder_id>/yandexgpt/latest
```

## Скрипты

```bash
npm run dev      # Express + Vite HMR на :5173
npm run build    # typecheck + production bundle в dist/
npm start        # production: static + API
npm run lint
```

## Деплой на Netlify

SPA уходит в `dist/`, API — в Netlify Functions (`/api/route`, `/api/ask`). Конфиг уже в `netlify.toml`.

1. Запушь репозиторий на GitHub/GitLab.
2. [Netlify](https://app.netlify.com) → **Add new site** → **Import an existing project**.
3. Build settings подтянутся из `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. **Site configuration → Environment variables** добавь (если нужны AI-ответы):
   - `YC_API_KEY`
   - `YC_FOLDER_ID`
   - опционально `YC_BASE_URL`, `YC_MODEL`
5. Deploy. Без ключей сайт работает в демо-режиме (fallback).

Локально как на Netlify:

```bash
npx netlify dev
```

## Структура

```
src/
  App.tsx        # экраны приложения
  components/    # 6 экранов + Ask sheet
  lib/           # types, copy (клиент)
server/
  index.ts       # Express + Vite middleware / static (локально)
  api/           # Express-обёртки
  lib/           # yandex, fallback, handlers, …
  data/          # artworks.json
netlify/
  functions/     # /api/route, /api/ask для Netlify
docs/            # UX, DEMO, DAY_CHECKLIST
```

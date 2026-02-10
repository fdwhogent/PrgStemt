# PrgStemt

Realtime poll-applicatie voor HOGENT. Docenten maken polls aan, studenten stemmen live mee, resultaten worden elke 3 seconden bijgewerkt.

## Tech Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS v4** (HOGENT-huisstijl)
- **Upstash Redis** (data-opslag)
- **Vercel** (hosting)

## Functionaliteit

- `/admin` - Poll aanmaken met 2-4 antwoordopties
- `/` - Stemmen + live resultaten als balkgrafiek
- Dubbelstem-preventie via localStorage
- Auto-refresh resultaten (3s polling)

## Lokaal opstarten

### 1. Clone en installeer

```bash
git clone https://github.com/<username>/PrgStemt.git
cd PrgStemt
npm install
```

### 2. Redis instellen

Maak een gratis Redis-database aan op [console.upstash.com](https://console.upstash.com/).

Kopieer `.env.example` naar `.env.local` en vul je credentials in:

```bash
cp .env.example .env.local
```

### 3. Starten

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

## Deploy op Vercel

1. Push naar GitHub
2. Importeer het project op [vercel.com](https://vercel.com)
3. Voeg environment variables toe (`UPSTASH_REDIS_REST_URL` en `UPSTASH_REDIS_REST_TOKEN`)
4. Deploy

## Projectstructuur

```
app/
  page.tsx          - Stempagina
  admin/page.tsx    - Admin pagina
  api/
    poll/route.ts   - GET/POST poll
    vote/route.ts   - POST stem
    results/route.ts - GET resultaten
components/
  Header.tsx        - Navigatie
  VoteCard.tsx      - Stem-knop
  ResultsChart.tsx  - Balkgrafiek
  PollForm.tsx      - Poll-formulier
lib/
  redis.ts          - Redis client
  types.ts          - TypeScript types
```

## Redis Data Model

| Key | Type | Beschrijving |
|-----|------|--------------|
| `current_poll` | String (JSON) | Actieve poll met vraag en opties |
| `votes:{pollId}` | Hash | Stemtelling per optie-index |

# Rafael Akira — portfolio

Personal portfolio built from the Figma file *Portfolio 2026 – Initial Studio* (section “Ready to deploy V1 — Clean”).
Static site: **Astro** + **Carbon Design System tokens** + **IBM Plex**, hosted free on **Cloudflare Workers (static assets)**.

## What is in V1

- **Work** (`/`): intro, content switcher, and the project index with discipline filters and a live count.
- **About** (`/about`): profile, experience, expertise, academics, recognitions, clients.
- **Hero widget**: the clock field. Every clock is drawn on a canvas and turns clockwise between scenes:
  idle (10:10) → current weather → wind → São Paulo time, then loops (3 s holds after 2.2 s sweeps).
  Hover leaves a Blue 60 trail, click or Enter/Space jumps to the next scene. Live data from
  [Open-Meteo](https://open-meteo.com) (no key) and `Intl` for the São Paulo time.
- **Lab and Memo** are disabled tabs with a Carbon tooltip (“Under maintenance. Coming soon.”).
- **Themes**: Gray 100 by default, White when the visitor’s system prefers light. Colors come only from Carbon tokens
  (`src/styles/carbon.scss`).

## Layout rules (from the Figma specs card)

| | Grid | Hero widget |
|---|---|---|
| ≥ 1056 px | 16 columns, 32 px gutter, 40 px margin (max 1584) | full field, 66 × 20 clocks, height = width × 482 / 1584 |
| < 1056 px | stacked rows and About sections | compact field, 33 × 11 clocks, clock pitch ≤ 24 px |
| < 672 px | 4 columns, 32 px gutter, 16 px margin | 402 × 137 on a 402 px phone |

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs ./dist
npm run preview
```

## Deploy (Cloudflare, free)

1. In the Cloudflare dashboard: **Workers & Pages → Create → Import a repository**, pick this repo.
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy` (uses `wrangler.jsonc`, which serves `./dist`)
2. **Custom domain**: Worker → Settings → Domains & Routes → Add → Custom domain. The root domain must use
   Cloudflare nameservers (add the domain to Cloudflare and change the nameservers at your registrar; the registration
   itself can stay where it is).
3. Set `site` in `astro.config.mjs` to the domain (used for canonical URLs).

Manual deploy from your machine: `npx wrangler login` once, then `npm run deploy`.

## Content still to confirm

- Footer availability line: “[confirm wording]”.
- Project “for whom” column: every row shows “[for whom]”.
- Recognitions: two years marked “[Year — to confirm]”.
- About → Clients repeats the Expertise lists (placeholder in the design).
- Portrait: placeholder box until a photo is added.
- Links without URLs render as plain text: Behance, Résumé (PDF), Bluesky, Threads, Mastodon, Cosmos, Instagram
  (`src/data/site.ts`).

## Roadmap

- Lab and Memo pages (enable the tabs in `src/components/ContentSwitcher.astro`).
- One page per project (rows in `src/data/projects.ts` become links).
- Real `npx rafael-akira-md` package (published to npm; it can fetch a profile file from this site).
- AI-readable profile (`/llms.txt`, `/profile.md`, JSON-LD).
- Content, design and micro-interaction adjustments.

## Structure

```
src/
  components/        Header, Hero (clock field), Intro, ContentSwitcher, ProjectIndex, Tag, PageHeader, Footer
  data/              site.ts, projects.ts, about.ts — all copy lives here
  scripts/clockfield field.js (scene generator, shared with the Figma storyboard), engine.js (canvas + motion)
  styles/            carbon.scss (Gray 100 / White tokens), global.scss
  pages/             index.astro (Work), about.astro, 404.astro
```

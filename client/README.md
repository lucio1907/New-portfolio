# Lucio Gastellu — portfolio

A portfolio told as a product keynote: each project is a launch, and the animations move with the scroll in both directions. Server-rendered with Next.js, in Spanish and English.

```bash
npm install
npm run dev        # http://localhost:3000/es (or /en)
npm test
npx tsc --noEmit && npm run lint
```

## How it is organized

| Part | What it does | Where |
|------|--------------|-------|
| Sections | Server components: hero, manifesto, launches, more projects, the number, trajectory, how I work, technical sheet, contact | `src/features/portfolio/components` |
| Scenes | One thin client component per section, holding only its animation | `src/features/portfolio/motion` |
| Logic | Pure, tested helpers: sorting, periods, project selection, counters | `src/features/portfolio/lib` |
| Content | Projects, experience and stack in `src/json`, all other copy in `messages/` | |

## Motion rules

- Each section has one idea and one motion, tied to the scrollbar. Only the hero's entrance and hover effects run on time.
- Scrolling stays native. The two stages that stay in place (POS chapter, trajectory) use CSS `position: sticky`, and only on desktop.
- Animations use `transform`, `opacity` and `clip-path`, so they never move the layout.
- GSAP loads after the page. All content is in the HTML and readable in its final state without JavaScript or with reduced motion.

## CI/CD

`.github/workflows/ci-cd.yml`, at the repository root, runs on every pull request and on pushes to `main` and `development`:

- **Quality:** lint, types, unit tests, build, a smoke test that starts the production build and checks that `/es` and `/en` have their main sections, and a browser check. In the branch protection of `main`, mark it as required; GitHub lists it as "Lint, types, tests, build and smoke test". Until then a failing pull request can still be merged.
- **Browser check:** `npm run check:browser`, after `npm run build`, opens the production build in Google Chrome, at `/es` and `/en`, on desktop and phone sizes and with reduced motion. It fails on uncaught or console errors, failed requests, scenes that did not run, animated content that stays hidden or out of place, the career road not reaching its end, pictures or the CV that do not load, and sideways scroll. It does not read the text, so wrong copy passes. The page's requests to other sites are answered locally, so analytics stay clean and a third party's outage cannot fail it; for the same reason a 5xx on a remote picture is ignored, while a 4xx fails because it points to our own config. The server still fetches remote pictures and Chrome keeps its own background traffic, so the check is not fully offline.
- **Security audit:** `npm audit` for production dependencies, failing on high or critical advisories. It can turn red on a pull request that changed nothing, when a new advisory is published. Mark it as required too if that should block merges; the deploy does not wait for it.
- **Deploy:** production on Vercel, only for pushes to `main` that passed Quality. Without its secrets it deploys nothing and leaves a warning on the run.

To turn the deploy on:

1. Set the Vercel project's **Root Directory** to `client`.
2. In GitHub, under Settings, Secrets and variables, Actions, add `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`. The token comes from your Vercel account settings; both IDs are in `.vercel/project.json` after running `vercel link` locally.
3. If the project is connected to this repository in Vercel, disconnect it under the project's Settings, Git; otherwise each merge deploys twice, once without waiting for the checks.

To roll back, use Instant Rollback in the Vercel dashboard. After a rollback Vercel stops assigning production domains, so later runs of this pipeline stay green without going live until you use Undo Rollback or `vercel promote`.

## Before shipping

- [ ] `npm test`, `npx tsc --noEmit`, `npm run lint` and `npm run build` pass
- [ ] Scroll the whole page on a real phone, above all iOS Safari
- [ ] Update Next: `npm audit --omit=dev` reports advisories in it, including a critical one

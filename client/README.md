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

- **Quality:** lint, types, unit tests, build, and a smoke test that starts the production build and checks that `/es` and `/en` have their main sections. Mark this check as required in the branch protection of `main`.
- **Security audit:** `npm audit` for production dependencies. It reports without blocking until the advisories in Next are fixed; then remove `continue-on-error`.
- **Deploy:** production on Vercel, only for pushes to `main` that passed Quality. Without its secrets it deploys nothing and leaves a warning on the run.

To turn the deploy on:

1. Set the Vercel project's **Root Directory** to `client`.
2. In GitHub, under Settings, Secrets and variables, Actions, add `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`.
3. If the project is connected to this repository in Vercel, turn off its automatic deployments for `main`; otherwise each merge deploys twice, once without waiting for the checks.

To roll back, promote an earlier deployment from the Vercel dashboard, or run `vercel rollback`.

## Before shipping

- [ ] `npm test`, `npx tsc --noEmit`, `npm run lint` and `npm run build` pass
- [ ] Scroll the whole page on a real phone, above all iOS Safari
- [ ] Update Next: `npm audit --omit=dev` reports advisories in it, including a critical one

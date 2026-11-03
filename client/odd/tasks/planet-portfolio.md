# Planet portfolio
Objective: rebuild the portfolio from scratch as a recruiter-first HTML site with a procedural Three.js mini-planet as progressive enhancement.
Branch: feat/planet-portfolio · Delivery: ask-on-risk · Test runner: `npm test` (node:test) + tsc + lint + build + CDP/headless checks. Approved plan: ~/.claude/plans/borremos-esta-idea-y-nested-church.md

## Specs
- S1. "borremos esta idea y creemos una nueva desde 0". The pull-request concept is removed; the site is rebuilt from scratch (CV-synced data in `src/json` and i18n stay).
- S2. "Quiero que mi portafolio sea lo mas original posible, que un recruiter lo pueda ver con normalidad y un desarrollador lo pueda ver y decir que original este porgtafolio." → recruiter-first HTML content layer + developer layer (Dev mode with live GPU stats, easter eggs).
- S3. "siento que la idea del PR esta buena pero para un recruiter comun lo abrumaria mucho con tanta informacion." → short, scannable sections; no information overload.
- S4. "Me gustaria hacer algo en 3d haciendo modelos en 3d con threejs, que este bien optimizado y funcione extremadamente bien". Concept chosen by the user: "Mini-planeta" (planet rotates with scroll; each section is a landmark). All models procedural in code; performance contract from the approved plan (≈12 draw calls, ≤120k tris desktop / ≤40k mobile, lazy 3D chunk, demand frameloop, DPR clamp + adaptive tiers, native scroll only, fallbacks for no-WebGL and reduced motion).
- S5. "ya que vamos a usar three js, me gustaria que encuentres la mejor skill para realizar modelos en 3d y la instales solo en este proyecto." → `cloudai-x/threejs-skills` (selected skills) installed project-only in `client/.claude/skills`.
- S6. "Necesito hacer un plan lo mas detallado posible para no cometer ningun error" → follow the approved plan's units, budgets and verification.

## Tasks
| ID | Specs | Route | Status | Commit |
|---|---|---|---|---|
| U0 Setup: skills, deps, remove PR feature, move reusable helpers | S1, S5 | inline | done (verifier pending, Risk item 5) | bb50b30, see log |
| U1 Recruiter-first HTML site | S2, S3 | inline | pending | — |
| U2 Planet core (terrain, ocean, atmosphere, stars, lazy stage + fallbacks) | S4 | inline | pending | — |
| U3 Landmarks & procedural models | S4 | inline | pending | — |
| U4 Scroll choreography & interaction | S2, S4 | inline | pending | — |
| U5 Performance hardening + poster | S4 | inline | pending | — |
| U6 Dev mode & easter eggs | S2 | inline | pending | — |
| U7 QA & docs | S2–S6 | inline | pending | — |

## Log
- L1 (2026-11-03): "borremos esta idea y creemos una nueva desde 0. Quiero que mi portafolio sea lo mas original posible, que un recruiter lo pueda ver con normalidad y un desarrollador lo pueda ver y decir que original este porgtafolio. Me gustaria hacer algo en 3d haciendo modelos en 3d con threejs, que este bien optimizado y funcione extremadamente bien, que me recomendas? siento que la idea del PR esta buena pero para un recruiter comun lo abrumaria mucho con tanta informacion. ya que vamos a usar three js, me gustaria que encuentres la mejor skill para realizar modelos en 3d y la instales solo en este proyecto. Necesito hacer un plan lo mas detallado posible para no cometer ningun error"
- L2 (2026-11-03): Concept question → user chose "Mini-planeta". Versions verified on npm: three 0.186.1 (0.187.0 too fresh), @react-three/fiber 9.8.2 (peer react >=19 <19.4), @react-three/drei 10.7.9. Plan approved. Branch feat/planet-portfolio created from ababd70.
- L3 (2026-11-03): U0. Skills: `npx skills add cloudai-x/threejs-skills --skill <9 names> --agent claude-code --copy -y` → client/.claude/skills/threejs-{fundamentals,react-three-fiber,performance,geometry,materials,shaders,lighting,animation,interaction}; markdown only, no scripts, only external host cdn.jsdelivr.net; ~/.claude/skills unchanged; skills-lock.json committed (bb50b30); registry refreshed (client/.atl, ignored). Deps pinned exact: three 0.186.1, @react-three/fiber 9.8.2, @types/three 0.186.0; framer-motion removed. Deviation from plan: @react-three/drei NOT installed (it pulls hls.js, mediapipe, troika, camera-controls…; we only needed PerformanceMonitor + damping, implemented in lib/quality + lib/poses). Moved sortByNewest/slugify/mailtoHref (+ new projectTags) to src/features/portfolio/lib/content.ts with tests; constants + LanguageToggle moved; src/features/pull-request and `pr` copy deleted; placeholder page until U1. Checks: tsc, lint, npm test 4/0, npm ls consistent. `npm audit --omit=dev` reports pre-existing advisories in next ≤16.4 (postcss, sharp), nanoid, source-map-js, baseline-browser-mapping — none from three/R3F; fixing needs a Next upgrade (out of scope, flagged to user).

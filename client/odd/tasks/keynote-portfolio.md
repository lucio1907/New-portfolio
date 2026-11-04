# Keynote portfolio
Objective: replace the 3D experience with a scrollable, server-rendered portfolio where each project is presented like a product launch, with scroll-linked motion and no 3D.
Branch: feat/keynote-portfolio · Delivery: ask-on-risk (chain strategy to be asked before any pull request; nothing is pushed yet) · Test runner: `npm test` (node:test) + tsc + lint + build + CDP checks. Approved plan: ~/.claude/plans/olvidate-del-3d-elimina-wild-cookie.md

## Specs
- S1. "olvidate del 3d" → no 3D anywhere: room, three.js and React Three Fiber are removed. Assumption (in the approved plan): LucioOS goes too, because the page scrolls again; it stays in git history.
- S2. "elimina las skills que haya en el proyecto para hacer modelos 3d y three js del proyecto tambien" → the project's `threejs-*` skills and the `three` dependencies are removed.
- S3. "Quiero que hagas un buen portfolio, que sea lindo de ver" → Keynote concept: warm paper, huge type, one idea per screen.
- S4. "que tenga muy buenas animaciones al estilo de apple" → scroll-linked motion that moves with the scroll in both directions, native scroll, at most 2 pinned sections, only transform/opacity/clip-path, reduced motion shows final states.
- S5. "necesito que se vea original y no parezca hecho por la IA" → no dark gradient, glass cards, gradient text, icon card grids, tech pills, Inter, emoji greeting, typewriter or generic copy. Copy only from real facts. No AI-generated images.
- S6. Concept chosen by the user: "Keynote (Recomendado)" → each project is a launch: big headline, a real number, the image shrinking with scroll. Sections and motion as in the approved plan.

## Tasks
| ID | Specs | Route | Status | Commit |
|---|---|---|---|---|
| W0 Remove 3D, skills, dependencies, LucioOS; plain scrollable page | S1, S2 | inline | in progress | — |
| W1 Foundation: tokens, fonts, GSAP, useScene, motion math | S3, S4, S5 | inline | pending | — |
| W2 Hero + Manifesto + POS chapter; user checkpoint | S3–S6 | inline | pending | — |
| W3 Other chapters + Numbers | S3–S6 | inline | pending | — |
| W4 Trajectory, Stack, Contact, Nav, footer | S3–S6 | inline | pending | — |
| W5 QA and docs | S1–S6 | inline | pending | — |

Route evidence: inline by default; no Writer trigger reason (no parallel independent units, and later units depend on W1). W0 and W1 name high-risk item 5 (dependencies), so they get an independent verifier.

## Log
- L1 (2026-11-04): "olvidate del 3d, elimina las skills que haya en el proyecto para hacer modelos 3d y three js del proyecto tambien. Quiero que hagas un buen portfolio, que sea lindo de ver y que tenga muy buenas animaciones al estilo de apple. necesito que se vea original y no parezca hecho por la IA, dame recomendaciones para hacer"
- L2 (2026-11-04): Recommendations given and the concept asked; user chose "Keynote (Recomendado)" and approved the plan. The design-system search suggested dark + JetBrains Mono + green and a FAQ layout; discarded because that is the look S5 rejects. Facts checked: gsap 3.15.1 (Standard no-charge license, about 27 KB gzip core), motion 14.9.1 (MIT). Found: FitnessApp's image in projects.json is AI generated (`Gemini_Generated_Image...`), so that chapter stays typographic. POS and CRM have no screenshots yet, so they are typographic until the user provides them; no mock screens with invented data.

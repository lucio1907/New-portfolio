# Debug me portfolio
Objective: interactive "Debug me" portfolio where the visitor fixes 5 micro-bugs that reveal each section, synced with the CV.
Branch: feat/debug-me · Delivery: ask-on-risk · Test runner: none (exception: lint + build + browser checks).

## Specs
- S1. Everything is created inside `client/` ("hace todo dentro de la carpeta client, no crees nada fuera de esa carpeta").
- S2. The CV is the source of truth for experience, stack, bio and education (user choice: "CV es la verdad").
- S3. The site loads "broken" ("Deployé a producción un viernes, ayudame a arreglarlo"); 5 micro-bugs each reveal a section: About (catch bug on photo), Tech stack (retry failing loader), Experience (reorder shuffled timeline), Projects (fix misaligned cards), Contact (fix failing deploy).
- S4. Progress HUD ("🐛 3/5 bugs fixed"); at 5/5 → "✓ Deploy successful" + confetti.
- S5. Persistent "Soy recruiter, arreglalo vos" button fixes everything instantly.
- S6. Content stays legible while broken; name, role, availability, CV download and contact visible in the first 5s with zero interaction.
- S7. Drag & drop is keyboard accessible; fast on mobile; respects prefers-reduced-motion.
- S8. UI copy in EN and ES (next-intl); code/UI artifacts in English by default.

## Tasks
| ID | Specs | Route | Status | Commit |
|---|---|---|---|---|
| T1 Content sync with CV | S2, S8 | inline | done | e4654ad |
| T2 Engine: reducer, store, HUD, recruiter button, broken banner | S3–S6, S8 | inline | done | 50e304e |
| T3 Bugs 1–2 (photo, skills loader) | S3, S6, S7 | inline | done | 8ce098b |
| T4 Bugs 3–4 (timeline, projects layout) | S3, S6, S7 | inline | done (real-mouse drag pending manual check) | cf6784d, eb0513c |
| T5 Bug 5 (deploy terminal) + success + confetti | S3, S4, S7 | inline | done | eb0513c |
| T6 Logo, visual polish, a11y/perf pass | S6–S8 | inline | pending | |

## Log
- L1 (2026-11-02): "/home/luciogastellu/Downloads/CV-LucioGastellu-FullStackAI.pdf mi CV lo podes analizar en esa ruta y baja a detalle "debug me""
- L2 (2026-11-02): "retomá el portfolio Debug me desde engram". CV vs JSON conflict (current role, Nexus title/dates, Toyota title) → user chose "CV es la verdad". Plan approved.
- L3 (2026-11-02): Verified in Chrome (dev, 1862px): hero info visible with zero interaction; all 5 bugs fixed via buttons only (keyboard path); HUD counts 0→5, recruiter fix-all and reset work; progress persists across reload; /es and /en copy OK. Drag: multi-step pointer events align a card; CDP left_click_drag did not, so real-mouse drag needs a manual check. Found and fixed: native img/link dragstart cancelled the gesture. Not verified: 375px mobile (window resize had no effect), reduced-motion emulation. Only hydration warning came from a browser extension attribute (cz-shortcut-listen). Next: T6.

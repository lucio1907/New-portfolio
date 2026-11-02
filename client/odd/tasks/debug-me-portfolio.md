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
- S9. Full visual redesign: "me gusta la idea pero no me gusta el diseño, quiero que lo rediseñes completamente, quiero que se vea divertido". Direction chosen: "Neo-brutalismo juguetón" (light background, thick black borders, hard offset shadows, saturated yellow/pink/blue, sticker-style badges). Game mechanics and content stay.
- S10. "ya que aparece esa funcion para el recruiter, me gustaria que se pueda resolver algunos bugs con un codigo que no sea ni muy basico ni muy avanzado o que se puedan resolver de otra manera de ademas de tocar los botones". Buttons and the recruiter fix-all stay.
- S11. Stack: intermediate JS challenge (async retry: missing await + off-by-one) checked by tests. Experience: JS sort challenge (newest first, string dates, no mutation) checked by tests.
- S12. Visitor code runs only inside a terminable Web Worker with a timeout; never on the main thread, never touching the DOM.
- S13. Projects: CSS editor with live preview; fixed when the rules pass (display grid, no absolute positioning, gap, columns).
- S14. Contact: interactive terminal (`export CONTACT_EMAIL=...`, `npm run deploy`, `help`, extras). Every bug can also be fixed from the DevTools console (`debugMe.help()`).

## Tasks
| ID | Specs | Route | Status | Commit |
|---|---|---|---|---|
| T1 Content sync with CV | S2, S8 | inline | done | e4654ad |
| T2 Engine: reducer, store, HUD, recruiter button, broken banner | S3–S6, S8 | inline | done | 50e304e |
| T3 Bugs 1–2 (photo, skills loader) | S3, S6, S7 | inline | done | 8ce098b |
| T4 Bugs 3–4 (timeline, projects layout) | S3, S6, S7 | inline | done (real-mouse drag pending manual check) | cf6784d, eb0513c |
| T5 Bug 5 (deploy terminal) + success + confetti | S3, S4, S7 | inline | done | eb0513c |
| T6 Neo-brutalist redesign of every section + HUD/bugs, logo, a11y/perf pass | S6–S9 | inline | redesign done; reduced-motion + real-mouse drag + Lighthouse pending | 57962a5 |
| T7 Sandbox harness + challenge definitions + worker runner + `npm test` (node:test) | S11, S12 | inline | done | bdc494c |
| T8 Code challenge UI wired to Stack and Experience | S10, S11 | inline | done (browser-verified) | decf685 |
| T9 CSS challenge with live preview for Projects | S10, S13 | inline | done (browser-verified) | f7e0d6d |
| T10 Interactive terminal for Contact + DevTools console API | S10, S14 | inline | terminal done (unit-tested, not browser-verified); DevTools API pending | see log |

## Log
- L1 (2026-11-02): "/home/luciogastellu/Downloads/CV-LucioGastellu-FullStackAI.pdf mi CV lo podes analizar en esa ruta y baja a detalle "debug me""
- L2 (2026-11-02): "retomá el portfolio Debug me desde engram". CV vs JSON conflict (current role, Nexus title/dates, Toyota title) → user chose "CV es la verdad". Plan approved.
- L3 (2026-11-02): Verified in Chrome (dev, 1862px): hero info visible with zero interaction; all 5 bugs fixed via buttons only (keyboard path); HUD counts 0→5, recruiter fix-all and reset work; progress persists across reload; /es and /en copy OK. Drag: multi-step pointer events align a card; CDP left_click_drag did not, so real-mouse drag needs a manual check. Found and fixed: native img/link dragstart cancelled the gesture. Not verified: 375px mobile (window resize had no effect), reduced-motion emulation. Only hydration warning came from a browser extension attribute (cz-shortcut-listen). Next: T6.
- L4 (2026-11-02): "me gusta la idea pero no me gusta el diseño, quiero que lo rediseñes completamente, quiero que se vea divertido" → chose "Neo-brutalismo juguetón". Added S9; T6 reopened as full redesign.
- L5 (2026-11-02): Redesign shipped (57962a5): cream dotted bg, 3px ink borders, hard shadows, yellow/pink/blue/green/lilac, hero dev-pass card + stickers + tech marquee, card sections, sticker logo "LG". Verified in Chrome: all sections render, recruiter fix-all → deployed state + confetti, no horizontal scroll at 375px (iframe check), mobile HUD fits. Found and fixed: framer-motion inline transform overrides Tailwind rotate on motion elements; projects clip cut shifted cards; per-document store diverged across tabs → storage-event sync (verified on production build with 3 documents). `next build` fails while `next dev` shares .next (Turbopack font error); build passes alone.
- L6 (2026-11-02): "ya que aparece esa funcion para el recruiter, me gustaria que se pueda resolver algunos bugs con un codigo que no sea ni muy basico ni muy avanzado o que se puedan resolver de otra manera de ademas de tocar los botones, agrega esta idea a engram para guardar en donde nos quedamos y arranca la ejecucion". Saved to Engram (portfolio/debug-me-code-challenges). Node 22.23 runs TS tests natively → `node --test`, no new deps. Risk: item 2 (sandbox for visitor code) → independent verifier at the end.
- L7 (2026-11-02): T7–T9 done and browser-verified (starter 1/3, infinite loop → timeout with main thread alive, fixes mark bugs). Fixed ICU bug: `</>` in messages parsed as closing tag. T10 terminal committed with 40/40 node tests; NOT yet checked in browser. Pending: DevTools console API (`debugMe.help()`), browser check of terminal, independent verifier for sandbox (Risk item 2), production build.

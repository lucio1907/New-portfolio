# Lucio Gastellu — portfolio

A portfolio you sit down at. Visitors land in a small 3D room at night, a cut-away diorama floating in the dark, built entirely in code with Three.js. The screen shows nothing else: no card, no text, only a pulse on the monitor. Sitting at the computer opens **LucioOS**, a desktop where every section is a window. Recruiters get plain, fast HTML; developers get a terminal and live render stats.

## Quick path

```bash
npm install
npm run dev        # http://localhost:3000/es (or /en)
npm test           # pure logic: windows, terminal, geometry, picking, camera
npx tsc --noEmit && npm run lint
```

Try it: drag the room to turn it, click the computer to sit down, press <kbd>`</kbd> for render stats, or open the Terminal and type `help`.

## How it works

| Layer | What it does | Where |
|-------|--------------|-------|
| Content | Server-rendered sections (about, experience, projects, stack, contact) from `src/json` and `messages/` | `src/features/portfolio` |
| LucioOS | No-scroll desktop: icons, draggable windows (sheets on phones), taskbar, deep links (`/es#projects`), terminal | `src/features/os` |
| Room | Procedural diorama, light baked per vertex, sit/stand camera flight, limited drag-to-orbit, stats probe | `src/features/room` |
| Experience | Tiny shared store: room → sitting → desktop, open windows, stats toggle | `src/features/experience` |

Pure logic lives in `lib/` folders with `node:test` tests; components stay thin.

## Performance

| Budget | Measured |
|--------|----------|
| three.js out of the initial load | lazy chunk after `requestIdleCallback`, ~250 KB gzip |
| ≤ 10 draw calls | 3 (room merged into one geometry, monitor, window) |
| ≤ 60k triangles desktop, ≤ 25k mobile | ~21k desktop, ~11k mobile |
| No idle rendering | `frameloop="demand"`, 0 fps at rest, frozen while LucioOS covers the room |
| 0 downloaded models or textures | everything is geometry and shaders built in code |

The lighting is baked in code: `room/lib/bake.ts` traces shadow and occlusion rays against the furniture's boxes when the scene is built, and stores the result in the vertex colors. The material is unlit, so there are no runtime lights, shadow maps or lightmaps, and the bake runs in 8 ms slices so it never freezes the page. The night in the window is one shader whose layers shift with the view angle.

Picking narrows down with each object's box and confirms on its triangles (no scene-wide raycasts). Hover glow is a shader uniform, not an extra mesh.

## Accessibility and fallbacks

- No WebGL, reduced motion or data saving → LucioOS opens directly.
- The pulse on the monitor is a real link: it works from the keyboard (Tab, Enter), without JavaScript and before the 3D loads. Windows close with Esc; focus moves into the window in front, and back to the pulse when you stand up.
- Without JavaScript, `#about`, `#projects`… still open their window through CSS `:target`.
- English and Spanish via `next-intl`.

## Checklist before shipping

- [ ] `npm test`, `npx tsc --noEmit`, `npm run lint` pass
- [ ] `npx next build` keeps three.js out of the initial scripts
- [ ] Room, LucioOS and terminal checked on a real phone and desktop

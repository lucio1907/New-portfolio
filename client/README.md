# Lucio Gastellu — portfolio

A portfolio you sit down at. Visitors land in a small 3D desk room at night, built entirely in code with Three.js. Clicking an object opens a section; sitting at the computer opens **LucioOS**, a desktop where every section is a window. Recruiters get plain, fast HTML; developers get a terminal and live render stats.

## Quick path

```bash
npm install
npm run dev        # http://localhost:3000/es (or /en)
npm test           # pure logic: windows, terminal, geometry, picking, camera
npx tsc --noEmit && npm run lint
```

Try it: click the mate, the books or the phone; or press <kbd>`</kbd> for render stats; or open the Terminal and type `help`.

## How it works

| Layer | What it does | Where |
|-------|--------------|-------|
| Content | Server-rendered sections (about, experience, projects, stack, contact) from `src/json` and `messages/` | `src/features/portfolio` |
| LucioOS | No-scroll desktop: icons, draggable windows (sheets on phones), taskbar, deep links (`/es#projects`), terminal | `src/features/os` |
| Room | Procedural low-poly desk room, hotspots, sit/stand camera flight, stats probe | `src/features/room` |
| Experience | Tiny shared store: room → sitting → desktop, open windows, stats toggle | `src/features/experience` |

Pure logic lives in `lib/` folders with `node:test` tests; components stay thin.

## Performance

| Budget | Measured |
|--------|----------|
| three.js out of the initial load | lazy chunk after `requestIdleCallback`, ~240 KB gzip |
| ≤ 10 draw calls | 5 (whole room merged into one geometry) |
| ≤ 60k triangles | ~2.2k |
| No idle rendering | `frameloop="demand"`, 0 fps at rest, frozen while LucioOS covers the room |
| 0 downloaded models or textures | everything is geometry and shaders built in code |

Picking narrows down with each object's box and confirms on its triangles (no scene-wide raycasts). Hover glow is a shader uniform, not an extra mesh.

## Accessibility and fallbacks

- No WebGL, reduced motion or data saving → LucioOS opens directly.
- Every room object has a keyboard twin (Tab, Enter); windows close with Esc; focus moves into the window in front.
- Without JavaScript, `#about`, `#projects`… still open their window through CSS `:target`.
- English and Spanish via `next-intl`.

## Checklist before shipping

- [ ] `npm test`, `npx tsc --noEmit`, `npm run lint` pass
- [ ] `npx next build` keeps three.js out of the initial scripts
- [ ] Room, LucioOS and terminal checked on a real phone and desktop

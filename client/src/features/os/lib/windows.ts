import type { AppId } from "./apps.ts";

/**
 * LucioOS window manager as a pure reducer. `windows` is the z-order:
 * the last visible (non-minimized) window is the focused one.
 */
export type WindowState = {
  app: AppId;
  minimized: boolean;
  /** Set once the visitor drags the window; otherwise the layout cascades it. */
  position: { x: number; y: number } | null;
};

export type DesktopState = { windows: readonly WindowState[] };

export type DesktopAction =
  | { type: "open"; app: AppId }
  | { type: "close"; app: AppId }
  | { type: "minimize"; app: AppId }
  | { type: "toggle"; app: AppId }
  | { type: "move"; app: AppId; x: number; y: number }
  | { type: "closeAll" };

export const EMPTY_DESKTOP: DesktopState = { windows: [] };

export const isOpen = (state: DesktopState, app: AppId): boolean =>
  state.windows.some((window) => window.app === app);

export const focusedApp = (state: DesktopState): AppId | null => {
  for (let i = state.windows.length - 1; i >= 0; i--) {
    if (!state.windows[i].minimized) return state.windows[i].app;
  }
  return null;
};

/** Moves an app's window to the top, restored; creates it when missing. */
const bringToFront = (state: DesktopState, app: AppId): DesktopState => {
  const existing = state.windows.find((window) => window.app === app);
  const others = state.windows.filter((window) => window.app !== app);
  return {
    windows: [...others, { app, minimized: false, position: existing?.position ?? null }],
  };
};

export const desktopReducer = (state: DesktopState, action: DesktopAction): DesktopState => {
  switch (action.type) {
    case "open":
      return bringToFront(state, action.app);
    case "close":
      return isOpen(state, action.app)
        ? { windows: state.windows.filter((window) => window.app !== action.app) }
        : state;
    case "minimize":
      return isOpen(state, action.app)
        ? {
            windows: state.windows.map((window) =>
              window.app === action.app ? { ...window, minimized: true } : window,
            ),
          }
        : state;
    case "toggle": {
      const window = state.windows.find((item) => item.app === action.app);
      if (!window || window.minimized) return bringToFront(state, action.app);
      return focusedApp(state) === action.app
        ? desktopReducer(state, { type: "minimize", app: action.app })
        : bringToFront(state, action.app);
    }
    case "move":
      return isOpen(state, action.app)
        ? {
            windows: state.windows.map((window) =>
              window.app === action.app ? { ...window, position: { x: action.x, y: action.y } } : window,
            ),
          }
        : state;
    case "closeAll":
      return state.windows.length === 0 ? state : EMPTY_DESKTOP;
  }
};

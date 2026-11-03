import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  type DesktopState,
  EMPTY_DESKTOP,
  desktopReducer,
  focusedApp,
  isOpen,
} from "./windows.ts";

const run = (...actions: Parameters<typeof desktopReducer>[1][]): DesktopState =>
  actions.reduce(desktopReducer, EMPTY_DESKTOP);

describe("desktopReducer", () => {
  test("opening a window puts it on top and focuses it", () => {
    const state = run({ type: "open", app: "about" }, { type: "open", app: "projects" });
    assert.deepEqual(state.windows.map((w) => w.app), ["about", "projects"]);
    assert.equal(focusedApp(state), "projects");
  });

  test("each app has at most one window; reopening brings it to the front", () => {
    const state = run(
      { type: "open", app: "about" },
      { type: "open", app: "projects" },
      { type: "open", app: "about" },
    );
    assert.deepEqual(state.windows.map((w) => w.app), ["projects", "about"]);
    assert.equal(focusedApp(state), "about");
  });

  test("closing the focused window focuses the one below it", () => {
    const state = run(
      { type: "open", app: "about" },
      { type: "open", app: "projects" },
      { type: "close", app: "projects" },
    );
    assert.equal(isOpen(state, "projects"), false);
    assert.equal(focusedApp(state), "about");
  });

  test("minimizing hides the window and focus falls to the next visible one", () => {
    const state = run(
      { type: "open", app: "about" },
      { type: "open", app: "stack" },
      { type: "minimize", app: "stack" },
    );
    assert.equal(isOpen(state, "stack"), true);
    assert.equal(state.windows.find((w) => w.app === "stack")?.minimized, true);
    assert.equal(focusedApp(state), "about");
  });

  test("opening a minimized window restores it on top", () => {
    const state = run(
      { type: "open", app: "about" },
      { type: "open", app: "stack" },
      { type: "minimize", app: "stack" },
      { type: "open", app: "stack" },
    );
    assert.equal(state.windows.at(-1)?.app, "stack");
    assert.equal(state.windows.at(-1)?.minimized, false);
    assert.equal(focusedApp(state), "stack");
  });

  test("taskbar toggle: focused → minimize, minimized → restore, background → focus", () => {
    let state = run({ type: "open", app: "about" }, { type: "open", app: "contact" });
    state = desktopReducer(state, { type: "toggle", app: "contact" });
    assert.equal(state.windows.find((w) => w.app === "contact")?.minimized, true);
    state = desktopReducer(state, { type: "toggle", app: "contact" });
    assert.equal(focusedApp(state), "contact");
    state = desktopReducer(state, { type: "toggle", app: "about" });
    assert.equal(focusedApp(state), "about");
  });

  test("moving stores the window position; unknown windows are ignored", () => {
    let state = run({ type: "open", app: "about" }, { type: "move", app: "about", x: 120, y: 80 });
    assert.deepEqual(state.windows[0].position, { x: 120, y: 80 });
    const before = state;
    state = desktopReducer(state, { type: "move", app: "stack", x: 1, y: 1 });
    assert.equal(state, before);
  });

  test("closeAll empties the desktop and actions on closed apps are no-ops", () => {
    const state = run({ type: "open", app: "about" }, { type: "closeAll" });
    assert.deepEqual(state.windows, []);
    assert.equal(focusedApp(state), null);
    assert.equal(desktopReducer(state, { type: "close", app: "about" }), state);
    assert.equal(desktopReducer(state, { type: "minimize", app: "about" }), state);
  });
});

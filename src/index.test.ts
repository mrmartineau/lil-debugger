import { afterEach, describe, expect, test } from "bun:test";

import { type LilDebugger, lilDebugger, pretty } from "./index.js";

let debug: LilDebugger | undefined;
const panel = () => document.querySelector<HTMLElement>(".lil-debugger-panel");
const isOn = () => document.documentElement.classList.contains("lil-debugger");
const key = (type: string, init: KeyboardEventInit) =>
  window.dispatchEvent(new KeyboardEvent(type, init));

afterEach(() => {
  debug?.destroy();
  document.body.innerHTML = "";
});

describe("pretty", () => {
  test("formats JSON objects", () => {
    expect(pretty('{"a":1}')).toBe('{\n  "a": 1\n}');
  });
  test("keeps other values as they are", () => {
    expect(pretty("user:42")).toBe("user:42");
    expect(pretty("42")).toBe("42");
  });
});

describe("lilDebugger", () => {
  test("peeks while Ctrl+Shift is held", () => {
    debug = lilDebugger();
    expect(isOn()).toBe(false);
    key("keydown", { ctrlKey: true, shiftKey: true, key: "Shift" });
    expect(isOn()).toBe(true);
    key("keyup", { ctrlKey: true, shiftKey: false, key: "Shift" });
    expect(isOn()).toBe(false);
  });

  test("turns off when the window loses focus", () => {
    debug = lilDebugger();
    key("keydown", { ctrlKey: true, shiftKey: true });
    window.dispatchEvent(new Event("blur"));
    expect(isOn()).toBe(false);
  });

  test("Ctrl+Shift+L locks it on", () => {
    debug = lilDebugger();
    key("keydown", { ctrlKey: true, shiftKey: true, code: "KeyL" });
    key("keyup", { code: "ShiftLeft" });
    expect(isOn()).toBe(true);
    expect(panel()?.textContent).toContain("locked");
  });

  test("shows nested labels, inner first", () => {
    document.body.innerHTML = `<div data-debug="outer"><span id="x" data-debug='{"a":1}'></span></div>`;
    debug = lilDebugger();
    debug.toggle();
    document.getElementById("x")?.dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));
    const labels = [...(panel()?.querySelectorAll("pre") ?? [])].map((p) => p.textContent);
    expect(labels).toEqual(['{\n  "a": 1\n}', "outer"]);
  });

  test("never renders values as HTML", () => {
    document.body.innerHTML = `<div id="x" data-debug="<img src=x>"></div>`;
    debug = lilDebugger();
    debug.toggle();
    document.getElementById("x")?.dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));
    expect(panel()?.querySelector("img")).toBeNull();
  });

  test("comes back after a client-side router swaps the page", () => {
    debug = lilDebugger();
    document.head.innerHTML = "";
    document.body.innerHTML = `<div data-debug="new page"></div>`;
    key("keydown", { ctrlKey: true, shiftKey: true });
    expect(panel()?.hidden).toBe(false);
    expect(panel()?.textContent).toBe("1 debug elements");
    expect(document.head.querySelector("style")).not.toBeNull();
  });

  test("Escape turns it off, even while Ctrl+Shift is held", () => {
    debug = lilDebugger();
    debug.toggle();
    key("keydown", { ctrlKey: true, shiftKey: true, key: "Escape" });
    expect(isOn()).toBe(false);
    key("keyup", { ctrlKey: true, shiftKey: true, key: "Escape" });
    expect(isOn()).toBe(false);
    key("keyup", { key: "Shift" });
    key("keydown", { ctrlKey: true, shiftKey: true, key: "Shift" });
    expect(isOn()).toBe(true);
  });

  test("a held-down lock key does not toggle again", () => {
    debug = lilDebugger();
    key("keydown", { ctrlKey: true, shiftKey: true, code: "KeyL" });
    key("keydown", { ctrlKey: true, shiftKey: true, code: "KeyL", repeat: true });
    key("keyup", { code: "ShiftLeft" });
    expect(isOn()).toBe(true);
  });

  test("Alt+click is not blocked when there is no clipboard", () => {
    const clipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");
    Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
    document.body.innerHTML = `<a id="x" href="#" data-debug="v"></a>`;
    debug = lilDebugger();
    debug.toggle();
    const click = new MouseEvent("click", { altKey: true, bubbles: true, cancelable: true });
    document.getElementById("x")?.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(false);
    if (clipboard) Object.defineProperty(navigator, "clipboard", clipboard);
    else delete (navigator as { clipboard?: unknown }).clipboard;
  });

  test("toggle after destroy does nothing", () => {
    debug = lilDebugger();
    debug.destroy();
    debug.toggle();
    expect(isOn()).toBe(false);
    expect(panel()).toBeNull();
  });

  test("destroy removes everything", () => {
    debug = lilDebugger();
    debug.toggle();
    debug.destroy();
    expect(isOn()).toBe(false);
    expect(panel()).toBeNull();
    expect(document.querySelector("style")).toBeNull();
    key("keydown", { ctrlKey: true, shiftKey: true });
    expect(isOn()).toBe(false);
  });
});

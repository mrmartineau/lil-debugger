# Lil' Debugger

Docs and demo: [zander.wtf/lil-debugger](https://zander.wtf/lil-debugger)

A tiny dev tool for any framework, or no framework. Add a `data-debug` attribute to any element. Hold <kbd>Ctrl</kbd>+<kbd>Shift</kbd> and the page shows what each element holds.

No dependencies. It adds its own styles.

## Install

```sh
npm install -D @mrmartineau/lil-debugger
```

## Use

```js
import { lilDebugger } from "@mrmartineau/lil-debugger";

if (import.meta.env.DEV) lilDebugger();
```

```html
<div data-debug="user:42">…</div>
<section data-debug='{"plan":"pro","flags":["beta"]}'>…</section>
```

| Do this                     | What happens                                             |
| --------------------------- | -------------------------------------------------------- |
| Hold Ctrl+Shift             | Show the debug info. Let go to hide it.                  |
| Ctrl+Shift+L                | Keep it on. Press again to turn it off.                  |
| Hover a debug element       | The panel shows its label and the labels of its parents. |
| Alt+click                   | Copy the value of the element to the clipboard.          |
| Add `?lil-debug` to the URL | Start with it locked on.                                 |

## Features

- Nested labels: the inner label comes first, then each parent with `data-debug`.
- Element info: tag, `id`, classes and size, for example `<button#save.btn> 120×40`.
- JSON (JavaScript Object Notation) values show on many lines.
- When you hover nothing, the panel shows how many debug elements are on the page.
- Only the innermost hovered element gets a solid outline.
- It turns off if the window loses focus while you hold the keys, so it never gets stuck on.
- Values never render as HTML.
- It does nothing on the server, so it is safe in server-rendered apps.
- `destroy()` removes all listeners, the panel, the styles and the root class.

## Options

```js
const debug = lilDebugger({
  attribute: "data-debug", // the attribute to read
  lockKey: "KeyL", // a KeyboardEvent.code value for Ctrl+Shift+<key>
  injectStyles: true, // set to false to bring your own CSS
});

debug.toggle(); // lock or unlock from code
debug.destroy(); // remove everything
```

Theme it with these custom properties:

```css
:root {
  --lil-debugger-accent: #7c3aed;
  --lil-debugger-tint: rgb(124 58 237 / 0.12);
  --lil-debugger-panel-bg: #1e1b2e;
  --lil-debugger-panel-fg: #fff;
}
```

## Frameworks

React:

```tsx
import { useEffect } from "react";
import { lilDebugger } from "@mrmartineau/lil-debugger";

export function LilDebugger() {
  useEffect(() => lilDebugger().destroy, []);
  return null;
}
```

The [docs](https://zander.wtf/lil-debugger) have examples for plain HTML, Astro, Vue, Svelte and Solid.

## Development

```sh
pnpm install
pnpm run build      # build the package
pnpm run test       # bun test, with happy-dom
pnpm run check      # format, lint and type check
```

Releases run from the **NPM Release** workflow and use [conventional commits](https://www.conventionalcommits.org/). See `AGENTS.md`.

## License

[ISC](https://choosealicense.com/licenses/isc/) © [Zander Martineau](https://zander.wtf)

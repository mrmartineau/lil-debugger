# lil-debugger — agent & contributor guide

Lil' Debugger: a tiny, framework-agnostic dev tool. Hold Ctrl+Shift to see the
`data-debug` value of any element. Published as `@mrmartineau/lil-debugger`
(ESM + CJS dual output via tsdown). The docs live on zander.wtf/lil-debugger,
not in this repo. `pnpm-workspace.yaml` holds the vite catalog and dependency
build allowlist — don't remove those.

## Commands

Run everything from the repo root. pnpm for installs, Bun as the test runner.

```sh
pnpm install              # install deps
pnpm run build            # build the package (tsdown → dist/)
pnpm run dev              # rebuild package on change
pnpm run test             # bun test (src/*.test.ts)
pnpm run check            # vp check --fix (format + lint + typecheck, whole repo)
```

Before committing: `pnpm run check && pnpm run build && pnpm run test`.

## The package (`src/`)

- Source in `src/index.ts`, tests co-located as `src/*.test.ts` (Bun test).
- Tests need a DOM: `bunfig.toml` preloads `src/test-setup.ts`, which
  registers happy-dom globals.
- The CSS lives in `styles()` in `src/index.ts` and is injected at runtime, so
  the package is one import. Keep the theming custom properties stable.
- `pnpm run build` emits ESM (`index.mjs`), CJS (`index.cjs`), and `.d.ts`
  types into `dist/`. Only `dist/` is published (`files` field).
- TypeScript config in `tsconfig.json`; lint/format/typecheck via Vite+
  (`vp check`), configured in root `vite.config.ts`.
- Releases prepend notes to `CHANGELOG.md` (via `@semantic-release/changelog`).

## CI & deployment (`.github/workflows/`)

- `build-test.yml` — every PR/push to main: `vp check`, package build, bun tests.
- `release.yml` — manual dispatch: semantic-release publishes the package to
  npm. Version comes from conventional commits (`fix:` patch, `feat:` minor,
  `feat!:`/`BREAKING CHANGE:` major). npm auth is trusted publishing (OIDC),
  so there is no `NPM_TOKEN` secret. The first version must be published by
  hand (`npm publish`), then link the repo with `npm trust github <name>
--repo <owner>/<repo> --file release.yml --allow-publish`.
- `security.yml` — Aikido safe-chain supply-chain scan on every branch.

CI installs with `--frozen-lockfile`: if you change any `package.json`, run
`pnpm install` and commit the updated `pnpm-lock.yaml`.

## Gotchas

- **Vite+ tooling**: `vp config` (root `prepare` script) sets
  `core.hooksPath` to `.vite-hooks/_`; the `pre-commit` hook runs `vp staged`,
  which runs `vp check --fix` on staged files (see `staged` in
  `vite.config.ts`). If hooks misbehave, `git config --unset core.hooksPath`
  and rerun `pnpm exec vp config`.
- **Changelog**: semantic-release prepends release notes to the root
  `CHANGELOG.md` — don't delete it.
- **semantic-release** commits the version bump back to `main` with
  `[skip ci]` — don't hand-edit `version` in root `package.json`.

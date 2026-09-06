# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0/).

## [22.0.2] - 2026-09-06

### Added

- **`FUNCTIONALITIES.md`**, the map every other library in the family has and this one did not: what
  the sheet actually supports, and which of it a live example demonstrates. A reader had no way of
  telling a feature that only exists in a code snippet from one they could go and try.

### Changed

- **The documentation states the configuration surface the package exports.** `public-api.ts`
  publishes `HUB_ACTION_SHEET_CONFIG` and `HUB_ACTION_SHEET_DEFAULTS`, and
  `HubActionSheetConfig` takes `variant` and `panelClass` as application-wide defaults, so an
  application can settle its accent and its sheet class once. None of it was written down: the
  only way to find out was to read the sources. The READMEs and the documentation page now carry
  the interface, the two exports and what providing the token directly does.
- **`HubActionSheetRef.settled` appears in the page's API tables.** It is public, the READMEs
  already documented it, and the page did not — the one place a reader looks first.
- **The page's changelog is the released one.** It stopped at `22.0.0`, dated before the
  published `22.0.1`, and its `22.0.0` entry left out `provideHubActionSheet()` and the CSS
  variable theming that the release notes list. A changelog that lags the registry teaches the
  reader not to trust it.
- **Both READMEs describe a library on the stable line**, not one in its early stages, and list
  the family that exists today: `ng-hub-ui-accordion` and `ng-hub-ui-dropdown` have no project in
  the repository, while badges, buttons, icons, loading, metrics, signature, toast and the
  umbrella installer do. The Spanish README also dropped its note announcing documentation pages
  that have been live for a week — the English one never had it, and two READMEs that disagree
  are worse than one that is merely terse.

### Fixed

- **`docs/css-variables-reference.md` gave `--hub-ref-space-1` a default the stylesheet does not
  use.** The table said `0.5rem`; both readings of the token — the grip's padding and the group
  title's — fall back to `0.25rem`. Somebody sizing their own scale from that table was working
  from a number twice the real one. The two design-system tokens the table omitted,
  `--hub-sys-color-surface-subtle` and `--hub-sys-color-ink`, are listed as well.
- **The hover background of an action falls back to the same value it is declared with.** The
  rule read `var(--hub-action-sheet-action-hover-bg, rgba(0, 0, 0, 0.05))`, a literal that can
  never be reached — the host always declares the token — and that contradicted both the
  declaration and the documented default. A reader copying the fallback out of the rule was
  copying a colour the component never paints; it now repeats `#f8f9fa`, as every other token
  read in the stylesheet does.
- **The action with the `selected` role no longer carries `aria-checked`.** That attribute is
  only defined for the checkbox, radio, switch, option, menuitemcheckbox, menuitemradio and
  treeitem roles; on a plain `<button>` assistive technology ignores it, so the state the README
  promises was only paint — visible to whoever could see the sheet and to nobody else. The action
  now announces itself with `aria-current="true"`, an attribute a button may carry and one that
  says what `selected` means here: the option currently in effect.

## [22.0.1] - 2026-09-01

### Changed

- **The `homepage` in the manifest points at this library's own documentation page** rather than at
  the site root. It is the link a registry shows beside the package and the one a reader clicks from
  it, and landing on a front page they then have to search is a worse answer than landing on the
  reference for the package they were already looking at. Metadata only — no code, no types, no
  styles change, and nothing a consumer imports is affected.

## [22.0.0] - 2026-08-30

The first release that actually is an action sheet. Everything before this shipped a
placeholder component; the version jumps to `22.0.0` because the major of every
`ng-hub-ui` library states the Angular major it targets, not the size of the change.

### Added

- **`HubActionSheet`** — the service that opens a sheet: `open(options)` returns a
  `HubActionSheetRef` whose `result` promise (and `closed$` observable) resolve once, with the
  role and data of the chosen action or with how the sheet was dismissed.
- **Actions with roles.** `cancel` is lifted out of the list and rendered apart at the end
  wherever it was declared; `destructive` reads in the danger colour; `selected` is marked; any
  other string travels through to the result untouched. A `handler` returning `false` — or a
  promise of it — keeps the sheet open, which is how a failed request refuses to close it.
- **Grouped actions**, with an optional title per block, alongside header and sub-header.
- **Dismissal by backdrop, by `Escape` and by dragging the sheet down**, each reporting its own
  role. All three run the cancel action's handler first, since a reader who taps outside meant
  to cancel, and a handler that refuses refuses here too.
- **Accessibility**: the sheet is a `role="dialog"` with `aria-modal`, named by its header or by
  `ariaLabel`; focus moves to the first action on open, is trapped inside while the sheet lives,
  and returns to the element that opened it on close.
- **`provideHubActionSheet()`** for application-wide defaults, overridable per call.
- **CSS variable theming** through the `--hub-action-sheet-*` tokens, with the semantic accent on
  the same single-slot contract the rest of the family uses (`variant`), and motion that steps
  aside under `prefers-reduced-motion`.

### Removed

- **The placeholder `ActionSheet` component** (selector `lib-action-sheet`), which rendered
  static markup and never had an API. See `BREAKING_CHANGES.md`.

## [0.0.2] - 2026-08-17

### Fixed

- **The package shipped without its licence notice.** `package.json` declared MIT, but no `LICENSE` file travelled in the tarball — and MIT itself requires the copyright notice to be included in distributions. The notice ships now.

## [0.0.1] - 2026-06-17

### Added

- Initial pre-release scaffold of the `ng-hub-ui-action-sheet` package.
- Placeholder `ActionSheet` standalone component (selector `lib-action-sheet`) exported
  from the public API to bootstrap the package.
- Package metadata: MIT license, description, keywords, and repository information.
- English (`README.md`) and Spanish (`README.es.md`) documentation describing the current
  pre-release state and the planned action sheet API.

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0/).

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

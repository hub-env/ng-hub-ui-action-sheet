# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0/).

## [22.2.2] - 2026-09-20

### Changed

- The npm keywords name what the package does — `sheet`, `dialog`, `menu`, `overlay`,
  `focus-trap`, `swipe-to-close`, `accessibility` — instead of stopping at the generic ones.
  Keywords are what npm ranks a search on, and the list only said `ui-components`. Metadata
  only: no code, types or styles change.

## [22.2.1] - 2026-09-16

### Changed

- The repository moved to the `hub-env` organization. Issues for every Hub UI package are now
  gathered in [hub-env/hub-ui](https://github.com/hub-env/hub-ui/issues), and the `repository`, `bugs`
  and README links point at the new addresses. GitHub redirects the old ones.

## [22.2.0] - 2026-09-08

### Deprecated

- **`HubActionSheetComponent` is announced for removal in 23.0.0.** The entry point exported it
  and the documentation said the library has no template API. The documentation was right: the
  class is exported by accident and cannot be used from a template. `sheetRef` demands a
  `HubActionSheetRef` whose closing half — `settle()` and `registerTeardown()` — is `@internal`
  and wired by `HubActionSheet.open()`, so a hand-mounted sheet resolves its promise and then
  stays on screen, behind a `position: fixed` backdrop that traps `Tab` across the whole
  document. Nothing is removed here and nothing changes at runtime; this release is the notice,
  and the removal lands in 23.0.0, the next version that tracks a new Angular major. Open sheets
  with `HubActionSheet.open()`, which is what every example already does. See
  `BREAKING_CHANGES.md`.

### Changed

- **`public-api.ts` lists the component by name instead of re-exporting its whole file.** The
  wildcard hid which symbols were leaving the package; the one on its way out is now named where
  it is exported, beside the reason. `HubResolvedActionSheetOptions` is unaffected and stays
  exported.

## [22.1.0] - 2026-09-07

### Fixed

- **A `:root` in the application now reaches the sheet.** The `--hub-action-sheet-*` defaults were
  declared in a `:root, :host` block. The emulated-encapsulation shim rewrites `:root` into a
  selector nothing matches, so what survived was the `:host` half — thirty-odd tokens declared
  straight on the `<hub-action-sheet>` element. A declaration on an element beats a value
  inherited from an ancestor whatever its specificity, so every `:root` an application wrote for
  this library was dead, `!important` included, and the documentation had been sending readers
  there all along. The block is gone: each token is read where it is painted, as
  `var(--hub-action-sheet-x, <default>)`, and the defaults carry the same chain as before —
  component token, then design-system token, then literal — so re-theming through the design
  system still moves the sheet with it. See `BREAKING_CHANGES.md`: a `:root` block that never did
  anything starts doing it.
- **A `panelClass` that re-bases the accent now recolours the selection.** `--hub-action-sheet-accent-subtle`
  was derived on the host, above the element `panelClass` lands on, so the derived value was
  already fixed to the sheet's own accent by the time a branded class changed it — the selected
  action stayed blue. The roles are derived where the colour is painted, so re-basing the accent
  from `:root`, from a `panelClass` rule or through `variant` all recompute the selection.

### Changed

- **`--hub-action-sheet-accent-emphasis` is declared on the sheet element** rather than on the
  host. Nothing in the component paints with it — it is the accent family's third role, there for
  a consumer dressing the sheet — and declaring it beside the accent means a `panelClass` that
  re-bases the slot recomputes it.
- **The two READMEs and `docs/css-variables-reference.md` say why both entry points work.**
  Setting a token on `:root` and setting it through `panelClass` were documented side by side
  without saying which wins when both are present, and one of the two did not work at all.

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

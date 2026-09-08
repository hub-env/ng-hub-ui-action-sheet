# Functionalities of Action Sheet Library

This table details the functionalities of the `ng-hub-ui-action-sheet` library and indicates which ones are covered by interactive examples.

The library has no template API: the sheet is opened from the `HubActionSheet` service, so the tables below list what `open()` accepts, what the returned handle offers, and what the configuration token sets for the whole application.

The entry point does export `HubActionSheetComponent`, which contradicted that sentence until 22.2.0. The sentence was the true half: mounted from a template the sheet cannot close itself, because the part of `HubActionSheetRef` that tears it down is `@internal` and wired by the service. The class is marked `@deprecated` and leaves in 23.0.0.

## Service (`HubActionSheet`)

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Opening** | `open<D>(options)` mounts a sheet and returns its handle | ✅ |
| | The sheet lives on `document.body`, outside the caller's view | ✅ |
| | Options merged over the application defaults, `undefined` keys ignored | ❌ |

## Handle (`HubActionSheetRef<D>`)

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Outcome** | `result` promise, resolved once | ✅ |
| | `closed$` observable, same value | ❌ |
| | `settled` — whether the sheet has already answered | ❌ |
| **Closing** | `dismiss(role?)` from outside the sheet | ❌ |
| | Idempotent settle: a second answer is ignored | ❌ |

## Options (`HubActionSheetOptions<D>`)

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Content** | `buttons` flat | ✅ |
| | `buttons` in titled groups (`HubActionSheetGroup`) | ✅ |
| | `header` | ✅ |
| | `subHeader` | ✅ |
| **Behaviour** | `backdropDismiss` (default `true`) | ✅ |
| | `backdropDismiss: false` | ❌ |
| | `keyboard` — `Escape` dismisses (default `true`) | ✅ |
| | `keyboard: false` | ❌ |
| | `swipeToClose` — drag the sheet down (default `true`) | ✅ |
| | `swipeToClose: false` | ❌ |
| | `animation` (default `true`) | ✅ |
| | `animation: false` | ❌ |
| **Presentation** | `variant` — semantic accent | ✅ |
| | `panelClass` | ✅ |
| | `ariaLabel` — accessible name without a header | ❌ |

## Actions (`HubActionSheetButton<D>`)

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Content** | `text` — visible label and accessible name | ✅ |
| | `icon` — icon class before the text, `aria-hidden` | ✅ |
| | `data` — payload returned in the result | ✅ |
| | `cssClass` — extra classes on the action | ❌ |
| **Roles** | `cancel` — lifted out and set apart at the end | ✅ |
| | `destructive` — reads in the danger colour | ✅ |
| | `selected` — marked, and announced with `aria-current` | ✅ |
| | Any other string, carried through to the result | ❌ |
| **State** | `disabled` — visible and inert, skipped by focus | ✅ |
| **Handlers** | `handler()` runs before the sheet closes | ✅ |
| | Returning `false` keeps the sheet open | ✅ |
| | Returning a `Promise<false>` keeps it open too | ❌ |
| | The cancel handler also runs on backdrop, `Escape` and swipe | ✅ |

## Dismissal

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Reasons** | `'backdrop'` reported in the result | ✅ |
| | `'escape'` reported in the result | ✅ |
| | `'swipe'` reported in the result | ✅ |
| **Swipe** | Drag threshold: 25% of the sheet's height, minimum 64px | ✅ |
| | Snap back below the threshold | ✅ |
| | Pointer capture so the drag survives leaving the grip | ✅ |

## Accessibility

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Dialog** | `role="dialog"` with `aria-modal="true"` | ✅ |
| | Named by `header` through `aria-labelledby` | ✅ |
| | Named by `ariaLabel` when there is no header | ❌ |
| **Focus** | Moves to the first enabled action on open | ✅ |
| | Trapped inside the sheet while it lives (`Tab` / `Shift+Tab`) | ✅ |
| | Returned to the element that opened the sheet on close | ✅ |
| **Motion** | Animations and the drag transition drop under `prefers-reduced-motion` | ❌ |

## Configuration

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Providers** | `provideHubActionSheet(config)` application-wide defaults | ❌ |
| | `HUB_ACTION_SHEET_CONFIG` token provided directly | ❌ |
| | `HUB_ACTION_SHEET_DEFAULTS` export | ❌ |
| **Scope** | `variant` and `panelClass` as application-wide defaults | ❌ |

## Styling

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Surface** | `--hub-action-sheet-z-index` | ❌ |
| | `--hub-action-sheet-backdrop-bg` | ❌ |
| | `--hub-action-sheet-bg` | ❌ |
| | `--hub-action-sheet-color` | ❌ |
| | `--hub-action-sheet-border-color` | ❌ |
| | `--hub-action-sheet-border-radius` | ✅ |
| | `--hub-action-sheet-shadow` | ❌ |
| | `--hub-action-sheet-max-width` | ✅ |
| | `--hub-action-sheet-padding` | ❌ |
| | `--hub-action-sheet-gap` | ❌ |
| | `--hub-action-sheet-inset` | ❌ |
| | `--hub-action-sheet-duration` | ❌ |
| **Heading** | `--hub-action-sheet-header-color` | ❌ |
| | `--hub-action-sheet-sub-header-color` | ❌ |
| | `--hub-action-sheet-group-title-color` | ❌ |
| **Actions** | `--hub-action-sheet-action-color` | ❌ |
| | `--hub-action-sheet-action-bg` | ❌ |
| | `--hub-action-sheet-action-hover-bg` | ❌ |
| | `--hub-action-sheet-action-min-height` | ✅ |
| | `--hub-action-sheet-action-padding-x` | ❌ |
| | `--hub-action-sheet-action-gap` | ❌ |
| | `--hub-action-sheet-action-font-size` | ❌ |
| | `--hub-action-sheet-action-radius` | ✅ |
| | `--hub-action-sheet-action-disabled-opacity` | ❌ |
| | `--hub-action-sheet-destructive-color` | ❌ |
| **Accent** | `--hub-action-sheet-accent` | ✅ |
| | `--hub-action-sheet-accent-emphasis` | ❌ |
| | `--hub-action-sheet-accent-subtle` | ✅ |
| | `--hub-action-sheet-selected-color` | ✅ |
| | `--hub-action-sheet-selected-bg` | ✅ |
| **Grip and focus** | `--hub-action-sheet-handle-width` | ❌ |
| | `--hub-action-sheet-handle-height` | ❌ |
| | `--hub-action-sheet-handle-color` | ❌ |
| | `--hub-action-sheet-focus-ring-width` | ❌ |
| | `--hub-action-sheet-focus-ring-color` | ❌ |
| **Variants** | `data-variant` accent map (primary · secondary · success · danger · warning · info · neutral · light · dark) | ✅ |
| | A variant outside that set, resolved as `--hub-sys-color-<variant>` | ❌ |
| **Structure** | BEM classes (`hub-action-sheet__sheet`, `__action`, `__group`…) | ❌ |
| **Scope** | Tokens set through `panelClass`, on the sheet itself | ✅ |
| | Tokens set application-wide on `:root` — the sheet declares none of its own | ❌ |

---

_Note: ✅ indicates an active interactive example is available in the documentation. ❌ indicates functionality exists but is only shown as a code snippet, or not shown at all._

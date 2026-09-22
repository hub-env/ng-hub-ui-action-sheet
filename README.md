# ng-hub-ui-action-sheet

[Español](./README.es.md) | **English**

[![NPM Version](https://img.shields.io/npm/v/ng-hub-ui-action-sheet.svg)](https://www.npmjs.com/package/ng-hub-ui-action-sheet)
[![License](https://img.shields.io/npm/l/ng-hub-ui-action-sheet.svg)](LICENSE)

> Accessible, mobile-first action sheets for Angular, part of the Hub UI ecosystem.

## Documentation and Live Examples

This package is part of [Hub UI](https://hubui.dev/en/), a collection of Angular component libraries for standalone apps.

- Docs: https://hubui.dev/en/action-sheet/overview/
- Live examples: https://hubui.dev/en/action-sheet/examples/
- Hub UI: https://hubui.dev/en/
- Hub UI on GitHub (issues, roadmap and contributing): https://github.com/hub-env/hub-ui

## 🧩 Library Family `ng-hub-ui`

This library is part of the **ng-hub-ui** ecosystem:

- [**ng-hub-ui**](https://www.npmjs.com/package/ng-hub-ui) (umbrella installer — `ng add ng-hub-ui`)
- [**ng-hub-ui-action-sheet**](https://www.npmjs.com/package/ng-hub-ui-action-sheet) ← You are here
- [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [**ng-hub-ui-badges**](https://www.npmjs.com/package/ng-hub-ui-badges)
- [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
- [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [**ng-hub-ui-buttons**](https://www.npmjs.com/package/ng-hub-ui-buttons)
- [**ng-hub-ui-calendar**](https://www.npmjs.com/package/ng-hub-ui-calendar)
- [**ng-hub-ui-ds**](https://www.npmjs.com/package/ng-hub-ui-ds)
- [**ng-hub-ui-forms**](https://www.npmjs.com/package/ng-hub-ui-forms)
- [**ng-hub-ui-history**](https://www.npmjs.com/package/ng-hub-ui-history)
- [**ng-hub-ui-icons**](https://www.npmjs.com/package/ng-hub-ui-icons)
- [**ng-hub-ui-loading**](https://www.npmjs.com/package/ng-hub-ui-loading)
- [**ng-hub-ui-metrics**](https://www.npmjs.com/package/ng-hub-ui-metrics)
- [**ng-hub-ui-milestones**](https://www.npmjs.com/package/ng-hub-ui-milestones)
- [**ng-hub-ui-modal**](https://www.npmjs.com/package/ng-hub-ui-modal)
- [**ng-hub-ui-nav**](https://www.npmjs.com/package/ng-hub-ui-nav)
- [**ng-hub-ui-paginable**](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [**ng-hub-ui-panels**](https://www.npmjs.com/package/ng-hub-ui-panels)
- [**ng-hub-ui-portal**](https://www.npmjs.com/package/ng-hub-ui-portal)
- [**ng-hub-ui-signature**](https://www.npmjs.com/package/ng-hub-ui-signature)
- [**ng-hub-ui-skeleton**](https://www.npmjs.com/package/ng-hub-ui-skeleton)
- [**ng-hub-ui-sortable**](https://www.npmjs.com/package/ng-hub-ui-sortable)
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [**ng-hub-ui-toast**](https://www.npmjs.com/package/ng-hub-ui-toast)
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

---

## 📦 Description

`ng-hub-ui-action-sheet` presents a short list of actions over the current screen — the sheet
that rises from the bottom edge when a row is held down or a "more" button is tapped. It is
opened from a service, so nothing sits in the page for a sheet that is closed, and the call
resolves with whatever the reader chose.

Standalone components, no NgModules, and no runtime dependency beyond Angular itself.

## ✨ Features

- **Actions with roles** — `cancel` is set apart at the end wherever it was declared,
  `destructive` reads in the danger colour, `selected` is marked, and any other string travels
  through to the result untouched.
- **Handlers that can refuse** — returning `false`, or a promise of it, keeps the sheet open.
- **Grouped actions** with an optional title per block, plus header and sub-header.
- **Three ways out** — the backdrop, `Escape` and dragging the sheet down, each reporting its own
  role, and each running the cancel action's handler first.
- **Accessible** — `role="dialog"` with `aria-modal`, named by its header; focus moves in on open,
  is trapped while the sheet lives, and returns to the element that opened it.
- **CSS variable theming** through `--hub-action-sheet-*`, with the semantic accent of the rest of
  the family, and motion that steps aside under `prefers-reduced-motion`.

## 🚀 Installation

```bash
npm install ng-hub-ui-action-sheet
```

## ⚙️ Usage

### Open a sheet

```typescript
import { Component, inject } from '@angular/core';
import { HubActionSheet } from 'ng-hub-ui-action-sheet';

@Component({
	selector: 'app-invoice-row',
	standalone: true,
	template: `<button type="button" (click)="openActions()">More</button>`
})
export class InvoiceRowComponent {
	readonly #sheet = inject(HubActionSheet);

	async openActions(): Promise<void> {
		const { role, data } = await this.#sheet.open<string>({
			header: 'Invoice 2026-0184',
			subHeader: 'Issued 12 August · 1.240,00 €',
			buttons: [
				{ text: 'Download PDF', icon: 'fa-solid fa-download', data: 'pdf' },
				{ text: 'Send by email', icon: 'fa-solid fa-envelope', data: 'email' },
				{ text: 'Delete', role: 'destructive', icon: 'fa-solid fa-trash' },
				{ text: 'Cancel', role: 'cancel' }
			]
		}).result;

		if (role === 'destructive') {
			this.delete();
		} else if (data === 'pdf') {
			this.download();
		}
	}
}
```

The promise resolves once, whatever happens: with the role and data of the chosen action, or with
`{ role: 'backdrop' | 'escape' | 'swipe' }` when the sheet was dismissed without choosing.

### A handler that refuses to close

```typescript
this.#sheet.open({
	buttons: [
		{
			text: 'Delete',
			role: 'destructive',
			// The sheet stays open while the request runs, and stays open if it fails.
			handler: async () => {
				const deleted = await this.api.delete(this.invoice.id);
				return deleted;
			}
		},
		{ text: 'Cancel', role: 'cancel' }
	]
});
```

### Grouped actions

```typescript
this.#sheet.open({
	header: 'Document',
	buttons: [
		{ title: 'Share', buttons: [{ text: 'Copy link' }, { text: 'Send by email' }] },
		{ title: 'Danger zone', buttons: [{ text: 'Delete', role: 'destructive' }] },
		{ text: 'Cancel', role: 'cancel' }
	]
});
```

### Application-wide defaults

```typescript
import { provideHubActionSheet } from 'ng-hub-ui-action-sheet';

export const appConfig: ApplicationConfig = {
	providers: [provideHubActionSheet({ swipeToClose: false, variant: 'brand', panelClass: 'app-sheet' })]
};
```

`provideHubActionSheet` takes a `Partial<HubActionSheetConfig>`: the four behaviour flags plus
`variant` and `panelClass`, so an application can settle its accent and its sheet class once
instead of repeating them at every call. Anything a single `open()` passes still wins, and the
keys it leaves `undefined` fall back to the configured defaults rather than overwriting them.

## 🪄 API Reference

### `HubActionSheet` (service, `providedIn: 'root'`)

| Method | Signature | Description |
| ------ | --------- | ----------- |
| `open` | `open<D>(options: HubActionSheetOptions<D>): HubActionSheetRef<D>` | Mounts a sheet on the document and returns the handle to its outcome. |

### `HubActionSheetRef<D>`

| Member | Type | Description |
| ------ | ---- | ----------- |
| `result` | `Promise<HubActionSheetResult<D>>` | Resolves once, with the chosen action or the dismissal. |
| `closed$` | `Observable<HubActionSheetResult<D>>` | The same value, for callers living in streams. |
| `dismiss` | `(role?) => void` | Closes the sheet from the outside — a route change, a message that makes the actions meaningless. |
| `settled` | `boolean` | Whether the sheet has already produced its result. |

### `HubActionSheetOptions<D>`

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `buttons` | `(HubActionSheetButton<D> \| HubActionSheetGroup<D>)[]` | — | The actions, flat or in titled groups. |
| `header` | `string` | `undefined` | Title of the sheet, and its accessible name. |
| `subHeader` | `string` | `undefined` | Secondary line under the header. |
| `variant` | `string` | `undefined` | Semantic accent, read as `--hub-sys-color-<variant>`. |
| `backdropDismiss` | `boolean` | `true` | Clicking the backdrop dismisses the sheet. |
| `keyboard` | `boolean` | `true` | `Escape` dismisses the sheet. |
| `swipeToClose` | `boolean` | `true` | Dragging the sheet down past its threshold dismisses it. |
| `animation` | `boolean` | `true` | Animate entry and exit. Ignored under `prefers-reduced-motion`. |
| `panelClass` | `string \| string[]` | `undefined` | Extra classes on the sheet element. |
| `ariaLabel` | `string` | `undefined` | Accessible name when there is no header to give one. |

### `HubActionSheetButton<D>`

| Property | Type | Description |
| -------- | ---- | ----------- |
| `text` | `string` | Visible text, and the accessible name. |
| `role` | `'cancel' \| 'destructive' \| 'selected' \| string` | Decides where it sits and how it reads. |
| `icon` | `string` | Icon class rendered before the text. |
| `disabled` | `boolean` | Renders the action inert. |
| `data` | `D` | Payload handed back in the result. |
| `cssClass` | `string \| string[]` | Extra classes on the action. |
| `handler` | `() => boolean \| void \| Promise<boolean \| void>` | Runs when chosen; returning `false` keeps the sheet open. |

### `HubActionSheetGroup<D>`

| Property | Type | Description |
| -------- | ---- | ----------- |
| `title` | `string` | Optional heading above the block. |
| `buttons` | `HubActionSheetButton<D>[]` | The actions in the block. |

### `HubActionSheetConfig`

The defaults every sheet starts from. `HubActionSheetOptions` overrides them per call.

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `backdropDismiss` | `boolean` | `true` | Clicking the backdrop dismisses the sheet. |
| `keyboard` | `boolean` | `true` | `Escape` dismisses the sheet. |
| `swipeToClose` | `boolean` | `true` | Dragging the sheet down past its threshold dismisses it. |
| `animation` | `boolean` | `true` | Animate entry and exit. Ignored under `prefers-reduced-motion`. |
| `variant` | `string` | `undefined` | Semantic accent every sheet starts with. |
| `panelClass` | `string \| string[]` | `undefined` | Classes every sheet carries. |

### Configuration

| Export | Type | Description |
| ------ | ---- | ----------- |
| `provideHubActionSheet` | `(config: Partial<HubActionSheetConfig>) => EnvironmentProviders` | Sets the application-wide defaults; merged over `HUB_ACTION_SHEET_DEFAULTS`. |
| `HUB_ACTION_SHEET_CONFIG` | `InjectionToken<HubActionSheetConfig>` | The token the service reads. Provide it directly to replace the whole configuration rather than merge into it. |
| `HUB_ACTION_SHEET_DEFAULTS` | `HubActionSheetConfig` | What a sheet does when nobody says otherwise: the four flags above, all `true`. |

### Result and roles

`result` resolves with `{ role?, data? }`. `role` is the chosen action's role, or `'backdrop'`,
`'escape'` or `'swipe'` when the sheet was dismissed. A `cancel` action's handler runs on all
three dismissals, and can refuse them by returning `false`.


### `HubActionSheetComponent` — deprecated, removed in 23.0.0

The entry point still exports the sheet component, and it should not: there is no template API,
and there never was one that worked. `sheetRef` demands a `HubActionSheetRef` whose closing half
is `@internal` and wired by the service, so a sheet placed in a template resolves its promise and
then stays on screen, behind a `position: fixed` backdrop that traps `Tab` across the whole
document. It is marked `@deprecated` and leaves in 23.0.0; open sheets with
`HubActionSheet.open()`. See `BREAKING_CHANGES.md`.

## 🎨 Styling

Every visual decision is a CSS variable. Set them on the sheet — `panelClass` gives it a class —
or globally on `:root`.

Both reach it. The component declares no default of its own on the sheet element; it reads each
token with its default inline, so an application's `:root` is inherited rather than overruled,
and a `panelClass` rule — closer to the sheet — wins over that in turn.

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `--hub-action-sheet-bg` | `var(--hub-sys-surface-page, #fff)` | Sheet background |
| `--hub-action-sheet-color` | `var(--hub-sys-text-primary, #212529)` | Sheet text colour |
| `--hub-action-sheet-backdrop-bg` | `rgba(0, 0, 0, 0.45)` | Backdrop |
| `--hub-action-sheet-border-radius` | `var(--hub-ref-radius-lg, 0.5rem)` | Corner radius |
| `--hub-action-sheet-max-width` | `34rem` | Width cap on wide screens |
| `--hub-action-sheet-action-min-height` | `3rem` | Touch target of each action |
| `--hub-action-sheet-destructive-color` | `var(--hub-sys-color-danger, #dc3545)` | Colour of the destructive action |
| `--hub-action-sheet-accent` | `var(--hub-sys-color-primary, #0d6efd)` | Semantic accent, re-based by `variant` |
| `--hub-action-sheet-handle-color` | `var(--hub-sys-border-color-default, #dee2e6)` | Drag handle |
| `--hub-action-sheet-duration` | `240ms` | Entry, exit and snap-back |

The full list lives in [`docs/css-variables-reference.md`](docs/css-variables-reference.md).

```scss
.branded-sheet {
	--hub-action-sheet-border-radius: 1.25rem;
	--hub-action-sheet-accent: #7c3aed;
	--hub-action-sheet-action-min-height: 3.5rem;
}
```

## 🤝 Contribution

Contributions are welcome — bug reports, examples and documentation as much as code.

```bash
# Clone the repository
git clone https://github.com/hub-env/ng-hub-ui-action-sheet.git

# Install dependencies
npm install

# Build the library
ng build action-sheet

# Run unit tests
ng test action-sheet
```

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Add tests** for your changes
4. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
5. **Push** to your branch: `git push origin feature/amazing-feature`
6. **Open** a pull request

## ☕ Support

Do you like this library? You can support its development by buying a coffee ☕:
[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/carlosmorcillo)

- [Report a bug](https://github.com/hub-env/hub-ui/issues)
- [Request a feature](https://github.com/hub-env/hub-ui/issues/new)

## 💼 Commercial support

These libraries are maintained by [Carlos Morcillo Fernández](https://www.carlosmorcillo.com), a freelance frontend architect working with teams that build and maintain Angular applications.

If your team depends on Hub-UI and needs more than an issue thread can solve, that is my day job: architecture audits, design systems, Angular migrations and team mentoring. For projects that also need design and a full team, I run them through [Frog Hub](https://froghub.es), my development studio.

Have a look at [the services](https://www.carlosmorcillo.com/en/services/) or [tell me about your project](https://www.carlosmorcillo.com/en/contact/).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

MIT © ng-hub-ui contributors

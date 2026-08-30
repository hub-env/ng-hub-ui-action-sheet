# ng-hub-ui-action-sheet - CSS Variables Reference

Complete reference of all CSS custom properties exposed by `ng-hub-ui-action-sheet`.
Use these variables to customize visual behavior without editing component source code.

---

## Table of Contents

- [How it Works](#how-it-works)
- [Base System Fallbacks](#base-system-fallbacks)
- [Action Sheet Variables](#action-sheet-variables)
- [Customization Examples](#customization-examples)
- [Best Practices](#best-practices)

---

## How it Works

The action sheet uses a token fallback chain:

```text
component token -> sys token -> ref token -> literal fallback
```

Every value is read from a `--hub-action-sheet-*` variable, which itself defaults to a
design-system token. Setting the design-system token restyles the sheet along with the rest
of the application; setting the component token restyles only the sheet.

The sheet is mounted on `document.body`, outside the component that opened it, so a token set
on that component does not reach it. Set them on `:root`, or hand the sheet a class through
`panelClass` and target that.

---

## Base System Fallbacks

Design-system tokens the sheet reads when no component token is set.

| Variable | Default |
|---|---|
| `--hub-ref-space-1` | `0.5rem` |
| `--hub-ref-space-2` | `0.5rem` |
| `--hub-ref-space-3` | `1rem` |
| `--hub-ref-radius-md` | `0.375rem` |
| `--hub-ref-radius-lg` | `0.5rem` |
| `--hub-sys-surface-page` | `#fff` |
| `--hub-sys-text-primary` | `#212529` |
| `--hub-sys-text-muted` | `#6c757d` |
| `--hub-sys-border-color-default` | `#dee2e6` |
| `--hub-sys-color-danger` | `#dc3545` |
| `--hub-sys-color-primary` | `#0d6efd` |
| `--hub-sys-focus-ring-width` | `0.25rem` |
| `--hub-sys-focus-ring-color` | `rgba(13, 110, 253, 0.25)` |

---

## Action Sheet Variables

Defined and consumed by `projects/action-sheet/src/lib/components/action-sheet/action-sheet.component.scss`.

### Surface

| Variable | Default |
|---|---|
| `--hub-action-sheet-z-index` | `1055` |
| `--hub-action-sheet-backdrop-bg` | `rgba(0, 0, 0, 0.45)` |
| `--hub-action-sheet-bg` | `var(--hub-sys-surface-page, #fff)` |
| `--hub-action-sheet-color` | `var(--hub-sys-text-primary, #212529)` |
| `--hub-action-sheet-border-color` | `var(--hub-sys-border-color-default, #dee2e6)` |
| `--hub-action-sheet-border-radius` | `var(--hub-ref-radius-lg, 0.5rem)` |
| `--hub-action-sheet-shadow` | `0 -0.5rem 1.5rem rgba(0, 0, 0, 0.18)` |
| `--hub-action-sheet-max-width` | `34rem` |
| `--hub-action-sheet-padding` | `var(--hub-ref-space-2, 0.5rem)` |
| `--hub-action-sheet-gap` | `var(--hub-ref-space-2, 0.5rem)` |
| `--hub-action-sheet-inset` | `var(--hub-ref-space-2, 0.5rem)` |
| `--hub-action-sheet-duration` | `240ms` |

### Heading

| Variable | Default |
|---|---|
| `--hub-action-sheet-header-color` | `var(--hub-sys-text-primary, #212529)` |
| `--hub-action-sheet-sub-header-color` | `var(--hub-sys-text-muted, #6c757d)` |
| `--hub-action-sheet-group-title-color` | `var(--hub-sys-text-muted, #6c757d)` |

### Actions

| Variable | Default |
|---|---|
| `--hub-action-sheet-action-color` | `var(--hub-sys-text-primary, #212529)` |
| `--hub-action-sheet-action-bg` | `transparent` |
| `--hub-action-sheet-action-hover-bg` | `var(--hub-sys-color-surface-subtle, #f8f9fa)` |
| `--hub-action-sheet-action-min-height` | `3rem` |
| `--hub-action-sheet-action-padding-x` | `var(--hub-ref-space-3, 1rem)` |
| `--hub-action-sheet-action-gap` | `var(--hub-ref-space-2, 0.5rem)` |
| `--hub-action-sheet-action-font-size` | `1rem` |
| `--hub-action-sheet-action-radius` | `var(--hub-ref-radius-md, 0.375rem)` |
| `--hub-action-sheet-action-disabled-opacity` | `0.5` |
| `--hub-action-sheet-destructive-color` | `var(--hub-sys-color-danger, #dc3545)` |

### Accent and selection

| Variable | Default |
|---|---|
| `--hub-action-sheet-accent` | `var(--hub-sys-color-primary, #0d6efd)` |
| `--hub-action-sheet-accent-emphasis` | `color-mix(in oklch, var(--hub-action-sheet-accent) 80%, var(--hub-sys-color-ink, #212529))` |
| `--hub-action-sheet-accent-subtle` | `color-mix(in oklch, var(--hub-action-sheet-accent) 12%, var(--hub-action-sheet-bg))` |
| `--hub-action-sheet-selected-color` | `var(--hub-action-sheet-accent)` |
| `--hub-action-sheet-selected-bg` | `var(--hub-action-sheet-accent-subtle)` |

> `--hub-action-sheet-accent` is the single accent slot. Passing `variant` on `open()` re-bases it
> to the matching design-system family; the roles above re-derive from whatever it holds.

### Grip and focus

| Variable | Default |
|---|---|
| `--hub-action-sheet-handle-width` | `2.25rem` |
| `--hub-action-sheet-handle-height` | `0.25rem` |
| `--hub-action-sheet-handle-color` | `var(--hub-sys-border-color-default, #dee2e6)` |
| `--hub-action-sheet-focus-ring-width` | `var(--hub-sys-focus-ring-width, 0.25rem)` |
| `--hub-action-sheet-focus-ring-color` | `var(--hub-sys-focus-ring-color, rgba(13, 110, 253, 0.25))` |

---

## Customization Examples

### A branded sheet

```scss
:root {
	--hub-action-sheet-border-radius: 1.25rem;
	--hub-action-sheet-accent: #7c3aed;
	--hub-action-sheet-action-min-height: 3.5rem;
	--hub-action-sheet-duration: 180ms;
}
```

### One sheet only

```typescript
this.sheet.open({ panelClass: 'compact-sheet', buttons: [...] });
```

```scss
.compact-sheet {
	--hub-action-sheet-action-min-height: 2.5rem;
	--hub-action-sheet-action-font-size: 0.9375rem;
	--hub-action-sheet-max-width: 24rem;
}
```

---

## Best Practices

1. Prefer the design-system tokens when the change belongs to the whole application; reach for
   the component tokens when it belongs to the sheet.
2. Keep `--hub-action-sheet-action-min-height` at or above `3rem`: it is the touch target, and
   the sheet exists for touch.
3. Do not remove the focus ring. Re-tint it through `--hub-action-sheet-focus-ring-color`.
4. `--hub-action-sheet-duration` drives entry, exit and the snap back from a drag. A reader who
   asks for reduced motion gets none of them regardless.

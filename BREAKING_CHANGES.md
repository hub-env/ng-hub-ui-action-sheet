# Breaking Changes

## [22.1.0] - 2026-09-07

### The sheet no longer declares its token defaults on its own element

- **Change**: the `--hub-action-sheet-*` defaults used to be declared in a `:root, :host` block
  in the component stylesheet. Under emulated encapsulation the `:root` half is rewritten into a
  selector that matches nothing, and the `:host` half declares all thirty-odd tokens directly on
  the `<hub-action-sheet>` element. The block is gone: each token is now read where it is painted,
  as `var(--hub-action-sheet-x, <default>)`, and the defaults keep the same chain — component
  token, then design-system token, then literal.
- **Impact**: a `:root` rule the application already had now takes effect. That is the fix — the
  documentation has always sent readers to `:root`, because the sheet is mounted on
  `document.body` and nothing scoped to the opening component reaches it — but the visible result
  is that a block which had been silently inert starts painting. Check any `:root` you wrote for
  this library and never saw applied; it applies now. Two smaller consequences: reading a token
  off the host element (`getComputedStyle(sheet).getPropertyValue('--hub-action-sheet-bg')`)
  returns an empty string, since nothing is declared there any more; and the derived accent roles
  are computed where the colour is painted rather than on the host, so a `panelClass` rule that
  re-bases `--hub-action-sheet-accent` now recolours the selected action too, which it did not
  before.
- **Migration**: none for a sheet themed through `panelClass` or through the design-system
  tokens — both behave exactly as before. If a `:root` block for this library was written and
  then abandoned as ineffective, delete it or make it say what you mean.

## [22.0.0] - 2026-08-30

### The placeholder component is gone

- **Change**: `ActionSheet` (selector `lib-action-sheet`) has been removed from the public API.
  It was the scaffold that bootstrapped the package: it rendered the static text
  `action-sheet works!` and had no inputs, outputs or behaviour.
- **Impact**: an import of `ActionSheet` from `ng-hub-ui-action-sheet` no longer compiles. In
  practice this reaches nobody: the package had never been published to npm, so the only way to
  hold the placeholder was to build it from this repository. `22.0.0` is the first release that
  exists on the registry.
- **Migration**: open a sheet through the service instead.

    ```ts
    import { HubActionSheet } from 'ng-hub-ui-action-sheet';

    const sheet = inject(HubActionSheet);

    const { role } = await sheet.open({
    	header: 'Invoice 2026-0184',
    	buttons: [
    		{ text: 'Download PDF' },
    		{ text: 'Delete', role: 'destructive' },
    		{ text: 'Cancel', role: 'cancel' }
    	]
    }).result;
    ```

### The version scheme changed

- **Change**: the package moves from `0.0.2` to `22.0.0`.
- **Impact**: none at runtime. The major of every `ng-hub-ui` library states the Angular major it
  targets, so a package that has left pre-release joins the line the rest of the family is on.
- **Migration**: none, beyond the version range in your `package.json`.

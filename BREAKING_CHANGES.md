# Breaking Changes

## [22.2.0] - 2026-09-08

### Announced: `HubActionSheetComponent` is removed in 23.0.0

- **Change**: the class is now marked `@deprecated`. Nothing is removed here and nothing changes
  at runtime — this release is the notice, and the removal lands in 23.0.0, the next version that
  tracks a new Angular major.
- **Impact**: from 23.0.0 the symbol is gone from the entry point, so
  `import { HubActionSheetComponent }` stops compiling. In practice this reaches an application
  that only ever holds the type, because the component was never usable as a template component:
  `sheetRef` requires a `HubActionSheetRef`, and the half of that handle which actually closes the
  sheet — `settle()` and `registerTeardown()` — is `@internal` and wired by the service. Mounted by
  hand, the sheet resolves its promise and then stays on screen, behind a `position: fixed`
  backdrop that traps `Tab` across the whole document. That is why the documentation has always
  said the library has no template API, and why the export was the thing that was wrong.
- **Migration**: open the sheet through the service, which is what every example already does.

    ```ts
    // Before — does not close, and there is no supported way to make it
    // <hub-action-sheet [options]="options" [sheetRef]="ref" />

    // After
    const sheet = inject(HubActionSheet);
    const { role } = await sheet.open({
    	header: 'Invoice 2026-0184',
    	buttons: [{ text: 'Download PDF' }, { text: 'Cancel', role: 'cancel' }]
    }).result;
    ```

    `HubResolvedActionSheetOptions` is not affected: it stays exported.

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

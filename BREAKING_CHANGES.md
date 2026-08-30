# Breaking Changes

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

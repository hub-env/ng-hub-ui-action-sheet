/*
 * Public API Surface of ng-hub-ui-action-sheet
 */
export * from './lib/action-sheet-ref';
export * from './lib/action-sheet.config';
export * from './lib/models/action-sheet.types';
export * from './lib/services/action-sheet.service';

// Named rather than `export *`, so the one symbol that is leaving is named in the file that
// exports it. `HubActionSheetComponent` is deprecated and goes in 23.0.0 — see its JSDoc and
// BREAKING_CHANGES.md; `HubResolvedActionSheetOptions` stays, and will move to its own file
// with the component's removal.
export { HubActionSheetComponent } from './lib/components/action-sheet/action-sheet.component';
export type { HubResolvedActionSheetOptions } from './lib/components/action-sheet/action-sheet.component';

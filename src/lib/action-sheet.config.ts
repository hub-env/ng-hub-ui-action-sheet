import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { HubActionSheetConfig } from './models/action-sheet.types';

/** What a sheet does when the caller says nothing. */
export const HUB_ACTION_SHEET_DEFAULTS: HubActionSheetConfig = {
	backdropDismiss: true,
	keyboard: true,
	swipeToClose: true,
	animation: true
};

/**
 * Application-wide defaults for every sheet. Register through
 * {@link provideHubActionSheet}; a single `open()` call still overrides them.
 */
export const HUB_ACTION_SHEET_CONFIG = new InjectionToken<HubActionSheetConfig>('HUB_ACTION_SHEET_CONFIG', {
	providedIn: 'root',
	factory: () => HUB_ACTION_SHEET_DEFAULTS
});

/**
 * Sets the defaults every sheet starts from.
 *
 * ```ts
 * providers: [provideHubActionSheet({ swipeToClose: false })];
 * ```
 */
export function provideHubActionSheet(config: Partial<HubActionSheetConfig>): EnvironmentProviders {
	return makeEnvironmentProviders([
		{
			provide: HUB_ACTION_SHEET_CONFIG,
			useValue: { ...HUB_ACTION_SHEET_DEFAULTS, ...config }
		}
	]);
}

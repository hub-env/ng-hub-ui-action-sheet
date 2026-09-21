import { ApplicationRef, createComponent, inject, Injectable } from '@angular/core';
import { HubActionSheetRef } from '../action-sheet-ref';
import { HUB_ACTION_SHEET_CONFIG } from '../action-sheet.config';
import { HubActionSheetComponent, HubResolvedActionSheetOptions } from '../components/action-sheet/action-sheet.component';
import { HubActionSheetOptions } from '../models/action-sheet.types';

/**
 * Opens action sheets.
 *
 * ```ts
 * const sheet = inject(HubActionSheet);
 *
 * const { role } = await sheet.open({
 * 	header: 'Invoice 2026-0184',
 * 	buttons: [
 * 		{ text: 'Download PDF', icon: 'fa-solid fa-download' },
 * 		{ text: 'Delete', role: 'destructive', handler: () => this.confirmDelete() },
 * 		{ text: 'Cancel', role: 'cancel' }
 * 	]
 * }).result;
 * ```
 */
@Injectable({ providedIn: 'root' })
export class HubActionSheet {
	readonly #appRef = inject(ApplicationRef);
	readonly #config = inject(HUB_ACTION_SHEET_CONFIG);

	/**
	 * Mounts a sheet on the document and returns the handle to its outcome.
	 *
	 * @param options Sheet content and behaviour; anything omitted falls back to
	 *                the application defaults set by `provideHubActionSheet`.
	 */
	open<D = unknown>(options: HubActionSheetOptions<D>): HubActionSheetRef<D> {
		const resolved = { ...this.#config, ...definedOnly(options) } as HubResolvedActionSheetOptions<D>;
		const ref = new HubActionSheetRef<D>();

		// Captured before the sheet steals focus, so it can be handed back to
		// whatever the reader was on when the sheet closes.
		const previouslyFocused = document.activeElement as HTMLElement | null;

		const componentRef = createComponent(HubActionSheetComponent<D>, {
			environmentInjector: this.#appRef.injector
		});
		componentRef.setInput('options', resolved);
		componentRef.setInput('sheetRef', ref);

		this.#appRef.attachView(componentRef.hostView);
		document.body.appendChild(componentRef.location.nativeElement);
		// A view created this way is outside the tree Angular walks when a signal
		// changes, so its first render has to be asked for explicitly.
		componentRef.changeDetectorRef.detectChanges();

		ref.registerTeardown(() => {
			// The result is already resolved by the time this runs, so waiting for the
			// closing animation delays nothing the caller is watching.
			componentRef.instance.playExit(() => {
				this.#appRef.detachView(componentRef.hostView);
				componentRef.destroy();
				previouslyFocused?.focus?.();
			});
		});

		return ref;
	}
}

/**
 * Drops the keys the caller left undefined, so `open({})` inherits the configured
 * defaults instead of overwriting them with `undefined`.
 */
function definedOnly<T extends object>(value: T): Partial<T> {
	return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as Partial<T>;
}

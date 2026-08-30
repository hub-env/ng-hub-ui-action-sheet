import { Observable, Subject } from 'rxjs';
import { HubActionSheetResult } from './models/action-sheet.types';

/**
 * Handle to an open sheet, returned by `HubActionSheet.open()`.
 *
 * The sheet closes itself when an action is chosen, so most callers only read
 * {@link result}. `dismiss()` is there for the cases the sheet cannot know about —
 * a route change, a socket message that makes the actions meaningless.
 */
export class HubActionSheetRef<D = unknown> {
	/** Resolves once, with the chosen action's role and data, or with how it was dismissed. */
	readonly result: Promise<HubActionSheetResult<D>>;

	/** Emits the same value as {@link result}, for callers living in streams. */
	readonly closed$: Observable<HubActionSheetResult<D>>;

	readonly #closed = new Subject<HubActionSheetResult<D>>();

	/** Set by the service; tears the overlay down. */
	#teardown: (() => void) | null = null;

	#settled = false;

	constructor() {
		this.closed$ = this.#closed.asObservable();
		this.result = new Promise<HubActionSheetResult<D>>((resolve) => {
			this.#closed.subscribe((value) => resolve(value));
		});
	}

	/** Closes the sheet from the outside, reporting `role`. */
	dismiss(role: HubActionSheetResult<D>['role'] = 'backdrop'): void {
		this.settle({ role });
	}

	/**
	 * Resolves the handle and tears the overlay down. Idempotent: a sheet that has
	 * already answered ignores further attempts, so a backdrop click landing while
	 * an async handler resolves cannot produce a second result.
	 *
	 * @internal
	 */
	settle(value: HubActionSheetResult<D>): void {
		if (this.#settled) {
			return;
		}
		this.#settled = true;
		this.#teardown?.();
		this.#teardown = null;
		this.#closed.next(value);
		this.#closed.complete();
	}

	/** @internal */
	registerTeardown(teardown: () => void): void {
		this.#teardown = teardown;
	}

	/** Whether the sheet has already produced its result. */
	get settled(): boolean {
		return this.#settled;
	}
}

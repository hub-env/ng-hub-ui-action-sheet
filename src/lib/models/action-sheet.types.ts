/**
 * Semantic role of an action, which decides where it sits and how it reads.
 *
 * `cancel` is the escape hatch: it is pulled out of the list, rendered apart at the
 * end, and is the action a dismissal by backdrop, `Escape` or swipe reports.
 * `destructive` marks the action that cannot be undone. Any other string is
 * carried through untouched, so a caller can identify its own action in the result.
 */
export type HubActionSheetRole = 'cancel' | 'destructive' | 'selected' | (string & {});

/** One action of the sheet. */
export interface HubActionSheetButton<D = unknown> {
	/** Visible text. It is the accessible name too. */
	text: string;
	/** Semantic role; see {@link HubActionSheetRole}. */
	role?: HubActionSheetRole;
	/** Icon class rendered before the text (e.g. `'fa-solid fa-trash'`). */
	icon?: string;
	/** Renders the action inert. */
	disabled?: boolean;
	/** Payload handed back in the result when this action is chosen. */
	data?: D;
	/** Extra classes on the action element. */
	cssClass?: string | string[];
	/**
	 * Runs when the action is chosen. Returning `false` — or a promise of it —
	 * keeps the sheet open, which is how a confirmation step or a failed request
	 * refuses to close it.
	 */
	handler?: () => boolean | void | Promise<boolean | void>;
}

/** A titled block of actions. */
export interface HubActionSheetGroup<D = unknown> {
	/** Optional heading above the block. */
	title?: string;
	buttons: HubActionSheetButton<D>[];
}

/** Everything the sheet can be opened with. */
export interface HubActionSheetOptions<D = unknown> {
	/** Title of the sheet, announced as its accessible name. */
	header?: string;
	/** Secondary line under the header. */
	subHeader?: string;
	/**
	 * Actions, flat or in titled groups. A `cancel` role is lifted out of its
	 * group and rendered apart at the end, however it is declared.
	 */
	buttons: (HubActionSheetButton<D> | HubActionSheetGroup<D>)[];
	/** Semantic accent, read as `--hub-sys-color-<variant>`. */
	variant?: string;
	/** Clicking the backdrop dismisses the sheet. */
	backdropDismiss?: boolean;
	/** `Escape` dismisses the sheet. */
	keyboard?: boolean;
	/** Dragging the sheet down past its threshold dismisses it. */
	swipeToClose?: boolean;
	/** Animate entry and exit. Ignored when the reader asks for reduced motion. */
	animation?: boolean;
	/** Extra classes on the sheet element. */
	panelClass?: string | string[];
	/** Accessible name when there is no `header` to name the sheet. */
	ariaLabel?: string;
}

/** How the sheet was closed. */
export interface HubActionSheetResult<D = unknown> {
	/** Role of the chosen action, or how it was dismissed. */
	role?: HubActionSheetRole | HubActionSheetDismissReason;
	/** `data` of the chosen action. */
	data?: D;
}

/** Ways of closing the sheet without choosing an action. */
export type HubActionSheetDismissReason = 'backdrop' | 'escape' | 'swipe';

/**
 * Application-wide defaults, resolved (no optional members) so the service reads a
 * value without re-implementing the fallback chain at each call site.
 */
export interface HubActionSheetConfig {
	backdropDismiss: boolean;
	keyboard: boolean;
	swipeToClose: boolean;
	animation: boolean;
	variant?: string;
	panelClass?: string | string[];
}

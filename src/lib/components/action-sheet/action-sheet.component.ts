import { NgTemplateOutlet } from '@angular/common';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	computed,
	ElementRef,
	inject,
	input,
	signal
} from '@angular/core';
import { HubActionSheetRef } from '../../action-sheet-ref';
import {
	HubActionSheetButton,
	HubActionSheetConfig,
	HubActionSheetDismissReason,
	HubActionSheetGroup,
	HubActionSheetOptions
} from '../../models/action-sheet.types';

/** Options once the caller's and the application's defaults have been merged. */
export type HubResolvedActionSheetOptions<D = unknown> = HubActionSheetOptions<D> & HubActionSheetConfig;

/** Smallest drag, in pixels, that can dismiss a sheet however short it is. */
const MIN_DRAG_THRESHOLD = 64;

/** Share of the sheet's height that must be dragged away to dismiss it. */
const DRAG_THRESHOLD_RATIO = 0.25;

/** Movement, in pixels, before a press becomes a drag rather than a click. */
const DRAG_SLOP = 4;

let nextId = 0;

/**
 * The sheet itself. It is never placed in a template: `HubActionSheet` creates it,
 * mounts it on the document and hands it the options and the handle to settle.
 *
 * @deprecated Open a sheet with `HubActionSheet.open()`. This class is exported by accident
 * and cannot be used from a template: `sheetRef` demands a `HubActionSheetRef` whose closing
 * half — `settle()` and `registerTeardown()` — is `@internal` and wired by the service, so a
 * hand-mounted sheet resolves its promise and then stays on screen, behind a backdrop that
 * traps `Tab` across the whole document. Scheduled for removal in **23.0.0**.
 */
@Component({
	selector: 'hub-action-sheet',
	imports: [NgTemplateOutlet],
	templateUrl: './action-sheet.component.html',
	styleUrl: './action-sheet.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'hub-action-sheet',
		'[class.hub-action-sheet--animated]': 'options().animation',
		'[class.hub-action-sheet--dragging]': 'dragging()',
		'[attr.data-variant]': 'options().variant ?? null',
		'[style.--hub-action-sheet-accent]': 'customAccent()',
		'(document:keydown.escape)': 'onEscape()',
		'(document:keydown.tab)': 'onTab($event)',
		'(document:keydown.shift.tab)': 'onTab($event)'
	}
})
export class HubActionSheetComponent<D = unknown> implements AfterViewInit {
	readonly options = input.required<HubResolvedActionSheetOptions<D>>();
	readonly sheetRef = input.required<HubActionSheetRef<D>>();

	/** Ties the dialog to its visible title. */
	protected readonly headerId = `hub-action-sheet-header-${++nextId}`;

	/** How far the sheet has been dragged down, in pixels. */
	protected readonly dragOffset = signal(0);
	protected readonly dragging = signal(false);

	readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
	readonly #cdr = inject(ChangeDetectorRef);

	#dragStartY = 0;
	#dragThreshold = MIN_DRAG_THRESHOLD;

	/**
	 * Focus moves in as soon as the sheet has a DOM, not on the next render pass:
	 * the service mounts this view by hand, so the render hooks it would otherwise
	 * wait for are not guaranteed to come.
	 */
	ngAfterViewInit(): void {
		this.focusFirstAction();
	}

	/**
	 * Actions in blocks, with the cancel action pulled out. Loose buttons collapse
	 * into one untitled block so a flat list reads as a flat list.
	 */
	protected readonly groups = computed<HubActionSheetGroup<D>[]>(() => {
		const cancel = this.cancelButton();
		const groups: HubActionSheetGroup<D>[] = [];
		let loose: HubActionSheetButton<D>[] = [];

		const flush = () => {
			if (loose.length) {
				groups.push({ buttons: loose });
				loose = [];
			}
		};

		for (const entry of this.options().buttons) {
			if (this.isGroup(entry)) {
				flush();
				const buttons = entry.buttons.filter((button) => button !== cancel);
				if (buttons.length) {
					groups.push({ ...entry, buttons });
				}
			} else if (entry !== cancel) {
				loose.push(entry);
			}
		}

		flush();
		return groups;
	});

	/** The single escape hatch, wherever it was declared. */
	protected readonly cancelButton = computed<HubActionSheetButton<D> | null>(() => {
		for (const entry of this.options().buttons) {
			const buttons = this.isGroup(entry) ? entry.buttons : [entry];
			const cancel = buttons.find((button) => button.role === 'cancel');
			if (cancel) {
				return cancel;
			}
		}
		return null;
	});

	/** Extra classes the caller asked for on the sheet. */
	protected readonly panelClasses = computed(() => this.toClassList(this.options().panelClass));

	/**
	 * Inline accent for a custom variant. The canonical ones are resolved by the
	 * stylesheet, so this only carries what the `@each` loop cannot know about.
	 */
	protected readonly customAccent = computed(() => {
		const variant = this.options().variant;
		return variant && !BUILT_IN_VARIANTS.has(variant) ? `var(--hub-sys-color-${variant})` : null;
	});

	protected readonly sheetTransform = computed(() => {
		const offset = this.dragOffset();
		return offset ? `translateY(${offset}px)` : null;
	});

	/** Runs an action: its handler may refuse the close by returning `false`. */
	protected async select(button: HubActionSheetButton<D>): Promise<void> {
		if (button.disabled) {
			return;
		}

		if (button.handler) {
			const outcome = await button.handler();
			if (outcome === false) {
				return;
			}
		}

		this.sheetRef().settle({ role: button.role, data: button.data });
	}

	/**
	 * Closes without choosing an action. The cancel action still gets its say —
	 * a reader who taps the backdrop meant to cancel, and a handler that refuses
	 * refuses here too.
	 */
	protected async dismissBy(reason: HubActionSheetDismissReason): Promise<void> {
		const cancel = this.cancelButton();

		if (cancel?.handler) {
			const outcome = await cancel.handler();
			if (outcome === false) {
				return;
			}
		}

		this.sheetRef().settle({ role: reason });
	}

	protected onBackdrop(): void {
		if (this.options().backdropDismiss) {
			void this.dismissBy('backdrop');
		}
	}

	protected onEscape(): void {
		if (this.options().keyboard) {
			void this.dismissBy('escape');
		}
	}

	/**
	 * Keeps Tab inside the sheet. A dialog that lets focus wander behind its own
	 * backdrop is a dialog a keyboard reader cannot get out of.
	 */
	protected onTab(event: Event): void {
		// A host binding with a key modifier hands the listener a plain `Event`.
		const { shiftKey } = event as KeyboardEvent;
		const focusable = this.focusableActions();
		if (!focusable.length) {
			return;
		}

		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		const active = document.activeElement;

		if (shiftKey && (active === first || !this.#host.nativeElement.contains(active))) {
			event.preventDefault();
			last.focus();
		} else if (!shiftKey && active === last) {
			event.preventDefault();
			first.focus();
		}
	}

	protected onDragStart(event: PointerEvent): void {
		if (!this.options().swipeToClose || event.button !== 0) {
			return;
		}

		this.#dragStartY = event.clientY;
		this.dragging.set(true);

		const sheet = this.sheetElement();
		this.#dragThreshold = Math.max(MIN_DRAG_THRESHOLD, (sheet?.offsetHeight ?? 0) * DRAG_THRESHOLD_RATIO);

		// Capturing the pointer keeps the drag alive when the finger leaves the grip; it is
		// an improvement, not a requirement. It throws for a pointer the browser no longer
		// considers active — a tap released in the same frame, an event another tool
		// dispatched — and a drag is no reason to raise an error the application must handle.
		const target = event.target as HTMLElement;
		if (event.pointerId != null && typeof target.setPointerCapture === 'function') {
			try {
				target.setPointerCapture(event.pointerId);
			} catch {
				// Dragging still follows the pointer while it stays over the sheet.
			}
		}
	}

	protected onDragMove(event: PointerEvent): void {
		if (!this.dragging()) {
			return;
		}

		const distance = event.clientY - this.#dragStartY;
		this.dragOffset.set(distance > DRAG_SLOP ? distance : 0);
		// This view is mounted by hand, outside the tree Angular walks when a signal
		// changes, so the sheet only follows the finger if the refresh is asked for.
		this.#cdr.detectChanges();
	}

	protected onDragEnd(): void {
		if (!this.dragging()) {
			return;
		}

		const travelled = this.dragOffset();
		this.dragging.set(false);
		this.dragOffset.set(0);

		if (travelled >= this.#dragThreshold) {
			void this.dismissBy('swipe');
		}
	}

	/** Opens with focus on the first thing the reader can act on. */
	private focusFirstAction(): void {
		const focusable = this.focusableActions();
		(focusable[0] ?? this.sheetElement())?.focus();
	}

	private focusableActions(): HTMLElement[] {
		return Array.from(this.#host.nativeElement.querySelectorAll<HTMLElement>('.hub-action-sheet__action:not([disabled])'));
	}

	private sheetElement(): HTMLElement | null {
		return this.#host.nativeElement.querySelector('.hub-action-sheet__sheet');
	}

	private isGroup(entry: HubActionSheetButton<D> | HubActionSheetGroup<D>): entry is HubActionSheetGroup<D> {
		return 'buttons' in entry;
	}

	private toClassList(value: string | string[] | undefined): string[] {
		if (!value) {
			return [];
		}
		return Array.isArray(value) ? value : value.split(' ').filter(Boolean);
	}

	/** Exposed for the template, which cannot call a private method. */
	protected classesFor(button: HubActionSheetButton<D>): string[] {
		return this.toClassList(button.cssClass);
	}
}

/** Variants with exact design-system token coverage via the SCSS `@each` loop. */
const BUILT_IN_VARIANTS = new Set<string>([
	'primary',
	'secondary',
	'success',
	'danger',
	'warning',
	'info',
	'neutral',
	'light',
	'dark'
]);

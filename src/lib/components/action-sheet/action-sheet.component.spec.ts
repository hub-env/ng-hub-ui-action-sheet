import { TestBed } from '@angular/core/testing';
import { HubActionSheet } from '../../services/action-sheet.service';

const grip = () => document.querySelector('.hub-action-sheet__grip') as HTMLElement | null;
const sheet = () => document.querySelector('.hub-action-sheet__sheet') as HTMLElement | null;
const actions = () => Array.from(document.querySelectorAll<HTMLElement>('.hub-action-sheet__action'));
const settle = () => new Promise<void>((resolve) => setTimeout(resolve));

/**
 * jsdom has no PointerEvent, and the handlers only read `clientY` and `button`,
 * so a MouseEvent carrying the same fields drives the gesture faithfully.
 */
const drag = (target: HTMLElement, distance: number): void => {
	target.dispatchEvent(new MouseEvent('pointerdown', { clientY: 0, bubbles: true }));
	target.dispatchEvent(new MouseEvent('pointermove', { clientY: distance, bubbles: true }));
	target.dispatchEvent(new MouseEvent('pointerup', { clientY: distance, bubbles: true }));
};

describe('HubActionSheetComponent — swipe to close', () => {
	let service: HubActionSheet;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(HubActionSheet);
	});

	afterEach(() => {
		document.querySelectorAll('hub-action-sheet').forEach((el) => el.remove());
	});

	it('dismisses when the sheet is dragged past its threshold', async () => {
		const ref = service.open({ buttons: [{ text: 'Copy link' }] });

		drag(grip()!, 120);

		await expect(ref.result).resolves.toEqual({ role: 'swipe' });
		await settle();
		expect(sheet()).toBeNull();
	});

	it('snaps back after a short drag', async () => {
		const ref = service.open({ buttons: [{ text: 'Copy link' }] });

		drag(grip()!, 20);
		await settle();

		expect(ref.settled).toBe(false);
		expect(sheet()).not.toBeNull();
	});

	it('runs the cancel handler on a swipe, like any other dismissal', async () => {
		let cancelled = 0;
		const ref = service.open({
			buttons: [{ text: 'Copy link' }, { text: 'Cancel', role: 'cancel', handler: () => void cancelled++ }]
		});

		drag(grip()!, 120);
		await ref.result;

		expect(cancelled).toBe(1);
	});

	it('offers no grip when swiping is off', () => {
		service.open({ swipeToClose: false, buttons: [{ text: 'Copy link' }] });

		expect(grip()).toBeNull();
	});
});

describe('HubActionSheetComponent — accessible state of the selected role', () => {
	let service: HubActionSheet;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(HubActionSheet);
	});

	afterEach(() => {
		document.querySelectorAll('hub-action-sheet').forEach((el) => el.remove());
	});

	it('marks the selected action with aria-current, an attribute a button is allowed to carry', () => {
		service.open({ buttons: [{ text: 'Silent', role: 'selected' }, { text: 'Ring' }] });

		const [selected, plain] = actions();

		expect(selected.getAttribute('aria-current')).toBe('true');
		expect(selected.hasAttribute('aria-checked')).toBe(false);
		expect(plain.hasAttribute('aria-current')).toBe(false);
		expect(plain.hasAttribute('aria-checked')).toBe(false);
	});
});

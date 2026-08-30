import { TestBed } from '@angular/core/testing';
import { provideHubActionSheet } from '../action-sheet.config';
import { HubActionSheet } from './action-sheet.service';

/** Reads the live overlay out of the document, where the service mounts it. */
const sheet = () => document.querySelector('.hub-action-sheet__sheet') as HTMLElement | null;
const backdrop = () => document.querySelector('.hub-action-sheet__backdrop') as HTMLElement | null;
const actions = () => Array.from(document.querySelectorAll<HTMLButtonElement>('.hub-action-sheet__action'));
const labels = () => actions().map((el) => el.textContent?.trim());

/** Lets a handler's promise and the teardown settle before asserting. */
const settle = () => new Promise<void>((resolve) => setTimeout(resolve));

describe('HubActionSheet', () => {
	let service: HubActionSheet;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(HubActionSheet);
	});

	afterEach(() => {
		document.querySelectorAll('hub-action-sheet').forEach((el) => el.remove());
	});

	it('renders the header, the sub-header and one action per button', () => {
		service.open({
			header: 'Share document',
			subHeader: 'Anyone with the link can read it',
			buttons: [{ text: 'Copy link' }, { text: 'Send by email' }]
		});

		expect(sheet()).not.toBeNull();
		expect(document.querySelector('.hub-action-sheet__header')?.textContent?.trim()).toBe('Share document');
		expect(document.querySelector('.hub-action-sheet__sub-header')?.textContent?.trim()).toBe(
			'Anyone with the link can read it'
		);
		expect(labels()).toEqual(['Copy link', 'Send by email']);
	});

	describe('accessibility', () => {
		it('is a modal dialog named by its header', () => {
			service.open({ header: 'Share document', buttons: [{ text: 'Copy link' }] });

			const dialog = sheet()!;
			expect(dialog.getAttribute('role')).toBe('dialog');
			expect(dialog.getAttribute('aria-modal')).toBe('true');

			const labelledBy = dialog.getAttribute('aria-labelledby');
			expect(labelledBy).toBeTruthy();
			expect(document.getElementById(labelledBy!)?.textContent?.trim()).toBe('Share document');
		});

		it('falls back to ariaLabel when there is no header', () => {
			service.open({ ariaLabel: 'Document actions', buttons: [{ text: 'Copy link' }] });

			const dialog = sheet()!;
			expect(dialog.getAttribute('aria-label')).toBe('Document actions');
			expect(dialog.getAttribute('aria-labelledby')).toBeNull();
		});

		it('moves focus into the sheet and returns it on close', async () => {
			const trigger = document.createElement('button');
			document.body.append(trigger);
			trigger.focus();

			const ref = service.open({ buttons: [{ text: 'Copy link' }] });
			expect(sheet()!.contains(document.activeElement)).toBe(true);

			actions()[0].click();
			await ref.result;
			await settle();

			expect(document.activeElement).toBe(trigger);
			trigger.remove();
		});
	});

	describe('choosing an action', () => {
		it('resolves with the role and the data, and takes the sheet down', async () => {
			const ref = service.open({
				buttons: [{ text: 'Delete', role: 'destructive', data: { id: 7 } }]
			});

			actions()[0].click();

			await expect(ref.result).resolves.toEqual({ role: 'destructive', data: { id: 7 } });
			await settle();
			expect(sheet()).toBeNull();
		});

		it('runs the handler', () => {
			let ran = 0;
			service.open({ buttons: [{ text: 'Copy link', handler: () => void ran++ }] });

			actions()[0].click();

			expect(ran).toBe(1);
		});

		it('keeps the sheet open when the handler returns false', async () => {
			const ref = service.open({ buttons: [{ text: 'Copy link', handler: () => false }] });

			actions()[0].click();
			await settle();

			expect(sheet()).not.toBeNull();
			expect(ref.settled).toBe(false);
		});

		it('keeps the sheet open when an async handler resolves false', async () => {
			const ref = service.open({ buttons: [{ text: 'Copy link', handler: async () => false }] });

			actions()[0].click();
			await settle();

			expect(sheet()).not.toBeNull();
			expect(ref.settled).toBe(false);
		});

		it('ignores a disabled action', async () => {
			let ran = 0;
			const ref = service.open({ buttons: [{ text: 'Copy link', disabled: true, handler: () => void ran++ }] });

			expect(actions()[0].disabled).toBe(true);
			actions()[0].click();
			await settle();

			expect(ran).toBe(0);
			expect(ref.settled).toBe(false);
		});
	});

	describe('layout of the actions', () => {
		it('lifts the cancel action out and renders it apart, last', () => {
			service.open({
				buttons: [{ text: 'Cancel', role: 'cancel' }, { text: 'Copy link' }, { text: 'Delete', role: 'destructive' }]
			});

			expect(labels()).toEqual(['Copy link', 'Delete', 'Cancel']);
			expect(document.querySelector('.hub-action-sheet__cancel .hub-action-sheet__action')?.textContent?.trim()).toBe(
				'Cancel'
			);
		});

		it('marks the destructive action', () => {
			service.open({ buttons: [{ text: 'Delete', role: 'destructive' }] });

			expect(actions()[0].classList).toContain('hub-action-sheet__action--destructive');
		});

		it('renders groups with their titles', () => {
			service.open({
				buttons: [
					{ title: 'Share', buttons: [{ text: 'Copy link' }, { text: 'Send by email' }] },
					{ title: 'Danger', buttons: [{ text: 'Delete', role: 'destructive' }] }
				]
			});

			const titles = Array.from(document.querySelectorAll('.hub-action-sheet__group-title')).map((el) =>
				el.textContent?.trim()
			);
			expect(titles).toEqual(['Share', 'Danger']);
			expect(labels()).toEqual(['Copy link', 'Send by email', 'Delete']);
		});

		it('reflects the variant on the host', () => {
			service.open({ variant: 'success', buttons: [{ text: 'Copy link' }] });

			expect(sheet()!.closest('hub-action-sheet')?.getAttribute('data-variant')).toBe('success');
		});
	});

	describe('dismissing', () => {
		it('closes on a backdrop click, reporting the reason', async () => {
			const ref = service.open({ buttons: [{ text: 'Copy link' }] });

			backdrop()!.click();

			await expect(ref.result).resolves.toEqual({ role: 'backdrop' });
			await settle();
			expect(sheet()).toBeNull();
		});

		it('runs the cancel action handler when dismissed by the backdrop', async () => {
			let cancelled = 0;
			const ref = service.open({
				buttons: [{ text: 'Copy link' }, { text: 'Cancel', role: 'cancel', handler: () => void cancelled++ }]
			});

			backdrop()!.click();
			await ref.result;

			expect(cancelled).toBe(1);
		});

		it('ignores the backdrop when backdropDismiss is off', async () => {
			const ref = service.open({ backdropDismiss: false, buttons: [{ text: 'Copy link' }] });

			backdrop()!.click();
			await settle();

			expect(ref.settled).toBe(false);
			expect(sheet()).not.toBeNull();
		});

		it('closes on Escape', async () => {
			const ref = service.open({ buttons: [{ text: 'Copy link' }] });

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

			await expect(ref.result).resolves.toEqual({ role: 'escape' });
		});

		it('ignores Escape when the keyboard is off', async () => {
			const ref = service.open({ keyboard: false, buttons: [{ text: 'Copy link' }] });

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
			await settle();

			expect(ref.settled).toBe(false);
		});

		it('closes from the handle', async () => {
			const ref = service.open({ buttons: [{ text: 'Copy link' }] });

			ref.dismiss('swipe');

			await expect(ref.result).resolves.toEqual({ role: 'swipe' });
			await settle();
			expect(sheet()).toBeNull();
		});

		it('answers only once', async () => {
			const ref = service.open({ buttons: [{ text: 'Copy link' }] });

			backdrop()!.click();
			ref.dismiss('escape');

			await expect(ref.result).resolves.toEqual({ role: 'backdrop' });
		});
	});

	describe('application-wide defaults', () => {
		beforeEach(() => {
			TestBed.resetTestingModule();
			TestBed.configureTestingModule({ providers: [provideHubActionSheet({ backdropDismiss: false })] });
			service = TestBed.inject(HubActionSheet);
		});

		it('honours the provided defaults', async () => {
			const ref = service.open({ buttons: [{ text: 'Copy link' }] });

			backdrop()!.click();
			await settle();

			expect(ref.settled).toBe(false);
		});

		it('lets a single call override them', async () => {
			const ref = service.open({ backdropDismiss: true, buttons: [{ text: 'Copy link' }] });

			backdrop()!.click();

			await expect(ref.result).resolves.toEqual({ role: 'backdrop' });
		});
	});
});

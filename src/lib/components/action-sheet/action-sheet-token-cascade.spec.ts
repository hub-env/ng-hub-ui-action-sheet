import { TestBed } from '@angular/core/testing';
import { HubActionSheet } from '../../services/action-sheet.service';

/**
 * The two tokens the sheet DECLARES rather than reads. `--hub-action-sheet-accent` is
 * re-based per `variant`, which is an instruction about this sheet and must outrank the
 * application-wide default; `-accent-emphasis` is a role nothing here paints with,
 * declared so a consumer dressing the sheet can read it.
 */
const DECLARED = ['--hub-action-sheet-accent', '--hub-action-sheet-accent-emphasis'];

/** One `selector { … }` rule of the stylesheet as the build injects it into the document. */
interface StyleRule {
	selector: string;
	body: string;
}

/**
 * The stylesheet the component actually ships, read back from the document. Going through
 * the DOM rather than the `.scss` source is the point: what decides the cascade is the CSS
 * that reaches the page, after the build has compiled it and the emulated-encapsulation
 * shim has rewritten `:host` and `:root` into attribute selectors.
 */
function shippedCss(): string {
	return Array.from(document.querySelectorAll('style'))
		.map((style) => style.textContent ?? '')
		.filter((text) => text.includes('hub-action-sheet'))
		.join('\n')
		.replace(/\/\*[\s\S]*?\*\//g, '');
}

function shippedRules(): StyleRule[] {
	const rules: StyleRule[] = [];
	// Nested at-rules (`@media`, `@keyframes`) are stepped over rather than parsed: their
	// wrapper never matches this pattern, and the rules inside them do.
	for (const match of shippedCss().matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
		rules.push({ selector: match[1].trim(), body: match[2] });
	}
	return rules;
}

describe('action-sheet token cascade', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({});
		TestBed.inject(HubActionSheet).open({
			header: 'Notification schedule',
			buttons: [
				{ text: 'Every hour', role: 'selected' },
				{ text: 'Cancel', role: 'cancel' }
			]
		});
	});

	afterEach(() => {
		document.querySelectorAll('hub-action-sheet').forEach((element) => element.remove());
	});

	it('claims no token on the host, so an application `:root` reaches the sheet', () => {
		const declared = new Set(
			shippedRules().flatMap((rule) =>
				[...rule.body.matchAll(/(--hub-action-sheet-[a-z-]+)\s*:/g)].map((match) => match[1])
			)
		);

		// The sheet is mounted on `document.body` and the documentation sends the reader to
		// `:root`. A declaration on the host beats an inherited value however low its
		// specificity, so every token declared here is one the application cannot change.
		expect([...declared].sort()).toEqual([...DECLARED].sort());
	});

	it('reads each token with its own default rather than a bare value', () => {
		const css = shippedCss();
		const read = new Set([...css.matchAll(/var\((--hub-action-sheet-[a-z-]+),/g)].map((match) => match[1]));

		// Every hook the sheet paints with, read with a fallback. The list is named because
		// the guarantee is per token: a count would still pass with the wrong ones missing.
		expect([...read]).toEqual(
			expect.arrayContaining([
				'--hub-action-sheet-z-index',
				'--hub-action-sheet-backdrop-bg',
				'--hub-action-sheet-bg',
				'--hub-action-sheet-color',
				'--hub-action-sheet-border-color',
				'--hub-action-sheet-border-radius',
				'--hub-action-sheet-shadow',
				'--hub-action-sheet-max-width',
				'--hub-action-sheet-padding',
				'--hub-action-sheet-gap',
				'--hub-action-sheet-inset',
				'--hub-action-sheet-duration',
				'--hub-action-sheet-header-color',
				'--hub-action-sheet-sub-header-color',
				'--hub-action-sheet-group-title-color',
				'--hub-action-sheet-action-color',
				'--hub-action-sheet-action-bg',
				'--hub-action-sheet-action-hover-bg',
				'--hub-action-sheet-action-min-height',
				'--hub-action-sheet-action-padding-x',
				'--hub-action-sheet-action-gap',
				'--hub-action-sheet-action-font-size',
				'--hub-action-sheet-action-radius',
				'--hub-action-sheet-action-disabled-opacity',
				'--hub-action-sheet-destructive-color',
				'--hub-action-sheet-accent',
				'--hub-action-sheet-accent-subtle',
				'--hub-action-sheet-selected-color',
				'--hub-action-sheet-selected-bg',
				'--hub-action-sheet-handle-width',
				'--hub-action-sheet-handle-height',
				'--hub-action-sheet-handle-color',
				'--hub-action-sheet-focus-ring-width',
				'--hub-action-sheet-focus-ring-color'
			])
		);
	});

	it('keeps the design-system chain in the defaults it falls back to', () => {
		const css = shippedCss();

		// The defaults used to be declared as `--hub-action-sheet-bg: var(--hub-sys-surface-page, #fff)`
		// and read as `var(--hub-action-sheet-bg, #fff)`. Moving them into the read has to carry
		// the sys token along, or an application that re-themes through the design system stops
		// moving the sheet with it.
		expect(css).toContain('var(--hub-action-sheet-bg, var(--hub-sys-surface-page, #fff))');
		expect(css).toContain('var(--hub-action-sheet-color, var(--hub-sys-text-primary, #212529))');
		expect(css).toContain('var(--hub-action-sheet-border-color, var(--hub-sys-border-color-default, #dee2e6))');
		expect(css).toContain('var(--hub-action-sheet-destructive-color, var(--hub-sys-color-danger, #dc3545))');
		expect(css).toContain('var(--hub-action-sheet-accent, var(--hub-sys-color-primary, #0d6efd))');
	});

	it('derives the selection from the live accent slot', () => {
		const [selected] = shippedRules().filter((rule) => rule.selector.startsWith('.hub-action-sheet__action--selected'));

		// Derived on the action rather than on the host: a `panelClass` re-bases the accent on
		// the sheet, which is below the host, so a role computed up there would keep the old
		// colour and a branded selection would silently stay blue.
		expect(selected.body).toContain('color-mix(in oklch, var(--hub-action-sheet-accent,');
	});
});

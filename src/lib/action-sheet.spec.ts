import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSheet } from './action-sheet';

describe('ActionSheet', () => {
	let component: ActionSheet;
	let fixture: ComponentFixture<ActionSheet>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ActionSheet]
		}).compileComponents();

		fixture = TestBed.createComponent(ActionSheet);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NutrisliceItemsDialogComponent } from './nutrislice-items-dialog.component';

describe('NutrisliceItemsDialogComponent', () => {
  let component: NutrisliceItemsDialogComponent;
  let fixture: ComponentFixture<NutrisliceItemsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NutrisliceItemsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NutrisliceItemsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

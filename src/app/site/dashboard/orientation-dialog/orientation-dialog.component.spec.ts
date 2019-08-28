import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrientationDialogComponent } from './orientation-dialog.component';

describe('OrientationDialogComponent', () => {
  let component: OrientationDialogComponent;
  let fixture: ComponentFixture<OrientationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrientationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrientationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

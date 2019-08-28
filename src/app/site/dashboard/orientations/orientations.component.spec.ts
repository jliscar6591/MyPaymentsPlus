import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrientationsComponent } from './orientations.component';

describe('OrientationsComponent', () => {
  let component: OrientationsComponent;
  let fixture: ComponentFixture<OrientationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrientationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrientationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

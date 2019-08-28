import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferConfirmationComponent } from './transfer-confirmation.component';

describe('TransferConfirmationComponent', () => {
  let component: TransferConfirmationComponent;
  let fixture: ComponentFixture<TransferConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

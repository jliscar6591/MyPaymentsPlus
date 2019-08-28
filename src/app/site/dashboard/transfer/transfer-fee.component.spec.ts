import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferFeeComponent } from './transfer-fee.component';

describe('TransferFeeComponent', () => {
  let component: TransferFeeComponent;
  let fixture: ComponentFixture<TransferFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

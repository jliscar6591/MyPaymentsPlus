import { Component, OnInit } from '@angular/core';
import { MatRadioChange, MatRadioButton } from '@angular/material';
import { Router } from '@angular/router';
import { LoginResponseModel } from '../../login/model/index';
import { LoginStoreService } from '../../shared/services/index';
import { OrientationService } from '../services/orientation.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.less']
})
export class ExamsComponent implements OnInit {
  public isMobile: boolean;
  private loginResponse: LoginResponseModel;
  public step: number;
  
  constructor(
    private router: Router,
    private loginStoreSvc: LoginStoreService,
    public snackBar: MatSnackBar
  ) {
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
  }

  ngOnInit() {
    this.isMobile = (window.innerWidth < 960) ? true : false;
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

}

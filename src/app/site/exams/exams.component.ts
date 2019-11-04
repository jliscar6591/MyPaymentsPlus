import { Component, OnInit } from '@angular/core';
import { MatRadioChange, MatRadioButton } from '@angular/material';
import { Router } from '@angular/router';
import { LoginResponseModel } from '../../login/model/index';
import { LoginStoreService } from '../../shared/services/index';
import { OrientationService } from '../services/orientation.service';
import { MatSnackBar } from '@angular/material';
import { ExamsService } from '../services/exams.service';
import { AddCartItemService } from '../services/add-cart-item.service';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.less']
})
export class ExamsComponent implements OnInit {
  public isMobile: boolean;
  private loginResponse: LoginResponseModel;
  public step: number;
  public mrChange: any;
  public examInterval: any;
  public enrolledExams: any = [];
  public examsInCart: any = [];
  public examList: any;
  public showExamsInCart: boolean = false;
  public showEnrolledExams: boolean = false;
  public hasExams: boolean = false;
  public selectedExam: any = [];
  public currentSelectedExam: any;
  public selectSpecialAccomodation: any;
  public isGettingExams: boolean = true;
  public cartInterval: any;
  public checked: boolean = false;
  public currentSelectedSchedule: any;

  constructor(
    private router: Router,
    private loginStoreSvc: LoginStoreService,
    public snackBar: MatSnackBar,
    public examsService: ExamsService,
    public addCartItemService: AddCartItemService
  ) {
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
  }

  async ngOnInit() {
    this.isMobile = (window.innerWidth < 960) ? true : false;
    await this.examsService.subscribeToGetExams(this.loginResponse);
    this.examInterval = await setInterval(() => {
      if (this.examsService.examsList) {
        this.examList = this.examsService.examsList;
        console.log('exam list', this.examsService.examsList);
        this.hasExams = true;
        var i;
        for (i = 0; i < this.examsService.examsList.studentExamModels.length; i++) {
          if (this.examsService.examsList.studentExamModels[i].enrolledExams.length > 0) {
            var j;
            for (j = 0; j < this.examsService.examsList.studentExamModels[i].enrolledExams.length; j++) {
              this.enrolledExams.push(this.examsService.examsList.studentExamModels[i].enrolledExams[j]);
            }
          }
          if (this.examsService.examsList.studentExamModels[i].examsInCart.length > 0) {
            var k;
            for (k = 0; k < this.examsService.examsList.studentExamModels[i].examsInCart.length; k++) {
              this.examsInCart.push(this.examsService.examsList.studentExamModels[i].examsInCart[k]);
            }
          }
        }
        if (this.enrolledExams !== undefined) {
          if (this.enrolledExams.length > 0) {
            this.showEnrolledExams = true;
          }
        }
        if (this.examsInCart !== undefined) {
          if (this.examsInCart.length > 0) {
            this.showExamsInCart = true;
          }
        }
        console.log('enrolled exams', this.enrolledExams);
        console.log('exams In cart', this.examsInCart)
        this.isGettingExams = false;
        clearInterval(this.examInterval);
      }
    }, 1000);
  }

  public onTabChange(event: MatTabChangeEvent){
    this.selectedExam = [];
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

  public selectExam(exam, student){
    console.log('exam', exam);
    this.selectedExam = [];
    this.selectedExam.push(exam);
    // console.log('student', student);
    // console.log('selected exam', this.selectedExam);
  }

  public showExamDetails(index, student, exam) {
    this.selectedExam = [];
    this.selectedExam.push(exam);
    console.log('student', student);
    console.log('selected exam', this.selectedExam);
  }

  public selectExamTime(mrChange: MatRadioChange, exam) {
    console.log('mrchange', mrChange);
    this.currentSelectedExam = mrChange.value;
    this.currentSelectedSchedule = exam.schedule[mrChange.source.tabIndex].description;
  }

  public addExamToCart(exam, student, schedule) {
    console.log('exam', exam);
    console.log('student', student);
    if (exam.examKey && student.accountBalanceID && this.selectSpecialAccomodation) {
      let account = {
        liteItemType: "exam",
        itemKey: exam.examKey,
        districtKey: this.loginResponse.districtKey,
        accountBalanceID: student.accountBalanceID,
        itemName: exam.examName,
        studentName: student.firstName,
        examScheduleKey: this.currentSelectedExam,
        needSpecialAccomodation: this.selectSpecialAccomodation,
        isSpecialProgramExam: exam.isSpecialProgram,
        termsLink: exam.termsLink,
        examScheduleDescription: this.currentSelectedSchedule
      }
      this.addCartItemService.subscribeToPutExamNew(account, this.loginResponse);
    }
    this.isGettingExams = true;
    this.cartInterval = setInterval(()=>{
      if(this.addCartItemService.result === true){
        this.checked = false;
        this.examList = [];
        this.enrolledExams = [];
        this.examsInCart = [];
        this.examsService.examsList = {};
        this.examsService.subscribeToGetExams(this.loginResponse);
        this.examInterval = setInterval(() => {
          if (this.examsService.examsList) {
            this.examList = this.examsService.examsList;
            console.log('exam list', this.examsService.examsList);
            this.hasExams = true;
            var i;
            for (i = 0; i < this.examsService.examsList.studentExamModels.length; i++) {
              if (this.examsService.examsList.studentExamModels[i].enrolledExams.length > 0) {
                var j;
                for (j = 0; j < this.examsService.examsList.studentExamModels[i].enrolledExams.length; j++) {
                  this.enrolledExams.push(this.examsService.examsList.studentExamModels[i].enrolledExams[j]);
                }
              }
              if (this.examsService.examsList.studentExamModels[i].examsInCart.length > 0) {
                var k;
                for (k = 0; k < this.examsService.examsList.studentExamModels[i].examsInCart.length; k++) {
                  this.examsInCart.push(this.examsService.examsList.studentExamModels[i].examsInCart[k]);
                }
              }
            }
            if (this.enrolledExams !== undefined) {
              if (this.enrolledExams.length > 0) {
                this.showEnrolledExams = true;
              }
            }
            if (this.examsInCart !== undefined) {
              if (this.examsInCart.length > 0) {
                this.showExamsInCart = true;
              }
            }
            console.log('enrolled exams', this.enrolledExams);
            console.log('exams In cart', this.examsInCart);
            this.selectSpecialAccomodation = '';
            this.selectedExam = [];
            this.isGettingExams = false;
            clearInterval(this.cartInterval);
            clearInterval(this.examInterval);
          }
        }, 1000);
        clearInterval(this.cartInterval);
      }
    }, 1000)
  }

  public selectSpecial(mrsChange: MatRadioChange) {
    this.selectSpecialAccomodation = mrsChange.value;
  }


}

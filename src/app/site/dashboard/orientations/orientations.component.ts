import { Component, OnInit } from '@angular/core';
import { MatRadioChange, MatRadioButton } from '@angular/material';
import { Router } from '@angular/router';
import { LoginResponseModel } from '../../../login/model/index';
import { LoginStoreService } from '../../../shared/services/index';
import { OrientationService } from '../../services/orientation.service';
import { MatSnackBar } from '@angular/material';
import { flattenStyles } from '@angular/platform-browser/src/dom/dom_renderer';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-orientations',
  templateUrl: './orientations.component.html',
  styleUrls: ['./orientations.component.less']
})
export class OrientationsComponent implements OnInit {
  public isMobile: boolean;
  public mrChange: any;
  private loginResponse: LoginResponseModel;
  public showButton: boolean = false;
  public step = 0;
  public orientationInterval: any;
  public orientationList: any;
  public unsignedDocuments: any;
  public signedDocuments: any;
  public gettingOrientation: boolean = true;
  public responses: any;
  public hasSigned: boolean;
  public hasUnsigned: boolean;
  public showInCart: boolean;
  public detailedResponses: any;
  public detailedIds: any;
  public signedOrientationList: any = [];
  public unsignedOrientationList: any = [];

  constructor(private router: Router,
    private loginStoreSvc: LoginStoreService,
    public orientationService: OrientationService,
    public snackBar: MatSnackBar
  ) {
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
  }

  async ngOnInit() {
    this.isMobile = (window.innerWidth < 960) ? true : false;
    await this.orientationService.subscribeToGetOrientation(this.loginStoreSvc.loginStateItems);
    this.orientationInterval = await setInterval(() => {
      if (this.orientationService.orientationList) {
        this.orientationList = this.orientationService.orientationList;

        var i;
        for (i = 0; i < this.orientationList.length; i++) {
          if (this.orientationList[i].orientation.signedDocuments.length > 0) {
            this.hasSigned = true;
            this.signedOrientationList.push(this.orientationList[i]);
          }
          if (this.orientationList[i].orientation.unsignedDocuments.length > 0) {
            this.hasUnsigned = true;
            this.unsignedOrientationList.push(this.orientationList[i]);
          }
        }
        this.gettingOrientation = false;
        clearInterval(this.orientationInterval);
        console.log('unsigned orientationLists', this.unsignedOrientationList);
        console.log('signed documents', this.signedOrientationList)
        console.log('orientation list', this.orientationList);
      }
    }, 100)
    this.responses = [];
    this.detailedResponses = [];
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

  public onCheckBoxChange(event, studentIndex, documentIndex, item, student) {
    item.checked = !item.checked;
    console.log('checked?', item.checked);
    if (item.checked) {
      console.log(studentIndex, documentIndex, event, item);
      let response = {
        'accountBalanceID': student.accountBalanceID,
        'orientationItemID': item.orientationItemId,
        'signed': item.checked
      }
      this.responses.push(response);
      console.log("responses", this.responses);
      let details = {
        'document': item,
        'student': student
      }
      var j;
      for (j = 0; j < this.detailedResponses.length; j++) {
        if (this.detailedResponses[j].document.orientationItemId === item.orientationItemId && this.detailedResponses[j].student.accountBalanceID === student.accountBalanceID) {
          this.detailedResponses.splice(j, 1);
        }
      }
      this.detailedResponses.push(details);
      console.log('detailed responses', this.detailedResponses);
      this.nextStep();
    } else {
      var i;
      for (i = 0; i < this.responses.length; i++) {
        if (this.responses[i].orientationItemID === item.orientationItemId) {
          this.responses.splice(i, 1);
        }

      }
    }
    if (this.responses.length > 0 || this.detailedResponses.length > 0) {
      this.showButton = true;
      this.showInCart = true;
    } else {
      this.showButton = false;
      this.showInCart = false;
    }
  }

  public onChangeYes(mrChange: MatRadioChange, studentIndex, documentIndex, item, student) {
    console.log(mrChange.value);
    console.log(studentIndex, documentIndex, item, student);
    if (mrChange.value === true) {
      item.checked;
    }
    let response = {
      'accountBalanceID': student.accountBalanceID,
      'orientationItemID': item.orientationItemId,
      'signed': true
    }
    var i;
    for (i = 0; i < this.responses.length; i++) {
      if (this.responses[i].orientationItemID === item.orientationItemId) {
        this.responses.splice(i, 1)
      }
    }
    this.responses.push(response);
    this.unsignedOrientationList[studentIndex].orientation.unsignedDocuments[documentIndex].signed = true;
    console.log("responses", this.responses);
    let details = {
      'document': item,
      'student': student
    }
    var j;
    for (j = 0; j < this.detailedResponses.length; j++) {
      if (this.detailedResponses[j].document.orientationItemId === item.orientationItemId && this.detailedResponses[j].student.accountBalanceID === student.accountBalanceID) {
        this.detailedResponses.splice(j, 1)
      }
    }
    this.detailedResponses.push(details);
    this.nextStep();

    let mrButton: MatRadioButton = mrChange.source;
    if (this.responses.length > 0 || this.detailedResponses.length > 0) {
      this.showButton = true;
      this.showInCart = true;
    } else {
      this.showButton = false;
      this.showInCart = false;
    }
  }

  public onChangeAgree(mrChange: MatRadioChange, studentIndex, documentIndex, item, student) {
    console.log(mrChange.value);
    if (mrChange.value === true) {
      item.checked;
    }
    console.log(studentIndex, documentIndex, item, student);
    let mrButton: MatRadioButton = mrChange.source;
    this.showButton = true;
    console.log(mrButton.name);
    console.log(mrButton.checked);
    console.log(mrButton.inputId);
    let response = {
      'accountBalanceID': student.accountBalanceID,
      'orientationItemID': item.orientationItemId,
      'signed': true
    }
    var i;
    for (i = 0; i < this.responses.length; i++) {
      if (this.responses[i].orientationItemID === item.orientationItemId) {
        this.responses.splice(i, 1)
      }
    }
    this.responses.push(response);
    this.unsignedOrientationList[studentIndex].orientation.unsignedDocuments[documentIndex].signed = true;
    console.log("responses", this.responses);
    let details = {
      'document': item,
      'student': student
    }
    var j;
    for (j = 0; j < this.detailedResponses.length; j++) {
      if (this.detailedResponses[j].document.orientationItemId === item.orientationItemId && this.detailedResponses[j].student.accountBalanceID === student.accountBalanceID) {
        this.detailedResponses.splice(j, 1);
      }
    }
    this.detailedResponses.push(details);
    console.log('detailed responses', this.detailedResponses);
    this.nextStep();

    if (this.responses.length > 0 || this.detailedResponses.length > 0) {
      this.showButton = true;
      this.showInCart = true;
    } else {
      this.showButton = false;
      this.showInCart = false;
    }
  }

  public async hideSubmit() {
    this.orientationService.subscribeToPostOrientation(this.loginResponse, this.responses);
    this.orientationInterval = setInterval(() => {
      this.gettingOrientation = true;
      if (this.orientationService.orientationResponse) {
        console.log('response', this.orientationService.orientationResponse);
        this.showButton = false;
        this.showInCart = false;
        this.gettingOrientation = false;
        this.responses = [];
        this.openSnackBar();
        this.orientationService.subscribeToGetOrientation(this.loginStoreSvc.loginStateItems);
        if(this.orientationService.orientationResponse){
          this.resetPage();
          clearInterval(this.orientationInterval);
        }

      }
    }, 1000);
  }

  public async resetPage(){
    this.orientationInterval = await setInterval(() => {
      if (this.orientationService.orientationList) {
        this.orientationList = this.orientationService.orientationList;

        var i;
        for (i = 0; i < this.orientationList.length; i++) {
          if (this.orientationList[i].orientation.signedDocuments.length > 0) {
            this.hasSigned = true;
            this.signedOrientationList.push(this.orientationList[i]);
          }
          if (this.orientationList[i].orientation.unsignedDocuments.length > 0) {
            this.hasUnsigned = true;
            this.unsignedOrientationList.push(this.orientationList[i]);
          }
        }
        this.gettingOrientation = false;
        clearInterval(this.orientationInterval);
        console.log('unsigned orientationLists', this.unsignedOrientationList);
        console.log('signed documents', this.signedOrientationList)
        console.log('orientation list', this.orientationList);
      }
    }, 100)
  }

  openSnackBar() {

    this.snackBar.open('Documents Submitted', '✔', {
      duration: 2000,
    });
  }


}

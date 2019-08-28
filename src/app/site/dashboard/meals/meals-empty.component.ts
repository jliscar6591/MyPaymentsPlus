import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
import { StudentMealsService } from "../../services/student-meals.service";
import { StudentMealsServiceRemote } from "../../services/student-meals.service-remote";
import { MealsComponent } from "./meals.component";
import { PageLoadingService } from '../../../shared/components/page-loading/page-loading.service';
import { Subscription } from 'rxjs';
import { setInterval, clearInterval } from 'timers';
//import { clearInterval } from 'timers';


@Component({
    selector: 'meals-empty',
    moduleId: module.id,
    templateUrl: './meals-empty.component.html', 
    styleUrls: ['./meals.component.less','../dashboard-home.component.less']
})

export class MealsEmptyComponent implements OnInit, AfterContentChecked {
  public isMobile: boolean = false;
  public loadMealsIntrvl: any;
  public desktopInterval: any;
  private formCompleted$: Subscription;
    constructor(
        public studentMealsService: StudentMealsService,
      public mealsComponent: MealsComponent,
      public studentMealsRemoteService: StudentMealsServiceRemote,
      private pageLoadingService: PageLoadingService
    ) {
  }

  ngOnInit() {
  // console.log("Calling Meals Empty: ", this.mealsComponent.isStudentsRemote)
//    console.log("Calling Meals Empty-2: ", this.mealsComponent.isStudentsGetting)
    
  this.isMobile = (window.innerWidth < 960) ? true : false;
    this.pageLoadingService.show("Retrieving Account Information");

  

  }

  ngAfterContentChecked() {
    let intrvl =
    window.setInterval(() => {
      if ((!this.mealsComponent.isStudentsRemote && this.mealsComponent.addCartAmountForm.value.addAmountArray0) || (!this.mealsComponent.isStudentsRemote && this.mealsComponent.addCartAmountMobileForm.value.mobileFormGroup0)) {
        this.formCompleted$ = this.studentMealsRemoteService.formCompleted.subscribe(() => {
         //console.log("isStudentsRemote: ", this.mealsComponent.isStudentsRemote)
          // console.log("I see the form: ", this.mealsComponent.addCartAmountMobileForm.value.mobileFormGroup0)
          this.mealsComponent.isStudentsRemote = (this.studentMealsRemoteService.studentMeals.length > 0) ? true : false;
          this.mealsComponent.isStudentsGetting = (this.studentMealsRemoteService.studentMeals.length < 0) ? true : false;
          window.clearInterval(intrvl);
        })
      }
    }, 10)
      
  }

  ngOnDestroy() {

  }
}

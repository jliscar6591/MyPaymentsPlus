"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var student_meals_service_1 = require("../../services/student-meals.service");
var student_meals_service_remote_1 = require("../../services/student-meals.service-remote");
var meals_component_1 = require("./meals.component");
var page_loading_service_1 = require("../../../shared/components/page-loading/page-loading.service");
//import { clearInterval } from 'timers';
var MealsEmptyComponent = /** @class */ (function () {
    function MealsEmptyComponent(studentMealsService, mealsComponent, studentMealsRemoteService, pageLoadingService) {
        this.studentMealsService = studentMealsService;
        this.mealsComponent = mealsComponent;
        this.studentMealsRemoteService = studentMealsRemoteService;
        this.pageLoadingService = pageLoadingService;
        this.isMobile = false;
    }
    MealsEmptyComponent.prototype.ngOnInit = function () {
        // console.log("Calling Meals Empty: ", this.mealsComponent.isStudentsRemote)
        //    console.log("Calling Meals Empty-2: ", this.mealsComponent.isStudentsGetting)
        this.isMobile = (window.innerWidth < 960) ? true : false;
        this.pageLoadingService.show("Retrieving Account Information");
    };
    MealsEmptyComponent.prototype.ngAfterContentChecked = function () {
        var _this = this;
        var intrvl = window.setInterval(function () {
            if ((!_this.mealsComponent.isStudentsRemote && _this.mealsComponent.addCartAmountForm.value.addAmountArray0) || (!_this.mealsComponent.isStudentsRemote && _this.mealsComponent.addCartAmountMobileForm.value.mobileFormGroup0)) {
                _this.formCompleted$ = _this.studentMealsRemoteService.formCompleted.subscribe(function () {
                    //console.log("isStudentsRemote: ", this.mealsComponent.isStudentsRemote)
                    // console.log("I see the form: ", this.mealsComponent.addCartAmountMobileForm.value.mobileFormGroup0)
                    _this.mealsComponent.isStudentsRemote = (_this.studentMealsRemoteService.studentMeals.length > 0) ? true : false;
                    _this.mealsComponent.isStudentsGetting = (_this.studentMealsRemoteService.studentMeals.length < 0) ? true : false;
                    window.clearInterval(intrvl);
                });
            }
        }, 10);
    };
    MealsEmptyComponent.prototype.ngOnDestroy = function () {
    };
    MealsEmptyComponent = __decorate([
        core_1.Component({
            selector: 'meals-empty',
            moduleId: module.id,
            templateUrl: './meals-empty.component.html',
            styleUrls: ['./meals.component.less', '../dashboard-home.component.less']
        }),
        __metadata("design:paramtypes", [student_meals_service_1.StudentMealsService,
            meals_component_1.MealsComponent,
            student_meals_service_remote_1.StudentMealsServiceRemote,
            page_loading_service_1.PageLoadingService])
    ], MealsEmptyComponent);
    return MealsEmptyComponent;
}());
exports.MealsEmptyComponent = MealsEmptyComponent;
//# sourceMappingURL=meals-empty.component.js.map
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
var http_1 = require("@angular/common/http");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var authenticate_service_1 = require("../services/authenticate.service");
var index_1 = require("../../shared/services/index");
var utility_service_1 = require("../services/utility.service");
var index_2 = require("../../site/services/index");
var HttpIntercept = /** @class */ (function () {
    function HttpIntercept(auth, currentTokenSrvc, loginStoreSrvc, utilityService, studentMealsServiceRemote) {
        this.auth = auth;
        this.currentTokenSrvc = currentTokenSrvc;
        this.loginStoreSrvc = loginStoreSrvc;
        this.utilityService = utilityService;
        this.studentMealsServiceRemote = studentMealsServiceRemote;
    }
    HttpIntercept.prototype.intercept = function (req, next) {
        // console.log("You called the Interceptor: ", req);
        var _this = this;
        var newJWt = req.headers.get('Authorization');
        var reUrl = req.url;
        var currLoginResp;
        if (newJWt) {
            newJWt = newJWt.replace(/bearer/g, "");
            var currentToken = this.currentTokenSrvc.currentToken;
            if (this.currentTokenSrvc.currentLoginResponse) {
                currLoginResp = this.currentTokenSrvc.currentLoginResponse;
            }
            else {
                currLoginResp = this.loginStoreSrvc.cookieStateItem;
            }
            // console.log("What is the currLoginResp: ", currLoginResp )
            this.auth.refreshAccessToken(newJWt, currentToken, currLoginResp);
        }
        req.clone({
            headers: req.headers.set('Cache-Control', 'no-cache')
                .set('Pragma', 'no-cache')
                .set('Expires', 'Thu, 01 JAN 1970 00:00:00 GMT')
                .set('If-Modified-Since', '0')
        });
        return next.handle(req).pipe(operators_1.map(function (event) {
            if (event instanceof http_1.HttpResponse) {
                // console.log('event--->>>', event);
                //for development Only
                if (event.url === 'http://api.mpp.test/profile/api/CafeteriaAccounts/GetRemote') {
                    if (event.status == 206) {
                        var msg = 'Error';
                        console.log("We got a real error: ", event.status);
                        _this.studentMealsServiceRemote.subscribeToGetMeals(_this.loginStoreSrvc.cookieStateItem);
                        // this.utilityService.handleError(event, msg, currLoginResp)
                        _this.utilityService.processApiErr(event, currLoginResp, msg);
                        rxjs_1.Observable.throwError(currLoginResp.messageType);
                    }
                    //if (event.status == 200) {
                    //  let msg = 'Error';
                    //  console.log("We faked an error: ", event.status);
                    ////  this.utilityService.handleError(event, msg, currLoginResp)
                    //  this.utilityService.processApiErr(event, currLoginResp, msg)
                    //  Observable.throwError(currLoginResp.messageType)
                    //}
                }
            }
            return event;
        }));
    };
    HttpIntercept = __decorate([
        core_1.Injectable()
        /*HttpIntercept Class - Intercepts every HttpClient request
        *This function checks the returned jwt and refreshes the jwt
        * if a new one is returned. A new jwt is returned if the current
        * jwt has expired after approximately 15 mins or the userContext is changed
        * when a new district is selected from the multi-district toggle
        */
        ,
        __metadata("design:paramtypes", [authenticate_service_1.AuthenticationService,
            index_1.CurrentTokenService,
            index_1.LoginStoreService,
            utility_service_1.UtilityService,
            index_2.StudentMealsServiceRemote])
    ], HttpIntercept);
    return HttpIntercept;
}());
exports.HttpIntercept = HttpIntercept;
//# sourceMappingURL=http-intercept.js.map
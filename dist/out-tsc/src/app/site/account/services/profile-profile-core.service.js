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
var http_1 = require("@angular/http");
var http_2 = require("@angular/common/http");
var rxjs_1 = require("rxjs");
require("rxjs/add/observable/interval");
//Local
var app_settings_1 = require("../../../app.settings");
var index_1 = require("../../../shared/services/index");
var ProfileProfileCoreService = /** @class */ (function () {
    function ProfileProfileCoreService(http, utilityService, currTokenServ, httpC) {
        this.http = http;
        this.utilityService = utilityService;
        this.currTokenServ = currTokenServ;
        this.httpC = httpC;
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
    }
    ProfileProfileCoreService.prototype.putProfileCore = function (profileProfileCorePutModel, loginResponse) {
        var _this = this;
        var newJwt;
        var token = loginResponse.access_token;
        this.loginResponse = loginResponse;
        var successMessage = '';
        var failureMessage = 'Update Profile Failed';
        this.loginResponse = loginResponse;
        var errHeader = {
            _body: '',
            status: ''
        };
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/ProfileCore';
        var body = JSON.stringify(profileProfileCorePutModel);
        var headers = new http_1.Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + token);
        var options = new http_1.RequestOptions({ headers: headers });
        this.http.put(Url, body, options)
            .subscribe(function (data) {
            newJwt = data.headers.toJSON();
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response
            _this.loginResponse.access_token = newJwt.jwt_refresh[0];
            _this.result = true;
        });
        //Return to calling program every polling interval
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    //public putProfileCore(profileProfileCorePutModel: ProfileProfileCorePutModel, loginResponse: LoginResponseModel): Observable<any> {
    //  this.loginResponse = loginResponse;
    //  let successMessage: string = '';
    //  let failureMessage: string = 'Transfer Status Not Found';
    //  let token = loginResponse.access_token;
    //  this.currentToken = token;
    //  let testString = this.currentToken.match(/bearer/);
    //  if (testString) {
    //    this.currentToken = this.currentToken;
    //  } else {
    //    this.currentToken = 'bearer ' + this.currentToken;
    //  }
    //  this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
    //    var errHeader: any = {
    //          _body: '',
    //          status: ''
    //      }
    //      let Url = Constants.WebApiUrl.Profile + '/ProfileCore';
    //  let body = JSON.stringify(profileProfileCorePutModel);
    //  let headers = new HttpHeaders({
    //    'Content-Type': 'application/JSON',
    //    'Authorization': this.currentToken
    //  });
    //  let options = { headers: headers };
    //  console.log("the URL: ", Url)
    //  console.log("the body: ", body);
    //  console.log("options: ", options)
    //  return this.httpC.put(Url, body, options)
    //    .pipe(
    //    catchError(error => ( this.handleError(error, failureMessage)) ),
    //            tap(data => {
    //                  if (data) {
    //                    this.result = true;
    //                  }
    //             })
    //         )
    //}
    ProfileProfileCoreService.prototype.handleError = function (error, failureMessage) {
        this.result = false;
        this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
        return rxjs_1.Observable.throwError(this.loginResponse.message);
    };
    ProfileProfileCoreService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            index_1.UtilityService,
            index_1.CurrentTokenService,
            http_2.HttpClient])
    ], ProfileProfileCoreService);
    return ProfileProfileCoreService;
}());
exports.ProfileProfileCoreService = ProfileProfileCoreService;
//# sourceMappingURL=profile-profile-core.service.js.map
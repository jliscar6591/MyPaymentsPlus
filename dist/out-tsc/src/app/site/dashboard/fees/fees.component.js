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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var fees_service_1 = require("../../services/fees.service");
var multi_district_service_1 = require("../../services/multi-district.service");
var index_1 = require("../../../shared/services/index");
var refresh_service_1 = require("../../../shared/services/refresh.service");
//import { setTimeout } from 'timers';
var core_2 = require("@capacitor/core");
var App = core_2.Plugins.App;
var FeesComponent = /** @class */ (function () {
    function FeesComponent(feesService, 
    //  private cookieService: CookieService,
    // private validateCookie: ValidateCookieService,
    //  private messageProcessorService: MessageProcessorService,
    // private districtLoginDerivedService: DistrictLoginDerivedService,
    loginStoreSvc, multiDistrictSrvc, refreshService) {
        this.feesService = feesService;
        this.loginStoreSvc = loginStoreSvc;
        this.multiDistrictSrvc = multiDistrictSrvc;
        this.refreshService = refreshService;
        this.isList = false;
        this.getFeesCounter = 0;
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
    }
    FeesComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.mobile = (window.innerWidth < 960) ? true : false;
                this.feesService.subscribeToGetFees(this.loginResponse);
                return [2 /*return*/];
            });
        });
    };
    FeesComponent.prototype.ngDoCheck = function () {
        if (this.feesService.result === true) {
            if (this.getFeesCounter < 1) {
                this.getFees();
                this.getFeesCounter++;
            }
        }
    };
    FeesComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.multiDistrictSrvc.didSwitchDistrict.subscribe(function () {
            // console.log("Did Fees see the Switch - ngAfterContentInit")
            if (_this.multiDistrictSrvc.newDistrictSelected) {
                //  console.log("Did Fees see the Switch")
                _this.loginResponse = _this.loginStoreSvc.cookieStateItem;
                _this.feesService.subscribeToGetFees(_this.loginResponse);
                if (_this.refreshService.refreshFeesCnter < 4) {
                    setTimeout(function () {
                        _this.getFees();
                        _this.multiDistrictSrvc.newDistrictSelected = false;
                    }, 2000);
                }
                ;
            }
        });
    };
    FeesComponent.prototype.getFees = function () {
        this.isList = false;
        if (this.feesService.result === true) {
            this.feesList = this.feesService.feesList;
            this.isList = (this.feesList.length > 0) ? true : false;
        }
    };
    FeesComponent.prototype.ngOnDestroy = function () {
        this.getFeesCounter = 0;
        this.feesService.result = false;
    };
    FeesComponent = __decorate([
        core_1.Component({
            selector: 'fees',
            templateUrl: './fees.component.html',
            styleUrls: ['./fees.component.less']
        }),
        __metadata("design:paramtypes", [fees_service_1.FeesService,
            index_1.LoginStoreService,
            multi_district_service_1.MultiDistrictService,
            refresh_service_1.RefreshService])
    ], FeesComponent);
    return FeesComponent;
}());
exports.FeesComponent = FeesComponent;
//# sourceMappingURL=fees.component.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var multi_district_service_1 = require("./multi-district.service");
describe('MultiDistrictService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [multi_district_service_1.MultiDistrictService]
        });
    });
    it('should be created', testing_1.inject([multi_district_service_1.MultiDistrictService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=multi-district.service.spec.js.map
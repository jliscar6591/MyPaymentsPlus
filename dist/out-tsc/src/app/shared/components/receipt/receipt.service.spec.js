"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var receipt_service_1 = require("./receipt.service");
describe('ReceiptService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [receipt_service_1.ReceiptService]
        });
    });
    it('should be created', testing_1.inject([receipt_service_1.ReceiptService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=receipt.service.spec.js.map
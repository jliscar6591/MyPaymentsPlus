"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var current_token_service_1 = require("./current-token.service");
describe('CurrentTokenService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [current_token_service_1.CurrentTokenService]
        });
    });
    it('should be created', testing_1.inject([current_token_service_1.CurrentTokenService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=current-token.service.spec.js.map
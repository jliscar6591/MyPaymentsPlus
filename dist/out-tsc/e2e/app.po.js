"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var MppPage = /** @class */ (function () {
    function MppPage() {
    }
    MppPage.prototype.navigateTo = function () {
        return protractor_1.browser.get('/');
    };
    MppPage.prototype.getParagraphText = function () {
        return protractor_1.element(protractor_1.by.css('app-root h1')).getText();
    };
    return MppPage;
}());
exports.MppPage = MppPage;
//# sourceMappingURL=app.po.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var nutrislice_items_dialog_component_1 = require("./nutrislice-items-dialog.component");
describe('NutrisliceItemsDialogComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [nutrislice_items_dialog_component_1.NutrisliceItemsDialogComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(nutrislice_items_dialog_component_1.NutrisliceItemsDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=nutrislice-items-dialog.component.spec.js.map
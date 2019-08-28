"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var app_module_1 = require("./app/app.module");
var environment_1 = require("./environments/environment");
if (environment_1.environment.production) {
    core_1.enableProdMode();
}
// this has to bee the unique tag name of the angular app
var ROOT_NODE = 'app-root';
//let platform = platformBrowserDynamic();
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule)
    .then(function (ref) {
    console.log('NG: Bootstrapped. Watching for root node to be removed');
    // Watch the app's parent node for changes to its children. If anything
    // is removed check to see if the removed node is the application root
    // and if so destroy the platform and remove all the references on the window
    // that get left behind
    var observer = new MutationObserver(function (e) {
        var shouldDestroy = false;
        if (e[0].removedNodes.length > 0) {
            e[0].removedNodes.forEach(function (node) {
                if (node.nodeName.toLowerCase() === ROOT_NODE) {
                    shouldDestroy = true;
                }
            });
        }
        if (shouldDestroy) {
            console.log('NG: Root node was removed. Destroying app.', e[0].tagName);
            platform_browser_dynamic_1.platformBrowserDynamic().destroy();
            // platformBrowserDynamic() = null;
            console.log('NG: Trying to free memory');
            delete window.webpackJsonp;
            delete window.frameworkStabilizers;
            delete window.getAngularTestability;
            delete window.getAllAngularTestabilities;
            delete window.getAllAngularRootElements;
            delete window.ng;
            console.log('NG: disposing mutation observer');
            observer.disconnect();
            console.log('NG: Tear down complete');
            // remove all the nodes from the body just to simulate a blank page
            document.body.innerHTML = 'Blank page';
        }
    });
    // comment this to see the difference     
    observer.observe(document.getElementsByTagName(ROOT_NODE)[0].parentElement, { childList: true });
})
    .catch(function (err) { return console.error(err); });
//# sourceMappingURL=main.js.map
"use strict";
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = {
    production: false,
    froAppStartUrl: 'http://fro.mpp.test',
    //Test only
    // froAppStartUrl: 'http://localhost:5863',
    apiUrl: 'http://api.mpp.test',
    appVersion: 'Default',
    RecaptchaKey: '6LeMxRETAAAAAMB8GdvBwlNZooEE4UIuuAVf1JV2',
    RecaptchaVerifyUrl: 'https://www.google.com/recaptcha/api/siteverify',
    ParentPaymentsUrl: 'http://WWW.MPP.TEST'
};
//# sourceMappingURL=environment.js.map
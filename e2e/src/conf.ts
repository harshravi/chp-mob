import { browser, element, by, By, $, $$, ExpectedConditions, protractor } from 'protractor';


exports.config = {
    framework: 'jasmine',
    capabilities: {
        browserName: 'chrome'
    },
    seleniumAddress: 'http://localhost:4444/wd/hub',
    // You could set no globals to true to avoid jQuery '$' and protractor '$'
    // collisions on the global namespace.
    noGlobals: true,
    suites: {
        'bugs': [
            'bugs/1366.spec.js'
        ]
    },
    SELENIUM_PROMISE_MANAGER: false,
    beforeLaunch: function () {
        require('ts-node').register({
            project: '../'
        });
    },
    onPrepare: () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 180 * 1000;
        browser.ignoreSynchronization = true;
    }
};


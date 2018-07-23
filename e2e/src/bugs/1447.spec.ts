// var LoginUtil = require('../login/login-ch-director.js');
// var Util = require('../util/util.js');
// var q = require('Q');
// var _ = require('lodash');

import { browser, element, by, By, $, $$, ExpectedConditions, protractor, ElementArrayFinder, promise } from 'protractor';
import * as _ from 'lodash';
import { LoginSpecUtil } from '../login/login-ch-director';
import { Util } from '../util/util';

// spec.js
describe('Vitahealth - Bug fixing - 1447', function () {
    browser.driver.manage().window().maximize();

    const util = new Util();

    beforeAll(async function () {
        const loginUtilIns = new LoginSpecUtil();
        await loginUtilIns.loginAsChDirector();
    });

    it('should show the critical filtered result when click on the careplan card',
        async function () {

            await browser.driver.sleep(2000);


        });
});


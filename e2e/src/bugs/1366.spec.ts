// var LoginUtil = require('../login/login-ch-director.js');
// var Util = require('../util/util.js');
// var q = require('Q');
// var _ = require('lodash');

import { browser, element, by, By, $, $$, ExpectedConditions, protractor, ElementArrayFinder, promise } from 'protractor';
import * as _ from 'lodash';
import { LoginSpecUtil } from '../login/login-ch-director';
import { Util } from '../util/util';

// spec.js
describe('Vitahealth - Bug fixing - 1366', function () {
    browser.driver.manage().window().maximize();

    const util = new Util();

    beforeAll(async function () {
        const loginUtilIns = new LoginSpecUtil();
        await loginUtilIns.loginAsChDirector();
    });

    it('Check the compliance window for 1366 defect', async function () {

        await browser.driver.sleep(2000);

        const allComplianceEle = element.all(by.css('.datatable-row-wrapper .hdt-compliance-view'));

        const activeComplianceEle = allComplianceEle.filter(e => {

            const predicate = async () => {
                const classes = await e.getAttribute('class');

                if (classes.length === 0 || classes.indexOf('not-active') === -1) {
                    return true;
                } else {
                    return false;
                }
            };

            return predicate();
        });

        await browser.driver.sleep(1000);
        await util.clickFirstElement(activeComplianceEle);

        let disableAttrValue = null;

        const clickThrRightSidePanel = async () => {

            await util.clickFirstElement('[logtype="Intervention"] button');
            await util.clickFirstElement('[logtype="Intervention"] ul .checkbox-custom-label');

            browser.executeScript('$(".modal-body").scrollTop($(".modal-body").height())');

            const outcomeBtnEle = await util.getFirstElement('[logtype="Outcome"] button');

            await util.clickFirstElement('[logtype="Outcome"] button');

        };

        // check the checkbox - left side
        await util.clickFirstElement('app-intervention-compliance .checkbox-custom-label');

        await clickThrRightSidePanel();

        await util.clickFirstElement('[logtype="Outcome"] ul [for="cb-COMPLIANCE_DETERIORATION"]');

        let disabledInputEle = await util.getFirstElement('[logtype="Outcome"] ul [for="cb-COMPLIANCE_IMPROVEMENT"]');
        disableAttrValue = await disabledInputEle.element(by.xpath('..')).element(by.css('input')).getAttribute('disabled');

        // now the outcome SHOULD contain the disabled option
        expect(disableAttrValue).not.toBeNull();

        // uncheck the checkbox - left side
        await util.clickFirstElement('app-intervention-compliance .checkbox-custom-label');

        // check the checkbox - left side
        await util.clickFirstElement('app-intervention-compliance .checkbox-custom-label');
        await clickThrRightSidePanel();

        disabledInputEle = await util.getFirstElement('[logtype="Outcome"] ul [for="cb-COMPLIANCE_IMPROVEMENT"]');
        disableAttrValue = await disabledInputEle.element(by.xpath('..')).element(by.css('input')).getAttribute('disabled');


        // now the outcome SHOULD NOT contain the disabled option
        expect(disableAttrValue).toBeNull();

        await browser.driver.sleep(2000);
    });
});


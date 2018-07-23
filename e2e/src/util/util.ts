
import * as _ from 'lodash';
import {
    browser, element, by, By, $, $$, ExpectedConditions, protractor, ElementArrayFinder,
    ElementFinder
} from 'protractor';

export class Util {

    async clickFirstElement(inputEle: string | ElementArrayFinder) {
        let ele: ElementArrayFinder;

        if (typeof inputEle === 'string') {
            ele = element.all(by.css(inputEle));
        } else {
            ele = inputEle;
        }

        if ((await ele.count()) > 0) {
            await ele.first().click().then(() => {

            }, () => {
                browser.executeScript('arguments[0].click();', ele.first());
            });

            await browser.driver.sleep(2000);
        }

    }

    async getFirstElement(inputEle: string | ElementArrayFinder): Promise<ElementFinder> {
        let ele: ElementArrayFinder;

        if (typeof inputEle === 'string') {
            ele = element.all(by.css(inputEle));
        } else {
            ele = inputEle;
        }

        if ((await ele.count()) > 0) {
            return ele.first();
        }
    }


}


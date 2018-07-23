import { browser, element, by, By, $, $$, ExpectedConditions, protractor } from 'protractor';


export class LoginSpecUtil {
    async loginAsChDirector() {
        await browser.get('http://localhost:8080');

        const username = await element(by.css('input[formControlName=username]'));
        username.sendKeys('chdirector1@yandex.com');

        await element(by.css('input[formControlName=password]')).sendKeys('Alti@123');

        await element(by.buttonText('Login')).click();
        await browser.driver.sleep(2000);
    }
}



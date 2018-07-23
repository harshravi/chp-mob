import { browser, element, by, By, $, $$, ExpectedConditions, protractor } from 'protractor';

describe('login the user', function () {

    it('should enter username and password', () => {
        browser.get('http://localhost:8080');

        element(by.css('input[formControlName=username]')).sendKeys('chdirector1@yandex.com');
        element(by.css('input[formControlName=password]')).sendKeys('Alti@123');
        element(by.buttonText('Login')).click();

    });

});


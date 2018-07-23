

import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { CommonUtil } from '../utils';

@Directive({
    selector: '[appLungInputNumberValidation]'
})
export class AppLungInputNumberValidationDirective {

    @Input() validationCharExp: string = null;

    constructor(private el: ElementRef) {

    }

    @HostListener('keypress', ['$event']) onKeyDown(event) {
        const e = <KeyboardEvent>event;

        if (this.validationCharExp) {

            if (CommonUtil.isEscapingChar(e)) {
                return;
            }

            const keyCode = (typeof event.which === 'number') ? event.which : event.keyCode, ch = String.fromCharCode(keyCode);
            const regEx = new RegExp(this.validationCharExp);

            if (regEx.test(ch)) {
                return;
            } else {
                e.preventDefault();
            }
        }
    }

    @HostListener('keyup', ['$event']) onKeyUp(event) {
        const ele: any = this.el.nativeElement, val = ele.value;
        if (isNaN(val)) {
            ele.value = '';
        } else {
            if (ele.value && ele.value.indexOf('.') > -1) {
                const splittedVal: string[] = ele.value.split('.');

                if (splittedVal[1].length > 2) {
                    ele.value = splittedVal[0] + '.' + splittedVal[1].substring(0, 2);
                }
                else{
                    if ((parseInt(splittedVal[0]) < 1) && (parseInt(0. + splittedVal[1]) < 1)) {
                        ele.value = splittedVal[0] + '.';
                    } else if((parseInt(splittedVal[0]) >= 1) && (parseInt(0. + splittedVal[1]) < 1)){
                        ele.value = splittedVal[0] + '.' + splittedVal[1].substring(0, 2);
                    }                    
                }
            }
        }
    }

}

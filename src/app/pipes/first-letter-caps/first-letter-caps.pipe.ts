import { Pipe, PipeTransform } from '@angular/core';

/**
 * capitalize first leter of string
 */
@Pipe({name: 'capitalizeFirstLetter'})
export class firstLetterCapsPipe implements PipeTransform {

    transform(value:any) {
        if (value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
        return value;
    }

}

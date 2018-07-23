import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';


/**
 * Return default date format for App from a date string
 */
@Pipe({ name: 'defaultDateFormat' })
export class DefaultDateFormatPipe implements PipeTransform {
    transform<T>(value: T, formatType = 'dateOnly'): string {
        const datePipe = new DatePipe('en-US');
        //dateAndTime 
        const format = formatType === 'dateOnly' ? 'MMM dd y' : 'MMM dd y h:mm a';
        const transformedValue = datePipe.transform(value, format);
        return transformedValue;
    }
}


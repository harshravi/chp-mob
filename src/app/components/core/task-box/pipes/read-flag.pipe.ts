import { Pipe, PipeTransform } from '@angular/core';

/**
 * Expands the Event type from short form string
 */
@Pipe({ name: 'readFlag' })
export class ReadFlag implements PipeTransform {
    transform(value): string {
        if (value === 0) {
            return 'font-bold border-status-gray';
        } else if (value === 1) {
            return 'font-normal';
        }
    }
}

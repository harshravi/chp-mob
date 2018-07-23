import { Pipe, PipeTransform } from '@angular/core';

/**
 * Expands the Event type from short form string
 */
@Pipe({ name: 'criticalityColor' })
export class CriticalityColorPipe implements PipeTransform {
    transform(value): string {
        if (value === 0) {
            return 'text-navy';
        } else if (value === 1) {
            return 'text-warning';
        } else if (value === 2) {
            return 'text-danger';
        }
    }
}

import { Pipe, PipeTransform } from '@angular/core';
import { CommonUtil } from '../../utils/common.util';

/**
 * Expands the Event type from short form string
 */
@Pipe({ name: 'expandEventType' })
export class ExpandEventTypePipe implements PipeTransform {
    transform(value: ExpandEventTypePipeParam): string {
        let val;
        if (value.event_type === 'BG') {
            (value.event_valueExt === 'before') ? val = CommonUtil.limitDecimals(value.event_value) + ' ' + value.unit + ' ' + 'BEFORE MEAL' :
                val = CommonUtil.limitDecimals(value.event_value) + ' ' + value.unit + ' ' + 'AFTER MEAL';
        } else if (value.event_type === 'PEF') {
            val = CommonUtil.limitDecimals(value.event_value);

        } else if(value.event_type === 'WHBMI') {
             (value.event_valueExt === null || value.event_valueExt === '') ?
                val = CommonUtil.limitDecimals(value.event_value) + ' ' + value.unit  : val = CommonUtil.limitDecimals(value.event_value) + ' ' + value.unit + ' ' + '/ ' + CommonUtil.limitDecimals(value.event_valueExt);
        } else if (value.event_type === 'FVC') {
            val = CommonUtil.limitDecimals(value.event_value);

        } else if (value.event_type === 'FEV1') {
            val = CommonUtil.limitDecimals(value.event_value);

        } else {
            (value.event_valueExt === null || value.event_valueExt === '') ?
                val = CommonUtil.limitDecimals(value.event_value) : val = CommonUtil.limitDecimals(value.event_value) + '/' + CommonUtil.limitDecimals(value.event_valueExt);

        }
        return val;
    }
}

interface ExpandEventTypePipeParam {
    event_type: string;
    event_valueExt: string;
    event_value: string;
    unit: string;
}

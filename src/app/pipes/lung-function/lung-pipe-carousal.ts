import { Pipe, PipeTransform } from '@angular/core';

/**
 * capitalize first leter of string
 */
@Pipe({ name: 'formatLungData' })
export class FormatLungData implements PipeTransform {

    transform(value: Array<ICarousalData>, type: string) {
        if (type === 'values') {
            if (value) {
                if (value.length === 3) {
                    return value[1].value + ',' + value[2].value;
                } else if (value.length === 2) {
                    return value[0].value + ',' + value[1].value;
                } else {
                    return value[0].value;
                }
            }
        } else if (type === 'itemType') {
            let finalObj;
            if (value.length === 3) {
                finalObj = value[1].vitalType + ',' + value[2].vitalType;
            } else if (value.length === 2) {
                finalObj = value[0].vitalType + ',' + value[1].vitalType;
            } else {
                finalObj = value[0].vitalType;
            }
            return finalObj;
        }
    }

}

export interface ICarousalData {
    vitalType: string;
    value: string;
}

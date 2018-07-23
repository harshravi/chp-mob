import { Component, OnInit, Input } from '@angular/core';
import { DateUtilityService } from '../../../../../services';

@Component({
  selector: 'app-vitals',
  templateUrl: './vitals.component.html',
  styleUrls: ['./vitals.component.scss']
})
export class VitalsComponent implements OnInit {

  @Input() vitalName: String;
  @Input() vitalValue: any;
  @Input() vitalUnit: any;
  @Input() lastRecorded: any;
  @Input() vitalClass: any;
  @Input() participantStatus: any;

  constructor(private _dateUtilityService: DateUtilityService) { }

  ngOnInit() {
  }

  getExtValue(vital, value, unit) {
    switch (vital) {
      case 'Blood Pressure': let finalValue;
        (unit != null) ? (finalValue = '/' + value + ' ' + unit) : (finalValue = '/' + value);
        return finalValue;
      case 'Blood Glucose': if (value === 'before') {
        let finalVal;
        (unit != null) ? (finalVal = unit + ' Before Meal') : (finalVal = ' Before Meal');
        return finalVal;
      } else if (value === 'after') {
        let finalValueAfter;
        (unit != null) ? (finalValueAfter = unit + ' After Meal') : (finalValueAfter = ' After Meal');
        return unit + ' After Meal';
      } else {
        return '';
      }
      case 'Weight/BMI': if (value % 1 !== 0) {
        let weightFinalValue;
        (unit != null) ? (weightFinalValue = '/ ' + Number(value).toFixed(2) +
          ' ' + unit) : (weightFinalValue = '/ ' + Number(value).toFixed(2));
        return weightFinalValue;
      } else {
        let finalValueOther;
        (unit != null) ? (finalValueOther = '/ ' + value + ' ' + unit) : (finalValueOther = '/ ' + value);
        return '/ ' + value + ' ' + unit;
      }
    }
  }

  getVitalValue(item) {
    if (item.value === '-') {
      return ' - ';
    } else if (item.vital_type === 'Blood Oxygen') {
      let finalValue;
      (item.unit !== null) ? (finalValue = item.value + '' + item.unit) : (finalValue = item.value);
      return finalValue;
    } else if (item.vital_type === 'Blood Glucose') {
      if (item.value_ext === 'before') {
        let finalValue;
        (item.unit != null) ? (finalValue = item.value + ' ' + item.unit + ' Before Meal') : (finalValue = item.value + ' Before Meal');
        return finalValue;
      } else if (item.value_ext === 'after') {
        let finalValue;
        (item.unit != null) ? (finalValue = item.value + ' ' + item.unit + ' After Meal') : (finalValue = item.value + ' After Meal');
        return finalValue;
      } else {
        return ' - ';
      }
    } else if (item.vital_type === 'Weight/BMI') {
      if (item.value_ext === '-') {
        let finalValue;
        (item.unit != null) ? (finalValue = item.value + ' ' +
          item.unit + ' / ' + item.value_ext) : (finalValue = item.value + '/ ' + item.value_ext);
        return finalValue;
      } else if (item.value_ext % 1 !== 0) {
        let finalValue;
        (item.unit != null) ? (finalValue = item.value + ' ' +
          item.unit + ' / ' + Number(item.value_ext).toFixed(2)) : (finalValue = item.value + '/ ' + Number(item.value_ext).toFixed(2));
        return finalValue;
      } else {
        let finalValue;
        (item.unit != null) ? (finalValue = item.value +
          ' ' + item.unit + ' / ' + item.value_ext) : (finalValue = item.value + '/ ' + item.value_ext);
        return finalValue;
      }
    } else if (item.vital_type === 'Lung Function') {
      let finalValue = '';
      if (item.value !== null && item.value_ext !== null && item.value_ext2 !== null) {
        finalValue = item.value_ext + ' , ' + item.value_ext2;
      } else {
        if (item.value !== null) {
          finalValue = finalValue + item.value;
        }
        if (item.value_ext !== null) {
          if (finalValue !== '') {
            finalValue = finalValue + ',' + item.value_ext;
          } else {
            finalValue = finalValue + item.value_ext;
          }
        }
        if (item.value_ext2 !== null) {
          if (finalValue !== '') {
            finalValue = finalValue + ',' + item.value_ext2;
          } else {
            finalValue = finalValue + item.value_ext2;
          }
        }
      }
      // finalValue = item.value_ext + ' , ' + item.value_ext2;
      return finalValue;
    } else {
      if (item.value_ext !== null && item.value_ext !== '') {
        let finalValue;
        if (item.vital_type === 'Blood Pressure') {
          (item.unit !== null) ? (finalValue = item.value + '/' + item.value_ext + ' ' +
            item.unit) : (finalValue = item.value + '/' + item.value_ext);
          return finalValue;
        } else {
          (item.unit !== null) ? (finalValue = item.value + ' ' +
            item.unit + '/ ' + item.value_ext) : (finalValue = item.value + '/' + item.value_ext);
          return finalValue;
        }
      } else {
        let finalValue;
        (item.unit !== null) ? (finalValue = item.value + ' ' + item.unit) : (finalValue = item.value);
        return finalValue;
      }
    }
  }

  getVitalDate(date1, date2) {
    if (date1.search('Today') === 0) {
      return 'Today';
    } else if (date1.search('Yesterday') === 0) {
      return 'Yesterday';
    } else {
      return date2;
    }
  }

  getVitalValueForLung(item) {
    if (item.vital_desc) {
      if ((item.vital_desc).includes('PEF') && (item.vital_desc).includes('FEV1') && (item.vital_desc).includes('FVC')) {
        return 'FEV1,FVC';
      } else {
        return item.vital_desc;
      }
    }
  }
  
}
import { Component, ViewChild, ElementRef, Input, forwardRef, AfterViewInit, EventEmitter, Output, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IPickadayOption } from './model/datepicker.model';
import { StopPropagationEmitterService } from '../../../services/EventEmitter/stop-propagation-emitter.service';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    }
  ]
})
export class DatepickerComponent implements AfterViewInit {
  @ViewChild('datepicker') private datepicker: ElementRef;

  _minDate: any;
  _maxDate: any;
  propagationStoppedId: number;
  pickADay: any;
  skipUpdateModel: boolean;
  _disabled: boolean;

  @Input('value') _value: number;
  @Input('format') format: string;

  @Input('minDate')
  set minDateValue(value: any) {
    this._minDate = value;
    if (this.pickADay && moment.prototype.isPrototypeOf(value)) {
      this.pickADay.setMinDate(value.toDate());
    }
  }

  @Input('maxDate')
  set maxDateValue(value: any) {
    this._maxDate = value;
    if (this.pickADay && moment.prototype.isPrototypeOf(value)) {
      this.pickADay.setMaxDate(value.toDate());
    }
  }

  @Input('disabled')
  set setDisabled(value: boolean) {
    this._disabled = value;
    //.datepicker("option", "disabled", true);
  }

  @Input() currentDate: any;

  @Output()
  onChangeEvt = new EventEmitter<number>();

  @Output()
  onClose = new EventEmitter<boolean>();

  onChange: any = () => { };
  onTouched: any = () => { };


  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.onTouched();
    this.onChange(val);
  }


  constructor(private _stopPropagationEmitterService: StopPropagationEmitterService) {
    // this._minDate = moment(new Date());
    this._stopPropagationEmitterService = (<any>window).stopPropagationEmitterService;
    this._stopPropagationEmitterService.propagationStoppedObservable.subscribe(subPropagationStoppedId => {

      if (subPropagationStoppedId !== this.propagationStoppedId) {
        this.pickADay.hide()
      }
    });
  }

  ngAfterViewInit() {
    this.propagationStoppedId = new Date().getTime();

    this.pickADay = new Pikaday({
      field: this.datepicker.nativeElement,
      format: this.format,
      minDate: (this._minDate ? moment(this._minDate).toDate() : null),
      maxDate: (this._maxDate ? moment(this._maxDate).toDate() : null),
      onSelect: (date) => {
        this.value = moment(date); // moment(date).unix()
        this.onChangeEvt.emit(this.value);
      },
      onClose: (date) => {
        this.onClose.emit(true);
      },
      onOpen: () => {
        if (this._disabled) {
          this.pickADay.hide();
        }

        if (!this.value) {
          this.pickADay.setDate(new Date());
          this.value = null;
        }
      },
      yearRange: 200
    });
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  writeValue(value) {
    if (value !== undefined) {
      this.value = value;
    }
  }
  changeDate() {
  }
}

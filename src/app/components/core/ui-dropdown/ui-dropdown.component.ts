import { Component, ViewChild, ElementRef, Input, forwardRef, AfterViewInit, EventEmitter, Output, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-ui-dropdown',
  templateUrl: './ui-dropdown.component.html',
  styleUrls: ['./ui-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiDropdownComponent),
      multi: true
    }
  ]
})
export class UiDropdownComponent implements ControlValueAccessor, OnInit {
  _value: any;

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor() { }

  ngOnInit() {
  }

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  writeValue(value) {
    if (value !== undefined) {
      this.value = value;
    }
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

}

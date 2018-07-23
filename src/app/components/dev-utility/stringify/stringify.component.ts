import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-stringify',
  templateUrl: './stringify.component.html',
  styleUrls: ['./stringify.component.scss']
})
export class StringifyComponent implements OnInit, OnChanges {

  /** Input value to be Stringified */
  @Input() object: any = {};

  /**
   * Instance Variables for Data Binding
   */
  stringifiedObject: String;

  constructor() { }

  ngOnInit() {
    this.stringifiedObject = JSON.stringify(this.object);
  }

  ngOnChanges() {
    this.stringifiedObject = JSON.stringify(this.object);
  }

}

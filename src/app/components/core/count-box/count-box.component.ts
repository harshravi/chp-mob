import { Component, OnInit, Input } from '@angular/core';
import { ICountBox } from './count-box.interface';

@Component({
  selector: 'app-count-box',
  templateUrl: './count-box.component.html',
  styleUrls: ['./count-box.component.scss']
})
export class CountBoxComponent implements OnInit, ICountBox {
  @Input()
  countValue: number;
  @Input()
  displayText: string;
  @Input()
  colorOfBox: string;
  @Input()
  colorOfBoxText: string;
  @Input()
  headingTextForBox: string;
  @Input()
  countSymbol: string;
  @Input()
  borderOfBox: string;
  constructor() { }

  ngOnInit() {
  }

}

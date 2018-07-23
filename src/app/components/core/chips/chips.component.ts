import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss']
})
export class ChipsComponent implements OnInit {

  /** Array of Chips, A place where the chips will be stored*/
  @Input() chips = [];

  /** Style of the Chips to be injected as a string */
  @Input() styleClassForChips: string;

  constructor() { }

  ngOnInit() { }

}

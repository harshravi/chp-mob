import { Component, OnInit, Input } from '@angular/core';
import { CommonUtil } from '../../../../../utils';

@Component({
  selector: 'app-careplan',
  template: `<li><i class="fa fa-circle p-r-sm" [ngClass]="commonUtils.getColorCodeForCarePlanCompliacne(careplanStatus)">
  </i>{{careplanValue}}</li>`,
  styleUrls: ['./careplan.component.scss']
})
export class CareplanComponent implements OnInit {
  @Input() careplanValue;
  @Input() careplanStatus;
  commonUtils = CommonUtil;
  constructor() { }

  ngOnInit() {
  }

}

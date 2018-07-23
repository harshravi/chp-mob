import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-diagnosis',
  templateUrl: './diagnosis.component.html',
  styleUrls: ['../vitals/vitals.component.scss']
})
export class DiagnosisComponent implements OnInit {

  @Input() diagnosisValue: any;

  constructor() { }

  ngOnInit() {
  }

}

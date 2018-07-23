import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  @Input('height')  height = 30;
  @Input('status') width: number = 50;
  @Input('value')  value: any;
  @Input('basecolor')  basecolor = 'grey';
  @Input('background')  background = 'green';
  @Input('proressPerColor')  proressPerColor = 'green';
  @Input('proressTextColor')  proressTextColor = 'green';
  @Input('symbol')  symbol = '%';
  @Input('progressBarTitle')  progressBarTitle;
  constructor() { }

  ngOnInit() {
  }

}

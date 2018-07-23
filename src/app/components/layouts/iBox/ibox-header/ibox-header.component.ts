import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ibox-header',
  templateUrl: './ibox-header.component.html',
  styleUrls: ['./ibox-header.component.scss']
})
export class IboxHeaderComponent implements OnInit {

  @Input()
  cardName: string;

  constructor() { }

  ngOnInit() {
  }

}

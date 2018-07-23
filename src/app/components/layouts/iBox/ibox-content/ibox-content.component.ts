import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ibox-content',
  templateUrl: './ibox-content.component.html',
  styleUrls: ['./ibox-content.component.scss']
})
export class IboxContentComponent implements OnInit {
  @Input()
  styleClassForContent: string;
  constructor() { }

  ngOnInit() {
  }

}

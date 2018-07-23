import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

  @Input() tags;
  @Input() resetFlag;
  @Output() removeItem = new EventEmitter();
  @Output() resetItems = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }
  remove(tag) {
    this.removeItem.emit(tag);
  }

  reset() {
    this.tags = [];
    const isReset = true;
    this.resetItems.emit(isReset);
  }

}

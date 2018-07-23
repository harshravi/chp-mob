import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-category-box',
  templateUrl: './category-box.component.html',
  styleUrls: ['./category-box.component.scss']
})
export class CategoryBoxComponent implements OnInit {

  /** Variable carrying the Category Data */
  @Input() categoryData;

  /** Emits the selected list each time select option is called */
  @Output() selectedList = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  /**
   * This function will take the input name and options and spit out the Selected List
   */
  selectedOption(name, option) {
    const obj = {
      category: name,
      option: option
    };
    this.selectedList.emit(obj);
  }

}

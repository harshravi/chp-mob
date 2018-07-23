import { Component, OnInit,OnChanges, SimpleChange, Input, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { TabComponent } from '../tab';
@Component({
  selector: 'app-tabset',
  templateUrl: './tabset.component.html',
  styleUrls: ['./tabset.component.scss']
})
export class TabsetComponent implements OnInit, AfterContentInit  {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  constructor() { }

  ngOnInit() {
  }
  @Input() uniqueId:any;
  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    const activeTabs = this.tabs.filter((tab) => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: TabComponent) {
    // deactivate all tabs
    this.tabs.toArray().forEach(data => data.active = false);

    // activate the tab the user has clicked on.
    tab.active = true;
  }
  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (changes['listData'] !== this.uniqueId) {
      setTimeout(() => {
        this.selectTab(this.tabs.first);
      },1000);
    }
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsetComponent } from './tabset';
import { TabComponent } from './tab';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TabsetComponent,
    TabComponent
  ],
  exports: [
    TabsetComponent,
    TabComponent
  ]
})
export class TabModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IboxContentComponent } from './ibox-content.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    IboxContentComponent
  ],
  exports: [
    IboxContentComponent
  ]
})
export class IboxContentModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipsComponent } from './chips.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ChipsComponent
  ],
  exports: [
    ChipsComponent
  ]
})
export class ChipsModule { }

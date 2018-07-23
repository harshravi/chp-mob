import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StringifyComponent } from './stringify.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    StringifyComponent
  ],
  exports:[
    StringifyComponent
  ]
})
export class StringifyModule { }

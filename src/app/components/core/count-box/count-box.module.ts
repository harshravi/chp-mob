import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountBoxComponent } from './count-box.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CountBoxComponent
  ],
  exports: [
    CountBoxComponent
  ]
})
export class CountBoxModule { }
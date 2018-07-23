import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IboxContainerComponent } from './ibox-container.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    IboxContainerComponent
  ],
  exports:[
    IboxContainerComponent
  ]
})
export class IboxContainerModule { }

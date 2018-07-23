import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientDropDownComponent } from './dropdown.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ClientDropDownComponent
  ],
  exports: [
    ClientDropDownComponent
  ]
})
export class ClientDropDownModule { }

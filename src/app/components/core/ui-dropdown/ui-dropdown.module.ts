import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiDropdownComponent } from './ui-dropdown.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [UiDropdownComponent],
  exports: [UiDropdownComponent]
})
export class UiDropdownModule { }

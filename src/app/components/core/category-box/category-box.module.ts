import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryBoxComponent } from './category-box.component';

@NgModule({
  imports: [ CommonModule ],
  declarations: [
    CategoryBoxComponent
  ],
  exports: [
    CategoryBoxComponent
  ]
})
export class CategoryBoxModule { }
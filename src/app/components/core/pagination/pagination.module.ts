import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VHPagination } from './pagination.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    VHPagination
  ],
  exports: [
    VHPagination
  ]
})
export class VHPaginationModule { }

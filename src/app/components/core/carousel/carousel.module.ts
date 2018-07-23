import { NgModule } from '@angular/core';
import { CarouselSetComponent } from './carousel-set';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    CarouselSetComponent
  ],
  declarations: [
    CarouselSetComponent
  ]
})
export class CarouselModule { }
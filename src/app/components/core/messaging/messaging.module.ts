import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagingComponent } from './messaging.component';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MessagingComponent
  ],
  exports:[
    MessagingComponent
  ]
})
export class MessagingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComboBoxComponent } from './combo-box.component';
import { FormsModule } from '@angular/forms';
import { StopPropagationEmitterService } from '../../../services/EventEmitter/stop-propagation-emitter.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [ComboBoxComponent],
  exports: [ComboBoxComponent],
  providers: [
    { provide: StopPropagationEmitterService, useValue: window.stopPropagationEmitterService }
  ]
})
export class ComboBoxModule { }

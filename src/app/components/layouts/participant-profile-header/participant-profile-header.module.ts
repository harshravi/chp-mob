import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipantProfileHeaderComponent } from './participant-profile-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CountBoxModule } from '../../core/count-box';
import { TagsModule } from '../../core/tags';
import { AppPipeModule } from '../../../pipes/app-pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CountBoxModule,
    TagsModule,
    AppPipeModule
  ],
  declarations: [ParticipantProfileHeaderComponent],
  exports: [ParticipantProfileHeaderComponent]
})
export class ParticipantProfileHeaderModule { }

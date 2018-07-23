import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHeaderComponent } from './dashboard-header.component';
// import { ParticipantProfileHeaderComponent } from '../participant-profile-header/participant-profile-header.component';
import { ParticipantProfileHeaderModule } from '../participant-profile-header';
import { CountBoxModule } from '../../core/count-box';

@NgModule({
  imports: [
    CommonModule,
    CountBoxModule,
    ParticipantProfileHeaderModule
  ],
  declarations: [
    DashboardHeaderComponent
  ],
  exports: [
    DashboardHeaderComponent
  ]
})
export class DashboardHeaderModule { }

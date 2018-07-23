import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';

/** Importing Components Necessary for the module */
import { ErrorMessagesModule } from '../../components/core/error-messages';

import { AdminRoutingModule } from './admin-routing.module';
import { MchRegistrationComponent } from './mch-registration/mch-registration.component';
import { AdminComponent } from './admin.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ErrorMessagesModule,
    AdminRoutingModule,
    FormsModule,
    TextMaskModule
  ],
  declarations: [AdminComponent,MchRegistrationComponent],
  exports: [FormsModule, ReactiveFormsModule, TextMaskModule]
})
export class AdminModule { }
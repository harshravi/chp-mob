import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

/** Importing Components Necessary for the module */
import { ErrorMessagesModule } from '../../components/core/error-messages';

import { AuthRoutingModule, routingComponents } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { PhysicianRegisterComponent } from './physician-register/physician-register.component';
import { OTPComponent } from './OTP/otp.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ErrorMessagesModule,
    AuthRoutingModule
  ],
  declarations: [AuthComponent, LoginComponent, PhysicianRegisterComponent, OTPComponent, routingComponents]
})
export class AuthModule { }

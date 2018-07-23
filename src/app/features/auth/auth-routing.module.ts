import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PhysicianRegisterComponent } from './physician-register/physician-register.component';
import { OTPComponent } from './OTP/otp.component';

const routes: Routes = [
    { path: 'register-invited/:id', component: PhysicianRegisterComponent },
    { path: 'otp', component: OTPComponent },
    { path: 'login', component: LoginComponent },
    { path: '', component: LoginComponent }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class AuthRoutingModule { }
export const routingComponents = [PhysicianRegisterComponent, OTPComponent, LoginComponent]

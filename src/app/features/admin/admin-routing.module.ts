import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MchRegistrationComponent } from './mch-registration/mch-registration.component';
import { CanActivateViaAuthGuard } from './../../config/guards/can-activate';

const routes: Routes = [
  { path: 'register-mch', component: MchRegistrationComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CanActivateViaAuthGuard]
})
export class AdminRoutingModule { }
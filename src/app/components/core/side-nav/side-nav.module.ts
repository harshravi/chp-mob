import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavComponent } from './side-nav.component';
import { Routes, RouterModule } from '@angular/router';
import { AppPipeModule } from '../../../pipes/app-pipe.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AppPipeModule
  ],
  declarations: [
    SideNavComponent
  ],
  exports: [
    SideNavComponent
  ],
  providers: []
})
export class SideNavModule { }

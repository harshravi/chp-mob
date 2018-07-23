import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header.component';
import { TabModule } from '../tab';
import { TaskBoxModule } from '../task-box';
import { ComboBoxModule } from '../combo-box';
import { TaskListModule } from '../../layouts/task-list';
import { HomeRoutingModule } from '../../../features/home/home-routing.module';

@NgModule({
  imports: [
    CommonModule,
    TabModule,
    TaskBoxModule,
    ComboBoxModule,
    FormsModule,
    TaskListModule,
    HomeRoutingModule
  ],
  declarations: [
    HeaderComponent
  ],
  exports: [
    HeaderComponent
  ]
})
export class HeaderModule { }

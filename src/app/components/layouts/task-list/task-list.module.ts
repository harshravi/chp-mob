import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TaskListComponent } from './task-list.component';
import { TaskBoxModule } from '../../core/task-box';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TaskBoxModule
  ],
  declarations: [TaskListComponent],
  exports: [TaskListComponent]
})

export class TaskListModule { }

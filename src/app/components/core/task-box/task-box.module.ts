import { NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskBoxComponent } from './task-box.component';
import { CheckBoxModule } from '../check-box';
import { ChipsModule } from '../chips';

// import pipes
import { AppPipeModule } from '../../../pipes/app-pipe.module';

import { ReadFlag } from './pipes/read-flag.pipe';

@NgModule({
  imports: [
    CommonModule,
    CheckBoxModule,
    ChipsModule,
    AppPipeModule,
    RouterModule,
    FormsModule
  ],
  declarations: [TaskBoxComponent, ReadFlag],
  exports: [TaskBoxComponent]
})
export class TaskBoxModule { }

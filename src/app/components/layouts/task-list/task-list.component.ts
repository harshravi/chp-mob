import { Component, OnInit, Input, OnChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { IVitalTasks } from './model/task-list.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnChanges {

  @Input() tasksList: IVitalTasks[];
  @Input() showTaskMsg: boolean;
  @Input() textboxDetail;
  @Output() selectedParticipant= new EventEmitter();
  @Output() selectedItem = new EventEmitter();
  @Output() enteredPatientName = new EventEmitter();
  @Output() reassignOpenOrClosed = new EventEmitter();
  @Output() selected = new EventEmitter();

  vitalTasks = [];
  current: number = 0;
  constructor() {
    this.showTaskMsg = false;
   }

  ngOnInit() {
  }

  /** selected task */
  selectedTask(item) {
    this.selectedItem.emit(item);
  }
  selectedParticipantDetails(item){
    this.selectedParticipant.emit(item);
  }
  /** selected Patient */
  patientName(item){
    this.enteredPatientName.emit(item);
  }
  //** checking reassign modal is open or closed */
  checkReassign(item){
    this.reassignOpenOrClosed.emit(item);
  }
  ngOnChanges(changes: { [propName: string]: SimpleChange }) {

    if (changes['tasksList'] !== undefined) {
      this.vitalTasks = this.tasksList;
    }

  }

}

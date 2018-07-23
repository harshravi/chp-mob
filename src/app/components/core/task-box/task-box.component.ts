import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { DateUtilityService } from '../../../services';

@Component({
    selector: 'app-task-box',
    templateUrl: './task-box.component.html',
    styleUrls: ['./task-box.component.scss']
})
export class TaskBoxComponent implements OnInit, OnChanges {

    @Input() taskDetails;
    @Input() indexNo;
    @Input() current;
    @Input() textBoxDetails;
    @Output() selectedItem = new EventEmitter();
    @Output() enteredPatientName = new EventEmitter();
    @Output() selectedParticipant = new EventEmitter();
    @Output() reassignOpenOrClosed = new EventEmitter();
    @Input() showCarePlan;

    @Output() selectedVital = new EventEmitter();

    selectedArray: any = [];
    obj: number;
    notActive: string;
    reassignText: string;
    participantDetails;
    selectedName: string;
    dissableReassignBtn: boolean;
    showReassignTextbox: boolean;
    highlightedSearchedRow: number;
    // To display participant short name on task card
    participantName: string;
    displayName: string;

    constructor(private _dateUtilityService: DateUtilityService) { }

    ngOnInit() {
        this.displayNameText();
        this.showReassignTextbox = false;
        this.dissableReassignBtn = true;
        this.reassignText = 'Reassign';
    }
    // text which is enterd into text field
    patientName(item, taskDetails) {
        item.participantDetails = taskDetails;
        this.enteredPatientName.emit(item);
    }

    viewDetail(item) {
        this.selectedItem.emit(item);
    }
    patientSelectionBox(openOrClose) {
        this.reassignText = 'Reassign';
        if (this.textBoxDetails) {
            this.textBoxDetails.care_team = [];
            this.selectedName = '';

        }
        this.reassignOpenOrClosed.emit(openOrClose);
        this.current = this.indexNo;
        if(this.current === this.indexNo){
            this.reassignText = 'Reassign To';
            this.notActive = 'not-active';
        }
        this.showReassignTextbox = openOrClose;
        this.dissableReassignBtn = true;
        if (openOrClose === false) {
            this.showReassignTextbox = false;
            this.current = null;
            this.highlightedSearchedRow = null;
            this.reassignText = 'Reassign';
            this.selectedName = '';
            this.notActive = 'noStyle';
        }
    }
    clearTextBox() {
        this.selectedName = "";
        this.dissableReassignBtn = true;
        this.highlightedSearchedRow = null;
        if (this.textBoxDetails) {
            this.textBoxDetails.care_team = [];
        }        
    }
    selectedParticipantDetails(patientDetails, taskDetails) {
        this.dissableReassignBtn = false;
        patientDetails.participantDetails = taskDetails;
        this.participantDetails = patientDetails;
        this.selectedName = patientDetails.staff_name;
    }

    reassignActionPlan() {
        if (this.participantDetails) {
            this.selectedParticipant.emit(this.participantDetails)
            this.showReassignTextbox = false;
            this.highlightedSearchedRow = null;
            this.reassignText = 'Reassign';
            this.selectedName = '';
            this.notActive = 'noStyle';
            this.textBoxDetails.care_team = [];
        }
    }
    toggleHighlightSearch(newValue: number) {
        this.highlightedSearchedRow = newValue;
    }
    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    }

    vitalChecked(item) {
        const lastValue: number = this.selectedArray.length - 1;
        let obj: any;
        if (this.selectedArray.length === 0) {
            this.selectedArray.push(item);
        } else {
            for (obj in this.selectedArray) {
                if (this.selectedArray[obj].task_id === item.task_id) {
                    this.selectedArray.splice(obj, 1);
                } else if (obj === lastValue) {
                    this.selectedArray.push(item);
                }
            }
        }
        this.selectedVital.emit(this.selectedArray);
    }

    getPaddingClass() {
        let classDetail;
        (!this.showCarePlan) ? classDetail = 'm-sm' : classDetail = '';
        return 'm-sm';
    }

    // To display participant short name on task card
    displayNameText() {
        this.participantName = this.taskDetails.participant_name;
        const temp = this.participantName.split(' ');
        this.displayName = temp[0].charAt(0) + temp[temp.length - 1].charAt(0);
    }
}

import { Component, OnInit, OnChanges, Input, SimpleChange } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { InterventionModalContext } from './intervention-modal-context';
import { ToasterService } from 'angular2-toaster';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { InterventionService } from './intervention.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { _ } from 'underscore';
import { SnoozeType, SnoozeTypeEnum, SymptomType, SymptomTypeEnum } from '../../../../models/common.model';
import { IUserDetail } from '../../../../models';
import { InterventionUtil } from './util/intervention.util';
import { DateUtilityService } from '../../../../services';


@Component({
    selector: 'app-intervention',
    templateUrl: './intervention.component.html',
    styleUrls: ['./intervention.component.scss'],
    providers: [InterventionService]
})
export class InterventionComponent implements OnInit, OnChanges, CloseGuard, ModalComponent<InterventionModalContext> {

    @Input() uniqueId: any;
    context: InterventionModalContext;
    participantId = '';
    participatData: any = {};
    interventionList: any = {};
    tasksSelected: Array<any> = [];
    showForm = false;
    snoozeType: SnoozeTypeEnum = SnoozeType.HOURS;
    snooze_duration = null;
    showSnooze = false;
    showAssign = false;
    showOutreach = false;
    errorMessage = null;
    vitalsSelected = [];
    snoozeDropdown = ['hours', 'days'];
    userdetails: IUserDetail = this._storage.get<IUserDetail>('userdetails');
    conditionsList = [];
    conditionsCount = 0;
    right_diabled = false;
    left_disabled = false;
    isDataLoading: boolean;
    // To show confirm message
    showConfirmMsg = false;
    snoozeDurationTouched = false;
    isSubmitBtnDisabled = false;
    disableSave = false;

    constructor(public dialog: DialogRef<InterventionModalContext>, private _toasterService: ToasterService,
        private _inteventionService: InterventionService, private _storage: LocalStorageService,
        private _dateUtilityService: DateUtilityService) {
        this.context = dialog.context;
        this.participantId = this.context.participantId;
    }

    ngOnInit() {

        this.getVitalTasks();
        // this.getInterventionList();
        this._inteventionService.updateReadFlagForTasks(this.participantId);
    }

    ngOnChanges() {

    }

    /** Closeing modal window */
    closeInterventionModal(data) {
        if (this.showForm && data !== 'saved') {
            this.showConfirmMsg = true;
        } else {
            this.dialog.close(data);
        }
    }

    /** Vitals in modal window checked or unchecked */
    vitalChecked(data) {
        // this.tasksSelected = [];
        if (data.selected) {

            if (!_.some(this.tasksSelected, val => val === data.task_id)) {
                this.tasksSelected.push(data.task_id);
            }

            if (!_.some(this.vitalsSelected, val => val === data.event_type_desc)) {
                this.vitalsSelected.push(data.event_type_desc);
            }

            /** Selectg all the vitals if one is selected */
            if (data.vital_type === 'LUNG') {
                this.participatData.vitalDetails.filter(item => {
                    if (item.vital_type === 'LUNG') {
                        item.selected = true;
                        this.tasksSelected.forEach((element, index) => {
                            if (element !== item.task_id && index === this.tasksSelected.length - 1) {
                                if (!_.contains(this.tasksSelected, item.task_id)) {
                                    this.tasksSelected.push(item.task_id);
                                    this.vitalsSelected.push(item.event_type_desc);
                                }
                            }
                        });
                    }
                });
            }

        } else {
            let obj: any = 0;
            for (obj in this.tasksSelected) {
                if (data.task_id === this.tasksSelected[obj]) {
                    this.tasksSelected.splice(obj, 1);
                }
            }

            for (obj in this.vitalsSelected) {
                if (data.event_type_desc === this.vitalsSelected[obj]) {
                    this.vitalsSelected.splice(obj, 1);
                }
            }

            /** uncheck all the vitals if one is selected */
            if (data.vital_type === 'LUNG') {
                this.participatData.vitalDetails.filter(item => {
                    if (item.vital_type === 'LUNG') {
                        item.selected = false;
                        this.tasksSelected.forEach((element, index) => {
                            if (element !== item.task_id && index === this.tasksSelected.length - 1) {
                                this.tasksSelected.splice(obj, 1);
                                this.vitalsSelected.splice(obj, 1);
                            }
                        });
                    }
                });
            }
        }

        if (this.tasksSelected.length === 0) {
            this.showForm = false;
            this.clearAllFields();
            this.resetOutreach();
        } else {
            this.showForm = true;
        }
        this.interventionList.task_ids = this.tasksSelected;
    }

    // reset options for outcome reach combo box
    resetOutreach() {
        this.snoozeDurationTouched = false;
        _.forEach(this.interventionList.outcome_types, val => {
            val.selected_flag = false;
            val.isDisabled = false;
        });
    }

    /** Get Class based on symptom assessment status  */
    getSymptomClass(id: number): SymptomTypeEnum {
        switch (id) {
            case 0: return SymptomType.NORMAL;
            case 1: return SymptomType.ALERT;
            case 2: return SymptomType.DANGER;
        }
    }

    /** Get Task list based on participant */
    getVitalTasks() {
        this.dataLoadingStarted();
        this._inteventionService.getVitalTasks(this.participantId).then(data => {
            if (data.overall_seizure_counts > 0) {
                this.getInterventionListForSiezure();
                this.showForm = true;
            } else {
                this.getInterventionList();
            }
            this.dataLoadingCompleted();
            this.participatData = data;
            this.getConditionsList();
            this.arrowdisabled();
        }, error => {
            this.dataLoadingCompleted();
        });
    }

    /** get Intervention list for dropdown values */
    getInterventionList() {
        const reqData = { participant_id: this.participantId, outreaching_agent_id: this.userdetails.id };
        this._inteventionService.getInterventionList(reqData).then(data => {
            this.interventionList = data;
        });
    }

    /** get Intervention list for dropdown values */
    getInterventionListForSiezure() {
        const reqData = { participant_id: this.participantId, outreaching_agent_id: this.userdetails.id };
        this._inteventionService.getInterventionListForSiezure(reqData).then(data => {
            this.interventionList = data;
        });
    }

    /** Clear all the Interventioin List fields */
    clearAllFields() {
        this.interventionList.assigned_to_staff_id = null;
        this.interventionList.intervention_notes = null;
        this.interventionList.outreaching_agent_id = null;
        this.interventionList.selected_outcome_types = null;
        this.interventionList.selected_intervention_types = null;
        this.interventionList.selected_outreach_type_cd = null;
        this.snoozeType = SnoozeType.HOURS;
        this.snooze_duration = null;
        this.showSnooze = false;
        this.showAssign = false;
        this.showOutreach = false;
        this.errorMessage = null;
        this.showForm = false;
        this.vitalsSelected = [];
        this.tasksSelected = [];
        if (this.interventionList.intervention_types !== undefined) {
            for (const obj of this.interventionList.intervention_types) {
                obj.selected_flag = null;
            }
        }
        if (this.interventionList.outcome_types !== undefined){
            for (const obj of this.interventionList.outcome_types) {
                obj.selected_flag = null;
                obj.snooze_duration = null;
            }
        }
    }

    /** Options selected in intervention dropdown */
    optionSelected(item, id) {
        this.disableReAssignOption();
        this.errorMessage = null;
        this.snoozeDurationTouched = false;
        this.isSubmitBtnDisabled = false;
        if (id === 'outcome') {


            const selectedOption: any[] = _.filter(this.interventionList.outcome_types,
                (val: any) => val.selected_flag === true);

            const requiredOptions = _.filter(selectedOption, val =>
                (val.outcome_type_group === 'DETERIORATION_GROUP' || val.outcome_type_group === 'IMPROVEMENT_GROUP'))


            if (requiredOptions && requiredOptions.length) {

                const isImprovementGrpSelected: boolean = _.some(requiredOptions, val => val.outcome_type_group === 'IMPROVEMENT_GROUP');
                const isDeteriorationGrpSelected: boolean =
                    _.some(requiredOptions, val => val.outcome_type_group === 'DETERIORATION_GROUP');

                if (isImprovementGrpSelected) {
                    _.forEach(this.interventionList.outcome_types, (val) => {
                        if (val.outcome_type_group === 'DETERIORATION_GROUP') {
                            val.isDisabled = true;
                        } else {
                            val.isDisabled = false;
                        }
                    });
                } else if (isDeteriorationGrpSelected) {
                    _.forEach(this.interventionList.outcome_types, (val) => {
                        if (val.outcome_type_group === 'IMPROVEMENT_GROUP') {
                            val.isDisabled = true;
                        } else {
                            val.isDisabled = false;
                        }
                    });
                }
            } else {
                _.forEach(this.interventionList.outcome_types, (val) => {
                    if (val.outcome_type_group === 'REASSIGN_GROUP') {
                        if (this.interventionList.assign_to_users.length === 0) {
                            val.isDisabled = true;
                        } else {
                            val.isDisabled = false;
                        }
                    } else {
                        val.isDisabled = false;
                    }
                });
            }

            for (const obj of this.interventionList.outcome_types) {
                /** updating snooze_duration in the object */
                if (obj.outcome_type_cd === 'PENDING_REMIND_LATER') {
                    if (obj.selected_flag) {
                        this.showSnooze = true;
                        this.showAssign = false;
                        this.errorMessage = '';
                        obj.snooze_duration = this.snooze_duration;
                        obj.snooze_duration_type = this.snoozeType;
                    } else {
                        obj.snooze_duration = null;
                    }
                    if (this.snoozeDurationTouched) {
                        this.errorMessage = '';

                        if (obj.snooze_duration_type === 'hours' && !(obj.snooze_duration > 0 && obj.snooze_duration < 73)) {
                            this.errorMessage = 'Please enter snooze duration between 1 and 72 hours';
                            this.isSubmitBtnDisabled = true;
                        } else if (obj.snooze_duration_type === 'days' && !(obj.snooze_duration > 0 && obj.snooze_duration < 4)) {
                            this.errorMessage = 'Please enter snooze duration between 1 and 3 days';
                            this.isSubmitBtnDisabled = true;
                        } else {
                            this.isSubmitBtnDisabled = false;
                        }
                    }

                } else if (obj.outcome_type_cd === 'PENDING_REASSIGN') {
                    if (!obj.selected_flag) {
                        this.interventionList.assigned_to_staff_id = null;
                    } else {
                        this.snooze_duration = null;
                    };

                } else if (obj.outcome_type_cd === '') {

                }

                /** updating Re Assign details */
                if (obj.selected_flag) {
                    if (obj.outcome_type_cd === 'PENDING_REASSIGN') {
                        this.showSnooze = false;
                        this.showAssign = true;
                    } else if (obj.outcome_type_cd === 'PENDING_REMIND_LATER') {
                        this.showSnooze = true;
                        this.showAssign = false;
                    } else {
                        this.showSnooze = false;
                        this.showAssign = false;
                    }
                }
            }
        }

        /** show or hide remaining fields based on intervention */
        if (id === 'intervention') {
            this.showOutreach = false;
            for (const intervention of this.interventionList.intervention_types) {
                if (intervention.selected_flag && intervention.intervention_type_cd === 'NO_INTERVENTION_NEEDED') {
                    this.showOutreach = false;
                } else if (intervention.selected_flag) {
                    this.showOutreach = true;
                }
            }
        }

        if (this.interventionList.assign_to_users.length === 0) {
            for (const type of this.interventionList.outcome_types) {
                if (type.outcome_type_cd === 'PENDING_REASSIGN') {
                    type.isDisabled = true;
                    break;
                }
            }
        }
    }

    snoozeDurationTouchedEvt() {
        this.snoozeDurationTouched = true;
    }

    /** Save in tervention Log */
    saveIntervention() {
        const interventionSelected = [];
        const outComeSelected = [];
        this.disableSave = true;
        // adding selected intervention_types
        for (const obj of this.interventionList.intervention_types) {
            if (obj.selected_flag) {
                interventionSelected.push(obj);
            }
        }

        // adding selected outreach_types
        for (const obj of this.interventionList.outcome_types) {
            if (obj.selected_flag) {
                if (obj.outcome_type_cd == "PENDING_REMIND_LATER") {
                    this.errorMessage = '';
                    if (obj.snooze_duration_type === 'hours' && !(obj.snooze_duration > 0 && obj.snooze_duration < 73)) {
                        this.errorMessage = 'Please enter snooze duration between 1 and 72 hours';
                        this.isSubmitBtnDisabled = true;
                    } else if (obj.snooze_duration_type === 'days' && !(obj.snooze_duration > 0 && obj.snooze_duration < 4)) {
                        this.errorMessage = 'Please enter snooze duration between 1 and 3 days';
                        this.isSubmitBtnDisabled = true;
                    }
                    if (this.isSubmitBtnDisabled) {
                        return false;
                    }
                }
                outComeSelected.push(obj);
            }
        }

        this.interventionList.selected_intervention_types = interventionSelected;
        this.interventionList.selected_outcome_types = outComeSelected;
        this.interventionList.outreaching_agent_id = this.userdetails.id;
        this.interventionList.participant_id = this.participantId;
        this.interventionList.event_reported_by_email = this._storage.get('email');
        this.interventionList.event_reported_by_name = this.getStaffFullName();
        this.interventionList.event_type = this.getEventType();
        this.interventionList.task_ids = this.getSelectedTasks();
        this.interventionList.event_trigger_type = this.getFullTasksString();

        this._inteventionService.saveInterventionLogDetails(this.interventionList).then(data => {
            this.closeInterventionModal('saved');
            this._toasterService.pop('success', 'Success', 'Task completed successfully');
        }, error => {
            this.errorMessage = JSON.parse(error._body).error_message;
            this.disableSave = false;
        });
    }

    getStaffFullName() {
        if (typeof this.userdetails.middle_name === 'undefined') {
            return this.userdetails.first_name + ' ' + this.userdetails.last_name;
        } else {
            return this.userdetails.first_name + ' ' + this.userdetails.middle_name + ' ' + this.userdetails.last_name;
        }
    }

    /** vitals selected to string as backend needed  */
    getFullTasksString() {
        if (this.participatData.overall_seizure_counts > 0) {
            return 'Seizure Incidents Reported';
        } else {
            let fullString: any;
            this.vitalsSelected.forEach(element => {
                if (!fullString) {
                    fullString = element;
                } else {
                    fullString = fullString + ',' + element;
                }
            });
            return fullString;
        }
    }

    /** Get conditions to display im modal window */
    getConditionsList() {
        this.conditionsList = [];
        if (this.participatData.diagnosis) {
            this.participatData.diagnosis.forEach(element => {
                if (this.participatData.diagnosis.length <= 2) {
                    this.conditionsCount = 0;
                    this.conditionsList = this.participatData.diagnosis;
                } else {
                    const tempArray: any = [];
                    tempArray.push(this.participatData.diagnosis[0]);
                    tempArray.push(this.participatData.diagnosis[1]);
                    this.conditionsList = tempArray;
                    this.conditionsCount = this.participatData.diagnosis.length - 2;
                }
            });
        }
    }

    /** Get next or previous participant data */
    getOtherParticipantData(id) {
        this.showForm = false;
        this.errorMessage = false;
        this.clearAllFields();
        if (id === 'next') {
            this.participantId = this.participatData.next_participant_id;
        } else {
            this.participantId = this.participatData.prev_participant_id;
        }
        this.getVitalTasks();
    }


    /** GET SYMPTOM ASSESSMENT CLASS FOR BORDER COLOR */
    getSymptomStatus(status) {
        if (status === 'None' || status === 'Full' || status === 'No' || status === 'Yellow' || status === 'Clear' || status === 'Green') {
            return 'border-normal';
        } else if (status === 'Somewhat' || status === 'Moderate') {
            return 'border-alert';
        } else if (status === 'Yes' || status === 'Red' || status === 'Severe' || status === 'Not at all') {
            return 'border-danger';
        }
    }



    /** Disable or enable toogle arrows */
    arrowdisabled() {
        this.left_disabled = false;
        this.right_diabled = false;

        if (this.participatData.prev_participant_id == null) {
            this.left_disabled = true;
        }

        if (this.participatData.next_participant_id == null) {
            this.right_diabled = true;
        }
    }

    /** get border color based on event status */
    getBroderColor(id: number) {
        return InterventionUtil.getBroderColor(id);
    }

    /** Disable If careteam list is empty */
    disableReAssignOption() {
        if (this.interventionList.assign_to_users.length === 0) {
            _.forEach(this.interventionList.outcome_types, (val) => {
                if (val.outcome_type_group === 'REASSIGN_GROUP') {
                    val.isDisabled = true;
                }
            });
        }
    }

    dataLoadingStarted(): void {
        this.isDataLoading = true;
    }

    dataLoadingCompleted(): void {
        this.isDataLoading = false;
    }

    confirmed() {
        this.dialog.close(true);
    }
    closeConfirmMsg() {
        let intervention_types_array = [];
        intervention_types_array = this.interventionList.intervention_types;
        this.showConfirmMsg = false;
        this.showForm = true;
        this.interventionList.intervention_types = intervention_types_array;
    }

    getEventType() {
        if (this.participatData.overall_seizure_counts > 0) {
            return 'INTS';
        } else {
            return 'INTCV';
        }
    }

    getSelectedTasks() {
        let obj: any;
        if (this.participatData.overall_seizure_counts > 0) {
            for (obj of this.participatData.vitalDetails) {
                if (obj.event_type === 'SEIZURE') {
                    this.tasksSelected.push(obj.task_id);
                }
            }
            console.log(this.tasksSelected);
            return this.tasksSelected;
        } else {
            return this.tasksSelected;
        }
    }
}

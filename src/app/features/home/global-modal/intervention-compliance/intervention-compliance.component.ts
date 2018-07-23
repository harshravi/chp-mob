import { Component, OnInit, OnChanges, SimpleChange, OnDestroy } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { ToasterService } from 'angular2-toaster';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { InterventionComplianceModalContext } from './intervention-compliance-modal-context';
import { InterventionComplianceModel, MedicationCMPLDetails, CareplanCMPLDetail } from './model/intervention-compliance.model';
import { InterventionList, InterventionType, OutcomeType } from './model/intervention-list.model';
import { InterventionComplianceService } from './services/intervention-compliance.service';
import * as _ from 'lodash';
import { LocalStorageService } from 'angular-2-local-storage';
import { InterventionService } from '../intervention/intervention.service';
import { IUserDetail, UserDetail } from '../../../../models';
import { SnoozeType, SnoozeTypeEnum, SymptomType, SymptomTypeEnum } from '../../../../models/common.model';
import { InterventionUtil } from '../intervention/util/intervention.util';
import { AppGlobal } from '../../../../models/app-global.model';
import { DateUtilityService } from '../../../../services';

@Component({
    selector: 'app-intervention-compliance',
    templateUrl: './intervention-compliance.component.html',
    styleUrls: ['./intervention-compliance.component.scss'],
    providers: [InterventionComplianceService, InterventionService]
})
export class InterventionComplianceComponent implements OnInit, OnChanges,
    CloseGuard, ModalComponent<InterventionComplianceModalContext>, OnDestroy {

    context: InterventionComplianceModalContext;
    interventionComplianceModel: InterventionComplianceModel;
    participantId: string;
    interventionList: InterventionList = <InterventionList>{};
    tasksSelected: Array<string> = [];
    showForm = false;
    showConfirmMsg = false;
    isSubmitBtnDisabled: boolean;
    snoozeType: SnoozeTypeEnum = SnoozeType.HOURS;
    snooze_duration = null;
    showSnooze = false;
    showAssign = false;
    showOutreach = false;
    errorMessage = null;
    vitalsSelected: string[] = [];
    snoozeDropdown = ['hours', 'days'];
    userDetails: UserDetail = this._appGlobal.userDetails;
    conditionsList = [];
    conditionsCount = 0;
    right_diabled = false;
    left_disabled = false;

    isDataLoading: boolean;

    snoozeDurationTouched = false;
    disableSave = false;

    constructor(public dialog: DialogRef<InterventionComplianceModalContext>,
        private _toasterService: ToasterService,
        private _interventionComplianceService: InterventionComplianceService,
        private _storage: LocalStorageService,
        private _inteventionService: InterventionService,
        private _appGlobal: AppGlobal, private _dateUtilityService: DateUtilityService) {

        this.context = dialog.context;
        this.isSubmitBtnDisabled = false;
    }

    resetModel() {
        this.interventionComplianceModel = {
            participant: '',
            participant_id: '',
            prev_participant_id: null,
            next_participant_id: null,
            participant_name: '',
            diagnosis: [],
            careplanCMPLDetails: [],
            medicationCMPLDetails: []
        };

    }

    resetForm() {

        if (this.interventionList) {
            this.interventionList.assigned_to_staff_id = null;
            this.interventionList.intervention_notes = null;
            this.interventionList.outreaching_agent_id = null;
            this.interventionList.selected_outcome_types = null;
            this.interventionList.selected_intervention_types = null;
            this.interventionList.selected_outreach_type_cd = null;
        }

        this.snoozeDurationTouched = false;
        this.snoozeType = SnoozeType.HOURS;
        this.snooze_duration = null;
        this.showSnooze = false;
        this.showAssign = false;
        this.showOutreach = false;
        this.errorMessage = null;
        this.showForm = false;
        this.vitalsSelected = [];
        this.tasksSelected = [];

        if (this.interventionList) {
            _.forEach(this.interventionList.intervention_types, obj => {
                obj.selected_flag = null;
            });

            _.forEach(this.interventionList.outcome_types, obj => {
                obj.selected_flag = null;
                obj.snooze_duration = null;
            });
        }
    }

    ngOnInit() {

        this.resetModel();
        this.resetForm();

        this.interventionList.assigned_to_staff_id = '';
        this.interventionList.intervention_notes = '';
        this.interventionList.selected_outreach_type_cd = '';

        this.participantId = this.context.participantId;

        this.getComlianceList();

        this.getInterventionList();
    }

    ngOnChanges() {

    }




    /** Vitals in modal window checked or unchecked */
    vitalChecked(data) {
        // this.tasksSelected = [];
        // data.selected_flag = event;

        if (data.selected) {

            if (!_.some(this.tasksSelected, val => val === data.task_id)) {
                this.tasksSelected.push(data.task_id);
            }

            if (!_.some(this.vitalsSelected, val => val === data.event_type_desc)) {
                this.vitalsSelected.push(data.event_type_desc);
            }

        } else {
            const obj = 0;
            for (const selectedTask in this.tasksSelected) {
                if (data.task_id === this.tasksSelected[selectedTask]) {
                    this.tasksSelected.splice(obj, 1);
                }
            }

            for (const selectedVital in this.vitalsSelected) {
                if (data.event_type_desc === this.vitalsSelected[selectedVital]) {
                    this.vitalsSelected.splice(obj, 1);
                }
            }
        }

        if (this.tasksSelected.length === 0) {
            this.showForm = false;
            this.resetForm();
            this.resetOutreach();
        } else {
            this.showForm = true;
        }

        this.interventionList.task_ids = this.tasksSelected;
    }

    /** get Intervention list for dropdown values */
    getInterventionList() {
        const reqData = { participant_id: this.participantId, outreaching_agent_id: this.userDetails.id };
        this._inteventionService.getInterventionLisForCompliance(reqData).then(data => {
            this.interventionList = data;
        });
    }

    // reset options for outcome reach combo box
    resetOutreach() {
        _.forEach(this.interventionList.outcome_types, val => {
            val.selected_flag = false;
            val.isDisabled = false;
        });
    }

    snoozeDurationTouchedEvt() {
        this.snoozeDurationTouched = true;
    }

    /** Options selected in intervention dropdown */
    optionSelected(item, id) {
        this.snoozeDurationTouched = false;
        if (id === 'outcome') {

            const selectedOption: OutcomeType[] = _.filter(this.interventionList.outcome_types,
                (val: OutcomeType) => val.selected_flag === true);

            const
                requiredOptions = _.filter(selectedOption, val =>
                    (val.outcome_type_group === 'DETERIORATION_GROUP' ||
                        val.outcome_type_group === 'IMPROVEMENT_GROUP'));


            if (requiredOptions && requiredOptions.length) {

                const isImprovementGrpSelected: boolean = _.some(requiredOptions, val =>
                    val.outcome_type_group === 'IMPROVEMENT_GROUP');
                const isDeteriorationGrpSelected: boolean = _.some(requiredOptions,
                    val => val.outcome_type_group === 'DETERIORATION_GROUP');

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
                    val.isDisabled = false;
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
                if (obj.outcome_type_cd === 'PENDING_REMIND_LATER') {
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
        this.interventionList.outreaching_agent_id = this.userDetails.id;
        this.interventionList.participant_id = this.participantId;
        this.interventionList.event_reported_by_email = <string>this._storage.get('email');
        this.interventionList.event_reported_by_name = this.userDetails.getFullName();
        this.interventionList.event_type = 'INTCC';

        this.interventionList.task_ids = this.tasksSelected;
        this.interventionList.event_trigger_type = this.getFullTasksString();


        this._inteventionService.saveInterventionLogDetails(this.interventionList).then(data => {
            this.closeInterventionComplianceModal('saved');
            this._toasterService.pop('success', 'Success', 'Task completed successfully');
        }, error => {
            this.disableSave = false;
            this.errorMessage = JSON.parse(error._body).error_message;
        });
    }

    closeInterventionComplianceModal(data) {
        if (this.showForm && data !== 'saved') {
            this.showConfirmMsg = true;
        } else {
            this.dialog.close(data);
        }
    }

    getConditionsList() {
        if (this.interventionComplianceModel.diagnosis) {
            this.interventionComplianceModel.diagnosis.forEach(element => {
                if (this.interventionComplianceModel.diagnosis.length <= 2) {
                    this.conditionsCount = 0;
                    this.conditionsList = this.interventionComplianceModel.diagnosis;
                } else {
                    const tempArray: any = [];
                    tempArray.push(this.interventionComplianceModel.diagnosis[0]);
                    tempArray.push(this.interventionComplianceModel.diagnosis[1]);
                    this.conditionsList = tempArray;
                    this.conditionsCount = this.interventionComplianceModel.diagnosis.length - 2;
                }
            });
        }
    }

    getFullTasksString(): string {
        const result = [];

        if (_.some(this.interventionComplianceModel.careplanCMPLDetails, val => val.selected)) {
            result.push('Care Plan Compliance');
        }

        if (_.some(this.interventionComplianceModel.medicationCMPLDetails, val => val.selected)) {
            result.push('Medication Compliance');
        }
        return result.join(',');
    }

    getDisabledClass(id) {
        if (id === 'next') {
            if (this.interventionComplianceModel.next_participant_id !== null) {
                return '';
            } else {
                return 'disabled';
            }
        } else {
            if (this.interventionComplianceModel.prev_participant_id !== null) {
                return '';
            } else {
                return 'disabled';
            }
        }
    }

    getOtherParticipantData(id) {
        this.showForm = false;
        this.errorMessage = false;
        this.resetForm();
        if (id === 'next') {
            this.participantId = this.interventionComplianceModel.next_participant_id;
        } else {
            this.participantId = this.interventionComplianceModel.prev_participant_id;
        }
        this.getComlianceList();
    }

    getComlianceList() {
        this.dataLoadingStarted();
        this._interventionComplianceService.getInterventionCompliance(this.participantId).then(interventionComplianceList => {
            this.dataLoadingCompleted();
            if (interventionComplianceList) {
                this.interventionComplianceModel = interventionComplianceList;
                this.getConditionsList();
                this.arrowdisabled();
            } else {
                this.resetModel();
            }

        }, error => {
            this.dataLoadingCompleted();
        });
    }

    /** Disable or enable toogle arrows */
    arrowdisabled() {
        this.left_disabled = false;
        this.right_diabled = false;

        if (this.interventionComplianceModel.prev_participant_id == null) {
            this.left_disabled = true;
        }

        if (this.interventionComplianceModel.next_participant_id == null) {
            this.right_diabled = true;
        }
    }

    /** Get Class based on symptom assessment status  */
    getSymptomClass(id: number): SymptomTypeEnum {
        switch (id) {
            case 0: return SymptomType.NORMAL;
            case 1: return SymptomType.ALERT;
            case 2: return SymptomType.DANGER;
        }
    }

    /** get border color based on event status */
    getBroderColor(id: number) {
        return InterventionUtil.getBroderColor(id);
    }

    ngOnDestroy() {

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
        this.showConfirmMsg = false;
        this.showForm = false;
    }
}

import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { EmergencyActionPlanModalContext } from './emergency-action-plan-modal-context';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { EmergencyActionPlanService } from './emergency-action-plan.service';
import { GlobalEventEmitterService } from '../../../../services/EventEmitter/global-event-emitter.service';
import { ExtraValidators } from '../../../../form-validators/conditional.validator';
import { InterventionService } from '../intervention/intervention.service';
import { ToasterService } from 'angular2-toaster';
import * as _ from 'lodash';

@Component({
    selector: 'app-emergency-action-plan-modal',
    templateUrl: './emergency-action-plan-modal.component.html',
    styleUrls: ['./emergency-action-plan-modal.component.scss'],
    providers: [EmergencyActionPlanService,InterventionService]
})
export class EmergencyActionPlanModalComponent implements OnInit, ModalComponent<EmergencyActionPlanModalContext>{
    // Declaring the form with the DataType as FormGroup.
    form: FormGroup;
    participantName;
    minute: number;
    formTextBoxId: number;
    drugTextBoxId: number;
    drugTextBoxName: string;
    formData: any;
    searchedDrug;
    showSelectedDrug: boolean;
    removingTextFromSearch: boolean;
    // toast msg on edit or add of action plan
    toastOnAddEdit;
    highlightedSearchedRow: number;
    formDropdownDetails: string[];
    showConfermationBox;
    public timeMask = [/[0-9]/, /[0-9]/, /[0-9]/];
    context: EmergencyActionPlanModalContext;
    constructor(private _storage: LocalStorageService,
        private _fb: FormBuilder,
        private _emergencyActionPlanService: EmergencyActionPlanService,
        private _toasterService: ToasterService,
        private _globalEventEmitterService: GlobalEventEmitterService,
        private _inteventionService: InterventionService,
        public dialog: DialogRef<EmergencyActionPlanModalContext>) {
        this.context = dialog.context;
        this.participantName = this.context.EmergencyActionPlanData['participant_name'];
        this.removingTextFromSearch;
        this.minute = 1;
        this.showConfermationBox = false;
    }

    ngOnInit() {
        this.form = this._fb.group({
            'length_of_seizure': ['', [Validators.required]],
            'dosage': new FormControl('', [Validators.required]),
            'drug_name': ['', [Validators.required]],
            'form': ['', [Validators.required]],
            'note': ['']
        })
        this.setPatchValue();
        this.getFormData();
        if (this.context.edit) {
            this.setPatchValueOnEdit();
        }
        this._inteventionService.updateReadFlagForTasks(this.context.participantId);
    }

    setPatchValueOnEdit() {
        this.context.emergencyActionPlan
        this.form.patchValue({
            'length_of_seizure': this.context.EmergencyActionPlanData.length_of_seizure,
            'drug_name': this.context.EmergencyActionPlanData.drug_name,
            'dosage': this.context.EmergencyActionPlanData.dosage,
            'form': this.context.EmergencyActionPlanData.form_name,
            'note': this.context.EmergencyActionPlanData.note
        })
        this.getSearchedDrugDetails(this.context.EmergencyActionPlanData.drug_name)
        this.minute = this.context.EmergencyActionPlanData.length_of_seizure;
        this.getSelectedFormInfo();
    }
    getFormData() {
        // check for the very firsttime baseline values requirement
        this._emergencyActionPlanService.getActionPlanFormData().then(
            // success callback
            data => {
                this.formData = data;
                this.formDropdownDetails = _.map<any, string>(this.formData, 'form_name');
                this.getSelectedFormInfo();
            },
            // failure callback
            err => {
                this.formData = null;
            });
    }

    setPatchValue() {
        this.form.patchValue({
            'length_of_seizure': this.minute
        });
        if (this.form.value.drug_name !== '') {
            this.setDrugName();
        }
    }
    closeSymptomModal() {
        const formValue = this.form.value;
        if ((formValue.length_of_seizure > 1) || formValue.dosage || formValue.form || formValue.drug_name) {
            this.showConfermationBox = true;
        } else {
            this.dialog.close(true);
        }
    }
    confemationClick(check) {
        if (check === true) {
            this.dialog.close(true);
            this._globalEventEmitterService.modalClosedEvent();
        } else {
            this.showConfermationBox = false;
            this.setDrugName();
        }
    }
    decreaseIncreaseMin(min) {
        if (min === 'true') {
            this.minute++;
            this.setPatchValue();
        } else if (min === 'false') {
            if (this.minute > 1) {
                this.minute--;
                this.setPatchValue();
            } else {
                return true;
            }
        }
    }

    increaseMinute(min) {
        // this.setDrugName();
        if (this.minute <= 58 && min === 'true') {
            this.decreaseIncreaseMin(min);
        } else if (min === 'false') {
            this.decreaseIncreaseMin(min);
        }
    }
    // Get data for active and past drug
    getSearchedDrugDetails(drugNameDetails) {
        this.highlightedSearchedRow = null;
        var val = '';
        if (drugNameDetails.target) {
            val = drugNameDetails.target.value;
        } else {
            val = drugNameDetails;
        }

        this.searchedDrug = [];
        if (val.length > 0) {
            this.drugTextBoxName = '';
            this.drugTextBoxId = null;
            this._emergencyActionPlanService.getActionPlanDrugNameData(val).then(data => {
                this.searchedDrug = data;
                if (data.length > 0) {
                    if (this.context.edit) {
                        // this.showSelectedDrug = true;
                        const drugId = _.map<any, string>(this.searchedDrug, 'drug_id');
                        const drugName = _.map<any, string>(this.searchedDrug, 'drug_name');
                        this.context.EmergencyActionPlanData.drug_id = drugId[0];
                        // this.form.value.drug_name = drugName[0];
                        if (!this.removingTextFromSearch && this.removingTextFromSearch !== undefined) {
                            this.searchedDrug = data;
                        } else if (this.removingTextFromSearch === true) {
                            this.showSelectedDrug = false;
                        } else {
                            this.showSelectedDrug = false;
                        }
                        if (this.showSelectedDrug === true) {
                            this.searchedDrug = [];
                        }
                        if (!drugNameDetails.target && this.context.edit) {
                            this.showSelectedDrug = true;
                            this.searchedDrug = [];
                        }
                    }
                } else {
                    if (this.context.edit) {
                        delete this.context.EmergencyActionPlanData.drug_id;
                        this.showSelectedDrug = false;
                    }
                }
            });
        } else {
            this.searchedDrug = [];
        }
    }
    toggleHighlightSearch(newValue: number) {
        this.highlightedSearchedRow = newValue;
        this.searchedDrug = [];
    }
    collectSelectedDrug(drug) {
        this.drugTextBoxName = drug.drug_name;
        this.drugTextBoxId = drug.drug_id;
        this.form.value.drug_id = drug.drug_id;
        this.setDrugName();
        this.showSelectedDrug = true;
        // this.form.get('drug_name').setValidators([]);
    }
    // to remove selected drug name from search
    removeSelectedDrug() {
        this.form.patchValue({
            'drug_name': ''
        });
        // this.form.value.drug_name = '';
        this.form.value.drug_id = '';
        this.showSelectedDrug = false;
        this.removingTextFromSearch = true;
        this.searchedDrug = [];
        // if (drugName) {
        //     this.getSearchedDrugDetails(drugName);
        // }
    }
    // to select drug name from dropdown of drug Name box
    getSelectedFormInfo() {

        if (this.formData) {
            var selectedFormValue = _.find(this.formData, { form_name: this.form.value.form });
            if (selectedFormValue) {
                if (this.context.edit) {
                    this.context.EmergencyActionPlanData.form_id = selectedFormValue['form_id'];
                } else {
                    this.formTextBoxId = selectedFormValue['form_id'];
                }
            }
        }
    }
    setDrugName() {
        if (this.drugTextBoxName) {
            this.form.patchValue({
                'drug_name': this.drugTextBoxName
            });
        }
    }
    // function call on the keyup of note textbox
    textInNote() {
        this.setDrugName();
    }
    // update the action plan
    updateActionPlan(actionPlanData) {
        this._emergencyActionPlanService.updateActionPlan(actionPlanData).then(data => {
            if (data.success_message) {
                this.toastOnAddEdit = this._toasterService.pop('success', 'Saved', data.success_message);
                this.dialog.close(true);
            } else if (data.error_message) {
                this.toastOnAddEdit = this._toasterService.pop('error', 'Error', data.error_message);
                this.dialog.close(true);
            }
        });
    }
    // add the action plan
    addActionPlan(actionPlanData) {
        this._emergencyActionPlanService.addActionPlan(actionPlanData).then(data => {
            if (data.success_message) {
                this.toastOnAddEdit = this._toasterService.pop('success', 'Saved', data.success_message);
                this.dialog.close(true);
            } else if (data.error_message) {
                this.toastOnAddEdit = this._toasterService.pop('error', 'Error', data.error_message);
                this.dialog.close(true);
            }
        });
    }
    // check for add or edit of action plan and take the respection action as edit or add
    addUpdateActionPlan() {
        let formValue = this.form.value;
        if (this.context.participantId) {
            formValue.participant_id = this.context.participantId;
        } else {
            formValue.participant_id = this._storage.get('participantId');
        }
        if (this.context.edit) {
            formValue.form_id = this.context.EmergencyActionPlanData.form_id;
            if (this.context.EmergencyActionPlanData.drug_id) {
                formValue.drug_id = this.context.EmergencyActionPlanData.drug_id;
            }
            if (formValue.drug_id) {
                delete formValue.drug_name;
            }
            delete formValue.form;
            formValue.action_plan_detail_id = this.context.EmergencyActionPlanData.action_plan_detail_id;
            this.updateActionPlan(formValue)
        } else {
            formValue.form_id = this.formTextBoxId;
            if (this.drugTextBoxId) {
                formValue.drug_id = this.drugTextBoxId;
                delete formValue.drug_name;
            }
            delete formValue.form;
            this.addActionPlan(formValue)
        }
    }
}

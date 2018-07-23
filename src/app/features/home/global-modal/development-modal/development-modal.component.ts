import { Component, OnInit } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { DevelopmentModalContext } from './development-modal-context';
import { LocalStorageService } from 'angular-2-local-storage';
import { GlobalEventEmitterService } from '../../../../services/EventEmitter/global-event-emitter.service';
import { EventLogTypeEnum, EventLogType } from '../../../../models/common.model';
import { DateUtilityService } from '../../../../services';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { IAddDevelopmentData } from './model/development-modal.model';
import { DevelopmentModalService } from './development-modal.service';
import { ToasterService } from 'angular2-toaster';
import { ValidationService } from '../../../../components/core/error-messages';
@Component({
    selector: 'app-development-modal',
    templateUrl: './development-modal.component.html',
    styleUrls: ['./development-modal.component.scss'],
    providers: [DevelopmentModalService]
})
export class DevelopmentModalComponent implements OnInit, CloseGuard, ModalComponent<DevelopmentModalContext>{
    context: DevelopmentModalContext;
    //developForm: FormGroup;
    // Default selected time prefix
    selectedTimeSuffix: string;
    // Pre selected time AM
    preSelected = 'AM';
    maxDate: Date;
    minDate: Date;
    public timeMask = [/([0-1])/, /[0-9]/, ':', /[0-5]/, /[0-9]/,];
    // Participant Name to display in header part of modal
    participantName;
    checkLength = true;
    checkUnitUs;
    checkUnitMatric;
    timeErrorFlag = false;
    disableBtn;
    dateAMPMSelectedText: string;

    developmentModalSettingsData: string;
    uSDisplay: boolean;
    metriceDisplay: boolean;
    addDevelopmentData: IAddDevelopmentData;
    uSDisplayColor: any;
    metriceDisplayColor: any;

    addData: object;
    participant_id: string;
    // toast msg on edit or add of development
    toastOnEdit;
    time: number;
    weight_kg: number;
    height_feet: number;
    height_inches: number;
    height_cms: number;
    source: string;
    form: FormGroup;
    showConfermationBox;
    dateSeletorOption: string[] = [
        'AM',
        'PM'
    ];

    constructor(private _fb: FormBuilder, public dialog: DialogRef<DevelopmentModalContext>, private _storage: LocalStorageService,
        private _globalEventEmitterService: GlobalEventEmitterService, public _dateUtilityService: DateUtilityService,
        private _developmentModalService: DevelopmentModalService, private _toasterService: ToasterService, ) {
         this.participantName = this._storage.get('participantName');
        // Getting the context of the Modal from the DialogRef which is injected
        this.context = dialog.context;

        // This data assignment made from the context comes from the
        // Side-Nav component. This leads to the data prepopulation
        // before the form is loaded.
        this.maxDate = new Date();
        this.minDate = new Date(new Date().setDate(new Date().getDate() - 1));
        this.showConfermationBox = false;
        this.developmentModalSettingsData = this.context.developmentModalSettingsData ? this.context.developmentModalSettingsData.data : '';
    }

    ngOnInit() {
        this.uSDisplay = false;
        this.metriceDisplay = true;
        this.form = this._fb.group({
            'height_feet': ['', ValidationService.onlyNumbers],
            'height_inches': ['', ValidationService.onlyNumbers],
            'height_cms': ['', ValidationService.decimalValidator],
            'weight': ['', ValidationService.decimalValidator],
            'weight_kg': ['', ValidationService.decimalValidator],
            'date': [''],
            'time': [''],
            'selectedAMPM': ['']
        });
        this.setPatchValueOnEdit();
        this.dissableFormOnUnit();
        //this.metriceUnitDisplay();
        this.checkUnitOfModal();
        this.desableSubmitBtn();
    }

    checkUnitOfModal() {
        const baseUnitOfAdd = this.context.selectedUnit;
        const baseUnit = this.context.baseUnit;
        if (baseUnit === 'us' || baseUnitOfAdd === 'us') {
            this.usUnitDisplay();
        } else if (baseUnit === 'metric' || baseUnitOfAdd === 'metric') {
            this.metriceUnitDisplay();
        }
    }
    closeModal() {
        const formValue = this.form.value;
        if (formValue.height_cms || formValue.height_feet || formValue.height_inches || formValue.weight_kg || formValue.weight) {
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
        }
    }

    usUnitDisplay() {
        this.context.selectedUnit = 'us';
        this.desableSubmitBtn();
        this.uSDisplay = true;
        this.metriceDisplay = false;

        const hightCMField = this.form.get('height_cms'), weightKgField =
            this.form.get('weight_kg'), heightFeetField = this.form.get('height_feet'),
            heightInchesField = this.form.get('height_inches'), weightField = this.form.get('weight');

        if (hightCMField) {
            hightCMField.clearValidators();
        }

        if (weightKgField) {
            weightKgField.clearValidators();
        }

        if (heightFeetField) {
            heightFeetField.setValidators(ValidationService.onlyNumbers);
        }
        if (heightInchesField) {
            heightInchesField.setValidators(ValidationService.onlyNumbers);
        }
        if (weightField) {
            weightField.setValidators(ValidationService.decimalValidator);
        }

        this.form.updateValueAndValidity();

        this.uSDisplayColor = 700;
        this.metriceDisplayColor = 400;
    }

    metriceUnitDisplay() {
        this.context.selectedUnit = 'metric';
        this.desableSubmitBtn();
        this.uSDisplay = false;
        this.metriceDisplay = true;

        const hightCMField = this.form.get('height_cms'), weightKgField =
            this.form.get('weight_kg'), heightFeetField = this.form.get('height_feet'),
            heightInchesField = this.form.get('height_inches'), weightField = this.form.get('weight');

        if (hightCMField) {
            hightCMField.setValidators(ValidationService.decimalValidator);
        }

        if (weightKgField) {
            weightKgField.setValidators(ValidationService.decimalValidator);
        }

        if (heightFeetField) {
            heightFeetField.clearValidators();
        }
        if (heightInchesField) {
            heightInchesField.clearValidators();
        }
        if (weightField) {
            weightField.clearValidators();
        }

        this.form.updateValueAndValidity();

        this.metriceDisplayColor = 700;
        this.uSDisplayColor = 400;
    }

    timeSuffixSelection(selectedValue) {
        this.timeCheck(this.form.value.selectedAMPM);
    }

    timeCheck(changeOfTime) {
        switch (changeOfTime) {
            case 'AM':
                if (this.form.value.time) {
                    const time = this.form.value.time;
                    const hour = +time.substring(0, 2);
                    const min = time.substring(3, 5);
                    this.finalTime(hour, min, changeOfTime);
                    this.preSelected = 'AM'
                    // if (hour === 12) {
                    //   const newHour = hour - 12;
                    //   this.finalTime(newHour, min, changeOfTime);
                    // } else {
                    //   const newHour = hour - 12;
                    //   this.finalTime(newHour, min, changeOfTime);
                    // }
                }
                break;

            case 'PM':
                if (this.form.value.time) {
                    const time = this.form.value.time;
                    const hour = +time.substring(0, 2);
                    const min = time.substring(3, 5);
                    this.finalTime(hour, min, changeOfTime);
                    this.preSelected = 'PM';
                }
                break;
        }
    }

    checkFrequencyTime(event, timeFrequency: HTMLInputElement) {
        const dosesValue = event;
        if (dosesValue) {
            const hour = +dosesValue.substring(0, 2);
            this.timeErrorFlag = false;
            if (hour > 12) {
                this.timeErrorFlag = true;
                timeFrequency.value = null;
                this.checkLength = true;
            }
        }
    }

    // checking the lenght of string while adding the frequecy
    checkStringLength(timeString) {
        const val = timeString.target.value;
        const checkHr = +val.substring(0, 2)
        if (checkHr > 12) {
            this.timeErrorFlag = true;
        } else {
            this.timeErrorFlag = false;
        }
        const replacedValue = val.replace('_', '');

        if (replacedValue.length < 5) {
            this.checkLength = true;
        } else if (val.length === 5) {
            this.checkLength = false;
        }
    }
    setFormDefaultDateTime() {
        const momentTime = moment(), date = momentTime,
            time = momentTime.format('hh:mm'), selectedAMPM = momentTime.format('A');

        this.form.patchValue({
            time: time,
            date: date,
            selectedAMPM: selectedAMPM
        });
    }

    desableSubmitBtn() {
        var formValue = this.form.value;
        if (this.context.selectedUnit === 'metric' || this.context.baseUnit === 'metric') {
            if (!formValue.height_cms || !formValue.weight_kg || !formValue.time || !formValue.date || !formValue.selectedAMPM) {
                this.disableBtn = true;
            } else {
                this.disableBtn = false;
            }
        } else if (this.context.selectedUnit === 'us' || this.context.baseUnit === 'us') {
            if (!formValue.height_feet || !formValue.height_inches || !formValue.weight || !formValue.time || !formValue.date || !formValue.selectedAMPM) {
                this.disableBtn = true;
            } else {
                this.disableBtn = false;
            }
        }
    }
    setPatchValueOnEdit() {
        const patchData = this.context.developmentDetails;
        if (patchData) {
            let feet, inches;
            if (patchData.height_us) {
                const heightUS = patchData.height_us.split("'");
                feet = heightUS[0];
                inches = heightUS[1];
            } else if (!patchData.height_us) {
                feet = "";
                inches = "";
            }

            const momentTime = moment(patchData.time), date = momentTime,
                time = momentTime.format('hh:mm'), selectedAMPM = momentTime.format('A');

            this.form.patchValue({
                height_feet: feet,
                height_inches: inches,
                height_cms: patchData.height_metric,
                weight: patchData.weight_us,
                weight_kg: patchData.weight_metric,
                time: time,
                date: date,
                selectedAMPM: selectedAMPM
            });

        } else {
            const momentTime = moment(), date = momentTime,
                time = momentTime.format('hh:mm'), selectedAMPM = momentTime.format('A');

            this.form.patchValue({
                time: time,
                date: date,
                selectedAMPM: selectedAMPM
            });
            return true;
        }
    }
    callDevelopmentService(formdata) {
        this.dateAMPMSelectedText = '';

        this._developmentModalService.addDevelopmentData(formdata).then(data => {
            if (data.success_message) {
                this.toastOnEdit = this._toasterService.pop('success', 'Saved', data.success_message);
                this.form.reset();
                this.setFormDefaultDateTime();
            } else if (data.error_message) {
                this.toastOnEdit = this._toasterService.pop('error', 'Error', data.error_message);
                this.form.reset();
                this.setFormDefaultDateTime();
            }
        });
    }

    updateDevelopment(developmentData) {
        this._developmentModalService.updateDevelopment(developmentData).then(data => {
            if (data.success_message) {
                this.toastOnEdit = this._toasterService.pop('success', 'Saved', data.success_message);
                this.dialog.close(true);
            } else if (data.error_message) {
                this.toastOnEdit = this._toasterService.pop('error', 'Error', data.error_message);
                this.dialog.close(true);
            }
        });
    }

    dissableFormOnUnit() {
        if (this.context.editable) {
            if (this.context.baseUnit === 'us') {
                this.checkUnitUs = false;
                this.checkUnitMatric = true;
                this.uSDisplayColor = 700;
                this.uSDisplay = true;
                this.metriceDisplay = false;
            } else if (this.context.baseUnit === 'metric') {
                this.checkUnitMatric = false;
                this.checkUnitUs = true;
                this.metriceDisplayColor = 700;
                this.uSDisplay = false;
                this.metriceDisplay = true;
            }
        } else {
            this.metriceDisplayColor = 700;
        }

    }

    checkUnitOnAdd() {
        if (this.context.editable) {
            if (this.context.baseUnit === 'us') {
                this.uSDisplayColor = 700;
                this.uSDisplay = true;
                this.metriceDisplay = false;
            } else if (this.context.baseUnit === 'metric') {
                this.metriceDisplayColor = 700;
                this.uSDisplay = true;
                this.metriceDisplay = false;
            }
        } else {
            return true;
        }
    }

    saveDevelopment() {
        const editable = this.context.editable;
        const formValue = this.form.value;
        if (this.toastOnEdit) {
            this._toasterService.clear(this.toastOnEdit.toastId);
        }
        formValue.source = 'Manual';
        if (this.uSDisplay) {
            delete formValue.height_cms;
            delete formValue.weight_kg;
            if (editable) {
                formValue.whbmi_id = this.context.developmentDetails.whbmi_id;
                formValue.time = this.context.developmentDetails.time;
                delete formValue.date;
                delete formValue.selectedAMPM;
                this.updateDevelopment(formValue);
            } else {
                const dateFormat = formValue.date.format('YYYY MM DD h:mm ');
                const date = moment(dateFormat + this.form.value.selectedAMPM, 'YYYY MM DD h:mm A').toDate().getTime();
                formValue.time = date;
                delete formValue.date;
                formValue.participant_id = this._storage.get('participantId');
                this.callDevelopmentService(formValue);
            }
        } else if (this.metriceDisplay) {
            delete formValue.height_feet;
            delete formValue.height_inches;
            delete formValue.weight;
            if (editable) {
                formValue.whbmi_id = this.context.developmentDetails.whbmi_id;
                formValue.time = this.context.developmentDetails.time;
                delete formValue.date;
                this.updateDevelopment(formValue);
            } else {
                let dateFormat = formValue.date ? formValue.date.format('YYYY MM DD') : null;
                dateFormat = dateFormat + " " + formValue.time;
                const date = moment(dateFormat + this.form.value.selectedAMPM, 'YYYY MM DD h:mm A').toDate().getTime();
                formValue.time = date;
                delete formValue.date;
                formValue.participant_id = this._storage.get('participantId');
                this.callDevelopmentService(formValue);
            }
        }
    }

    finalTime(newHour, min, changeOfTime) {
        const hourInPm = ('0' + newHour).slice(-2);
        const minInPm = ('0' + min).slice(-2);
        const timeInPm = hourInPm + ':' + minInPm;
        this.form.value.time = timeInPm;
    }
}

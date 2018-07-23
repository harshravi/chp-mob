import { Component, OnInit } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { LungsModalContext } from './lungs-modal-context';
import { LocalStorageService } from 'angular-2-local-storage';
import { GlobalEventEmitterService } from '../../../../services/EventEmitter/global-event-emitter.service';
import { EventLogTypeEnum, EventLogType } from '../../../../models/common.model';
import { TextMaskModule } from 'angular2-text-mask';
import { DateUtilityService } from '../../../../services';
import { ToasterService } from 'angular2-toaster';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ValidationService } from '../../../../components/core/error-messages';
import { LungsService } from './lungs-modal.service';
import { IErrorMessage, ILungDataStatus } from './model/lungs.model';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';
import { ExtraValidators } from '../../../../form-validators/conditional.validator';

@Component({
    selector: 'app-lungs-modal',
    templateUrl: './lungs-modal.component.html',
    styleUrls: ['./lungs-modal.component.scss'],
    providers: [LungsService]
})
export class LungsModalComponent implements OnInit, CloseGuard, ModalComponent<LungsModalContext>{
    context: LungsModalContext;
    //developForm: FormGroup;
    lungsModalSettingsData: string;
    uSDisplay: boolean;
    metriceDisplay: boolean;
    // Default selected time prefix
    selectedTimeSuffix: string;
    // Pre selected time AM
    preSelected = 'AM';
    // Participant Name to display in header part of modal
    participantName;
    participantId: string;
    checkLength = true;
    timeErrorFlag = false;
    benchmark = 0;
    form: FormGroup;
    // toast message on add or edit of lung data  
    toastOnEdit;
    // Setting min date for calender
    maxDate: Date;
    minDate: Date;
    public timeMask = [/([0-1])/, /[0-9]/, ':', /[0-5]/, /[0-9]/];
    dateSeletorOption: string[] = [
        'AM',
        'PM'
    ];
    dateAMPMSelectedText: string;
    selectedTimeline: string;
    errorMessage: IErrorMessage;
    subScriptions: Subscription[] = [];
    showConfermationBox;
    lungDataStatus: ILungDataStatus;

    constructor(private _fb: FormBuilder, public dialog: DialogRef<LungsModalContext>, private _storage: LocalStorageService,
        private _globalEventEmitterService: GlobalEventEmitterService, public _dateUtilityService: DateUtilityService,
        public _lungsService: LungsService, private _toasterService: ToasterService, ) {

        // Getting the context of the Modal from the DialogRef which is injected
        this.context = dialog.context;

        // This data assignment made from the context comes from the
        // Side-Nav component. This leads to the data prepopulation
        // before the form is loaded.
        this.participantName = this._storage.get('participantName');
        this.participantId = this._storage.get<string>('participantId');

        this.lungsModalSettingsData = this.context.lungsModalSettingsData ? this.context.lungsModalSettingsData.data : '';
        this.selectedTimeSuffix = 'AM';
        this.dateAMPMSelectedText = 'Select';
        this.maxDate = new Date();
        this.minDate = new Date(new Date().setDate(new Date().getDate() - 1));
        this.errorMessage = {};
        this.inialiseForm();
        this.showConfermationBox = false;

    }

    ngOnInit() {
        this.setLungFormIntialValue();

        if (!this.context.editable) {
            this.getLungDataStatus();
        }

    }

    // formPatchBaseLineValues(status: ILungDataStatus) {
    //     this.form.patchValue({
    //         benchmark1: !!status.pef_status,
    //         benchmark2: !!status.fev1_status,
    //         benchmark3: !!status.fvc_status
    //     });
    // }

    checkLungDataStatus(value, benchmark: string): void {
        const formValue = this.form.value;
        if (this.lungDataStatus) {
            switch (benchmark) {
                case 'benchmark1':
                    this.form.patchValue({
                        benchmark1: !!(this.lungDataStatus.pef_status && typeof value !== 'undefined'
                            && value.toString().length > 0)
                    });
                    break;
                case 'benchmark2':
                    this.form.patchValue({
                        benchmark2: !!(this.lungDataStatus.fev1_status && value !== ''
                            && typeof value !== 'undefined' && value.toString().length > 0)
                    });
                    break;
                case 'benchmark3':
                    this.form.patchValue({
                        benchmark3: !!(this.lungDataStatus.fvc_status && value !== '' && typeof value !== 'undefined'
                            && value.toString().length > 0)
                    });
                    break;
            }
        }
    }

    getLungDataStatus() {
        // check for the very firsttime baseline values requirement
        this._lungsService.getLungDataStatus(this.participantId).then(
            // success callback
            data => {

                // this.lungDataStatus = {
                //     pef_status: 1,
                //     fev1_status: 1,
                //     fvc_status: 1
                // };

                this.lungDataStatus = data;

            },
            // failure callback
            err => {
                this.lungDataStatus = null;
            });
    }

    inialiseForm() {
        this.uSDisplay = false;
        this.metriceDisplay = true;

        this.form = this._fb.group({
            value: new FormControl('', Validators.compose(
                [
                    ExtraValidators.conditional(
                        group => group.controls.benchmark1.value === true,
                        Validators.required
                    ),
                    Validators.min(50),
                    Validators.max(700)
                ])),
            value_ext: new FormControl('', Validators.compose(
                [
                    ExtraValidators.conditional(
                        group => group.controls.benchmark2.value === true,
                        Validators.required
                    ),
                    Validators.min(0.1), Validators.max(6)
                ])),
            value_ext2: new FormControl('', Validators.compose(
                [
                    ExtraValidators.conditional(
                        group => group.controls.benchmark3.value === true,
                        Validators.required
                    ),
                    Validators.min(0.1), Validators.max(6)
                ])),
            date: new FormControl('', [Validators.required]),
            time: new FormControl('', [Validators.required]),
            selectedAMPM: new FormControl('', [Validators.required]),
            benchmark1: [''],
            benchmark2: [''],
            benchmark3: ['']
        }, {
                validator: (formGroup: FormGroup) => {
                    return this.formOneFieldRequiredValidator(formGroup);
                }
            });

        this.subScriptions.push(this.form.valueChanges.subscribe(data => this.formValueChanged(data)));
        this.setPatchValueOnEdit();
    }

    formOneFieldRequiredValidator(formGroup: FormGroup): { isOneValueRequiredError: boolean } | null {
        if (!formGroup.controls.value.value && !formGroup.controls.value_ext.value &&
            !formGroup.controls.value_ext2.value) {
            return { isOneValueRequiredError: true };
        } else {
            return null;
        }
    }

    resetErrorMessage() {
        this.errorMessage.isPEFMinError = false;
        this.errorMessage.isFEV1MinError = false;
        this.errorMessage.isFVCMinError = false;

        this.errorMessage.isPEFMaxError = false;
        this.errorMessage.isFEV1MaxError = false;
        this.errorMessage.isFVCMaxError = false;

        this.errorMessage.isOneValueRequiredError = false;
    }

    formValueChanged(data) {
        // validate minmax for PEF
        const PEFControl = this.form.get('value');
        const FEV1Control = this.form.get('value_ext');
        const FVCControl = this.form.get('value_ext2');


        this.resetErrorMessage();
        if (PEFControl.errors) {
            this.errorMessage.isPEFMinError = PEFControl.errors.min;
            this.errorMessage.isPEFMaxError = PEFControl.errors.max;
        }

        if (FEV1Control.errors) {
            this.errorMessage.isFEV1MinError = FEV1Control.errors.min;
            if (FEV1Control.value < 0.1) {
                this.errorMessage.isFEV1MinError = true;
            }
            this.errorMessage.isFEV1MaxError = FEV1Control.errors.max;
        }

        if (FVCControl.errors) {
            this.errorMessage.isFVCMinError = FVCControl.errors.min;
            this.errorMessage.isFVCMaxError = FVCControl.errors.max;
        }
        if (this.form.dirty && this.form.touched && this.form.errors) {
            this.errorMessage.isOneValueRequiredError = this.form.errors.isOneValueRequiredError;
        }
    }

    unSubscribe() {
        _.forEach(this.subScriptions, (sub) => {
            if (sub) {
                sub.unsubscribe();
            }
        });
    }

    timeSuffixSelection() {
        // this.selectedTimeSuffix = selectedValue;
        // // if (this.form.value.dosesValue) {
        // //   this.checkLength = false;
        // // }
        this.timeCheck(this.form.value.selectedAMPM);
    }

    selectedTimelineChanged() {

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
                    // }h
                }
                break;

            case 'PM':
                if (this.form.value.time) {
                    const time = this.form.value.time;
                    const hour = +time.substring(0, 2);
                    const min = time.substring(3, 5);
                    this.finalTime(hour, min, changeOfTime);
                    this.preSelected = 'PM';

                    // if (hour < 12) {
                    //   const newHour = hour + 12;
                    //   this.finalTime(newHour, min, changeOfTime);
                    // } else if (hour === 12 && min >= 0) {
                    //   this.preSelectedAm = 'PM';
                    //   this.finalTime(hour, min, changeOfTime);
                    // }
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
        // if (this.dosesValueCollection.length > 0) {
        //   this.saveForm = false;
        // } else {
        //   this.saveForm = true;
        // }
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

    saveLungs() {
        const editable = this.context.editable;
        let formValue = _.cloneDeep(this.form.value);

        let formattedDate = formValue.date ? formValue.date.format('YYYY MM DD') : null;
              formattedDate = formattedDate +" "+ formValue.time;
        const date = formattedDate ? moment(formattedDate + this.form.value.selectedAMPM, 'YYYY MM DD h:mm A').toDate().getTime() : null;

        formValue = _.omit(formValue, ['date', 'time']);
        if (this.toastOnEdit) {
            this._toasterService.clear(this.toastOnEdit.toastId);
        }
        if (editable) {
            formValue = _.omit(formValue, ['benchmark1', 'benchmark2', 'benchmark3', 'selectedAMPM']);

            formValue.vital_id = this.context.lungDetails.vital_id;
            this._lungsService.updateLungs(formValue).then(data => {
                if (data.success_message) {
                    this.toastOnEdit = this._toasterService.pop('success', 'Saved', data.success_message);
                    this.dialog.close(true);
                } else if (data.error_message) {
                    this.toastOnEdit = this._toasterService.pop('error', 'Error', data.error_message);
                    this.dialog.close(true);
                }

                this.resetErrorMessage();
            });
        } else {
            formValue.vital_type = 'LUNG';
            formValue.data_type = 'Vital';
            formValue.unit = 'liters';
            formValue.source = 'Manual';
            formValue.timestamp = date;
            formValue.participant_id = this._storage.get('participantId');

            if (formValue.benchmark1 && formValue.value) {
                formValue.value_benchmark = 1;
            }

            if (formValue.benchmark2 && formValue.value_ext) {
                formValue.value_ext_benchmark = 1;
            }

            if (formValue.benchmark3 && formValue.value_ext2) {
                formValue.value_ext2_benchmark = 1;
            }

            if (!formValue.value && typeof formValue.value !== 'undefined') {
                delete formValue.value;
            }

            if (!formValue.value_ext && typeof formValue.value_ext !== 'undefined') {
                delete formValue.value_ext;
            }

            if (!formValue.value_ext2 && typeof formValue.value_ext2 !== 'undefined') {
                delete formValue.value_ext2;
            }

            this.dateAMPMSelectedText = '';

            this._lungsService.addLungs(formValue).then(data => {
                if (data.success_message) {
                    // Clearing the fields once save is successfull
                    this.form.reset();
                    this.dateAMPMSelectedText = moment().format('A');
                    this.setLungFormIntialValue();
                    if (!this.context.editable) {
                        this.getLungDataStatus();
                    }
                    // this.form.markAsUntouched();
                    this.toastOnEdit = this._toasterService.pop('success', 'Saved', data.success_message);
                } else if (data.error_message) {
                    this.toastOnEdit = this._toasterService.pop('error', 'Error', data.error_message);
                }

                this.resetErrorMessage();
            });
        }
    }

    setLungFormIntialValue() {
        if (!this.context.editable) {
            const momentTime = moment(), date = momentTime,
                time = momentTime.format('hh:mm'), selectedAMPM = momentTime.format('A');

            this.form.patchValue({
                time: time,
                date: date,
                selectedAMPM: selectedAMPM
            });
        }
    }

    setPatchValueOnEdit() {

        const patchData = this.context.lungDetails;

        if (patchData) {
            const momentTime = moment(patchData.time), date = momentTime,
                time = momentTime.format('hh:mm'), selectedAMPM = momentTime.format('A');

            this.form.patchValue({
                value: patchData.pef_value_metric,
                value_ext: patchData.fev1_value_metric,
                value_ext2: patchData.fvc_value_metric,
                time: time,
                date: date,
                selectedAMPM: selectedAMPM
            });
        } else {
            return true;
        }
    }

    finalTime(newHour, min, changeOfTime) {
        const hourInPm = ('0' + newHour).slice(-2);
        const minInPm = ('0' + min).slice(-2);
        const timeInPm = hourInPm + ':' + minInPm;
        this.form.value.time = timeInPm;
    }

    closeModal() {
        const formValue = this.form.value;
        if (formValue.value || formValue.value_ext || formValue.value_ext2) {
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
        this.uSDisplay = true;
        this.metriceDisplay = false;
    }

    metriceUnitDisplay() {
        this.uSDisplay = false;
        this.metriceDisplay = true;
    }

}

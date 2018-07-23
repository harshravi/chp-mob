import { Component, OnInit, AfterViewInit, OnDestroy, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantDashboardService } from '../participant-dashboard.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { ToasterService } from 'angular2-toaster';
/** Imports for the Modal to be involked on Button Click */
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import {
    SymptomAssesmentModalContext, AddMedicationModalContext,
    SymptomAssesmentModalComponent, AddMedicationModalComponent
} from './../../global-modal';
import { ICarouselData, IDateDropdown, IFevFvcDropdown } from './model/participant-health-status.model';
import { GlobalEventEmitterService } from '../../../../services/EventEmitter/global-event-emitter.service';
import { CustomConfirmDialogModalContext, ConfirmDialogModalComponent } from '../../../../features/home/global-modal/confirm-dialog';
/** importing breadcrumb service to set breadcrumb */
import { BreadcrumbService } from '../../../../services';

import { DateUtilityService } from '../../../../services';
import { CommonUtil } from '../../../../utils';
import * as _ from 'lodash';
import {
    DevelopmentModalComponent, DevelopmentModalContext
} from '../../../../features/home/global-modal';
import {
    LungsModalComponent, LungsModalContext
} from '../../../../features/home/global-modal';
import { IDateFilter } from './model/date-filter.model';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
    selector: 'app-participant-health-status',
    templateUrl: './participant-health-status.component.html',
    styleUrls: ['./participant-health-status.component.scss'],
    providers: [ParticipantDashboardService]
})
export class ParticipantHealthStatusComponent implements OnInit, AfterViewInit, OnDestroy {

    // To display ngx-table template
    @ViewChild('viewSymptom') viewSymptom: TemplateRef<any>;
    @ViewChild('vitalGrid') vitalGrid: DatatableComponent;
    @ViewChild('BGReportColumn') BGReportColumn: TemplateRef<any>;
    @ViewChild('DateFormat') DateFormat: TemplateRef<any>;
    @ViewChild('editLung') editLung: TemplateRef<any>;
    @ViewChild('editLungAction') editLungAction: TemplateRef<any>;

    @ViewChild('weightUs') weightUs: TemplateRef<any>;
    @ViewChild('heightUs') heightUs: TemplateRef<any>;
    @ViewChild('bmiUs') bmiUs: TemplateRef<any>;
    @ViewChild('editDevelopment') editDevelopment: TemplateRef<any>;
    @ViewChild('editDevelopmentAction') editDevelopmentAction: TemplateRef<any>;
    cardClicked = 0;

    // Client Grid's title
    gridIBoxTitle = 'Health Status';

    /** To get participant-id from URL */
    participantId;

    /** Variable for medication adherence */
    medicationAdherence;

    /** Variable for dropdown to select timeline */
    dayWiseFilter;
    /** Variable for Dropdown to select fev or Fvc */
    fevFvcDropdown: IDateDropdown[]
    /** Variable for Dropdown to select fev or Fvc */
    dateDropdown: IDateDropdown[]

    // firstDate: string;
    // lastDate: string;
    developmentDropdown: IDateDropdown[];
    unsubDelete;
    firstDate: IMoment;
    lastDate: IMoment;

    /** Variable to display vital inside carousel */
    carouselData = [];
    tablularData = [];
    LungstablularData = [];
    // Participant Name to display in header part of modal
    participantName;
    // Object holding all the values to be passed as tags
    listOfTags = [];
    /** For graph */
    graphData: Object;
    // text to show in confermation box when deleting data for lungs
    deleteText: string;
    //clear the toast before creating a new one
    toastCanDeleteBaseline;
    /** For tabular view */
    rows = [];
    columns;
    count = 0;
    offset = 0;
    limit = 10;
    // externalPaging = true;
    devTableData = [];

    /** timeLine to get data according to dropdown */
    selectedTimeline = 'week';

    /** vital type to get data according to user selection  */
    currentVital;
    /** Variable to show latestccd-data */
    data = 44;
    /** Variable to show medication Title */
    assessmentsBoxTitle = 'Assessments';
    selectedVitaltype;
    /** Variable to show medication Title */
    medicationBoxTitle = 'Medication';
    /** Default vital name */
    vitalName;
    /**care plan box title */
    carePlanBoxTitle = 'Care Plan(s)';
    // list of care plans
    listOfCarePlans: any;
    // Symptom modal taggle flag
    isSymptomModalOpen = false;
    usTable;
    matriceTable;
    // constant for no-padding style class for the box component
    noPadClassForComponent = 'no-padding';

    // Code for the Demo for Progress Bar
    status: number;
    statusColor: string;
    value: number;
    progressBarTitle: string;
    proressTextColor: string;
    proressPerColor: string;
    // data regarding medication
    medicationDetails;
    // Constant text to be dispalyed as the headings of the Icontent boxes
    activeMedication: any;
    careTeamText = 'Care Team';
    metricDisplayFont: string;
    usDisplayFont: string;
    // care team members list.
    careTeamMembers = [];
    isDataLoading: boolean;
    daysOptionSelected: string;
    selectedFvc: string;
    editData: boolean;
    editButton: boolean;
    isDatePrevBtnDisabled: boolean = false;
    isDateNextBtnDisabled: boolean = true;
    selectedUnit: string;

    tooltipVal: string;

    selectedLungValue = 'FEV1';
    selectedFilterText: string;
    selectedDevelopmentValue = 'WeightBMI';
    selectedDevelopment: string;
    selectedDev: string;
    selectedDevelopmentFilterText: string;
    carouselRefreshEvent: EventEmitter<boolean>;
    isCarouselVisible = true;
    timeout: any;
    // Avoid to display previous table data before loading actual data
    showTable = false;

    development: any = {
        tooltipString: '<div class="tooltip_templates">' +
        '                        <span id="tooltip_content">' +
        '                            <span><i class="fa fa-circle green"></i>  Normal : (BMI for age >5 Percentile)</span><br>' +
        '                        <span><i class="fa fa-circle text-danger"></i>  Critical : (BMI for age <5 Percentile)</span>' +
        '                        </span>' +
        '                      </div>'
    };

    lung: any = {
        both: '<div class="tooltip_templates">' +
        '                        <span id="tooltip_content">' +
        '                            <span><i class="fa fa-circle green"></i>  Normal(>80%)</span><br>' +
        '                        <span><i class="fa fa-circle text-danger"></i>  Critical(<80%)</span>' +
        '                        </span>' +
        '                      </div>',
        other: '<div class="tooltip_templates">' +
        '                        <span id="tooltip_content">' +
        '                            <span><i class="fa fa-circle green"></i>  Normal(Liter)</span><br>' +
        '                        <span><i class="fa fa-circle text-danger"></i>  Critical(10% below benchmark)</span>' +
        '                        </span>' +
        '                      </div>'
    };

    subscription: Subscription[];


    constructor(private route: ActivatedRoute,
        private router: Router, private _participantDashboardService: ParticipantDashboardService,
        private _storage: LocalStorageService, private _modal: Modal,
        private _globalEventEmitterService: GlobalEventEmitterService, private _toasterService: ToasterService,
        private _breadcrumbService: BreadcrumbService, private _dateUtilityService: DateUtilityService) {
        /** This list is for dropdown to select days */
        this.dayWiseFilter = [
            { id: 'week', filterBy: 'Weekly view' },
            { id: 'month', filterBy: 'Monthly view' },
            { id: 'quarter', filterBy: '3 months' }
        ];
        /** This list is for dropdown to select fev or Fvc */
        this.fevFvcDropdown = [
            { id: 'fev1', filterBy: 'FEV1' },
            { id: 'fvc', filterBy: 'FVC' },
            { id: 'fevorfvc', filterBy: 'FEV1/FVC' },
            { id: 'pef', filterBy: 'PEF' }
        ];
        /** This list is for dropdown to select Date */
        this.dateDropdown = [
            { id: '7', filterBy: '7 Days(jan 15 - jan 22)' },
            { id: '30', filterBy: '30 Days (jan 1 - jan 31)' }
        ];


        // Dropdown data for development
        this.developmentDropdown = [
            { id: 'WHBMI', filterBy: 'Weight/BMI' },
            { id: 'WPer', filterBy: 'Weight Percentile' },
            { id: 'HPer', filterBy: 'Height Percentile' },
            { id: 'BMIPer', filterBy: 'BMI Percentile' }
        ];

        this.daysOptionSelected = '30';


        this.selectedFvc = 'fev1';
        this.selectedDevelopment = 'WHBMI';
        this._globalEventEmitterService.modalClosedObservable.subscribe(closed => {
            this.isSymptomModalOpen = false;
        });

        this.deleteText = 'Are you sure you want to delete?'
        this.progressBarTitle = 'Overall Compliance';
        this.proressTextColor = '';
        this.proressPerColor = '';
        this.editData = false;
        this.editButton = true;
        this.usTable = true;
        this.matriceTable = false;
        // this.changeColumnValue(this.vitalName);

        this.participantName = this._storage.get('participantName');

        this.firstDate = moment().subtract(this.daysOptionSelected, 'days');
        this.lastDate = moment();
        this.subscription = [];
        this.carouselRefreshEvent = new EventEmitter<boolean>();
    }

    ngOnInit() {
        let map = new Map<string, string>();
        map.set('participantName', String(this._storage.get('participantName')));
        map.set('id', String(this._storage.get('participantId')));
        this._breadcrumbService.setBreadcrumbs('Participant Health Status', map);
        this.participantId = this._storage.get('participantId');

        /** calling to get first vital data, onload of page(for carousel and tabular view) */
        this.loadCurrentUserVital();

        // get the list of care plans for the participant
        this.getCarePlanList();

        // get the list of care team members of the participant
        this.getCareTeamMembers();

        // get the list of medication of the participant
        this.loadMedication();
        this.checkNextBtnVisibility();
        this.changeDevelopmentUnit('metric')
        // this.changeDataWithUnit('metric');
    }

    checkNextBtnVisibility() {
        if (CommonUtil.stripTime(this.lastDate).isSameOrAfter(CommonUtil.stripTime(moment()))) {
            this.isDateNextBtnDisabled = true;
        } else {
            this.isDateNextBtnDisabled = false;
        }
    }

    datePrevClick() {

        this.lastDate = moment(this.firstDate);
        this.firstDate = moment(this.lastDate).subtract(this.daysOptionSelected, 'days');
        this.checkNextBtnVisibility();

        if (this.vitalName === 'LUNG') {
            this.getLungsTabularView();
        } else {
            this.getDevelopmentTabularView();
        }

    }

    dateNextClick() {

        if (!this.isDateNextBtnDisabled) {
            this.firstDate = moment(this.lastDate);
            this.lastDate = moment(this.firstDate).add(this.daysOptionSelected, 'days');

            this.checkNextBtnVisibility();

            if (this.vitalName === 'LUNG') {
                this.getLungsTabularView();
            } else {
                this.getDevelopmentTabularView();
            }
        }
    }

    daysOptionChange() {
        this.firstDate = moment().subtract(this.daysOptionSelected, 'days');
        this.lastDate = moment();
        let timeLine;
        this._storage.set('displayMonth', 0);
        this._storage.set('timeLine', this.getTimeLineAsWeekOrMonth());
        if (this.vitalName === 'LUNG') {
            this.getLungsTabularView();
        } else if (this.vitalName === 'DEVELOPMENT') {
            this.getDevelopmentTabularView();
        } else {
            this.getUpdatedData();
        }
    }

    ngAfterViewInit() {

    }
    // Clear Vital details from session on rendering page
    clearCurrentUserVital() {
        const isValue = this._storage.get('currentUserVital');
        if (isValue) {
            this._storage.remove('currentUserVital');
        }
    }

    carouselInit() {
        this.programaticGetVitalData();
    }

    programaticGetVitalData() {
        if (this.carouselData && this.carouselData[this.cardClicked]) {
            this.getVitalData(this.carouselData[this.cardClicked], this.cardClicked);
        }
    }

    // To load data before rendering page
    loadCurrentUserVital() {
        this.isCarouselVisible = false;
        // Vital Data for carousel
        this.dataLoadingStarted();
        const isValue = this._storage.get('currentUserVital');
        if (isValue) {
            const data = this._storage.get<ICarouselData>('currentUserVital');
            this.loadCarouselData(data);
            this.isCarouselVisible = true;
        } else {
            this._participantDashboardService.getVitals(this.participantId).then(data => {
                this.dataLoadingCompleted();
                this.loadCarouselData(data);
                this.isCarouselVisible = true;
            }, error => {
                this.dataLoadingCompleted();
                this.isCarouselVisible = true;
            });
        }
    }
    // loadCurrentUserVital() {
    //     // Vital Data for carousel
    //     this.dataLoadingStarted();
    //     this._participantDashboardService.getVitals(this.participantId).then(data => {
    //         this._storage.set('currentUserVital', data);
    //         this.dataLoadingCompleted();
    //         this.loadCarouselData(data);
    //     }, error => {
    //         this.dataLoadingCompleted();
    //     });
    // }
    // To load carousel data
    loadCarouselData(data: ICarouselData) {
        this.selectedVitaltype = this._storage.get('vitalType');
        this._storage.remove('vitalType');
        this.carouselData = [];
        for (const i in data) {
            if (data[i]) {
                if (data[i].vital_desc === 'Activity') {
                } else {
                    this.carouselData.push(data[i]);
                    console.log(this.carouselData);
                }
            }
        }

        //refresh the carousel
        //this.carouselRefreshEvent.emit();

        for (const k in data) {
            if (data[k].vital_desc === 'Activity') {

            } else {
                if (k === 'lung_vital') {
                    this.currentVital = data[k][0].vitalType;
                    if (this.currentVital === 'FEV1' || this.currentVital === 'PEF' || this.currentVital === 'FVC') {
                        this.getLungsTabularView();
                        return;
                    }
                } else {
                    if (data[k] != null && data[k].vitalType) {
                        if (this.vitalName) {
                            this.currentVital = this.vitalName;
                        } else {
                            if (this.selectedVitaltype === "DEVELOPMENT") {
                                this.currentVital = "DEVELOPMENT";
                            } else if (this.selectedVitaltype === "LUNG"){
                                this.currentVital = "LUNG";
                                this.cardClicked = 1;
                            }else{
                                this.currentVital = data[k].vitalType;
                            }                            
                        }
                        if (this.currentVital === 'DEVELOPMENT') {
                            this.getDevelopmentTabularView();
                            return;
                        } else if (this.currentVital === 'LUNG') {
                            this.getLungsTabularView();
                            return;
                        } else {
                            this.vitalName = data[k].vital_desc;
                            this.getTabulerViewData('weight/bmi');
                            return;
                        }
                    }
                }
            }
        }
    }

    // To load Medication data before rendering page
    loadMedication() {
        this.dataLoadingStarted();
        // Vital Data for carousel
        this._participantDashboardService.getMedicationDetails(this.participantId).then(data => {
            this.dataLoadingCompleted();
            this.medicationDetails = data;
            this.activeMedication = data.active_medication;
            this.activeMedication.splice(3, this.activeMedication.length);
            this.status = this.medicationDetails.overall_compliance;
            this.value = this.medicationDetails.overall_compliance;
            // if critical
            if (this.medicationDetails.overall_compliance < 50) {
                this.statusColor = 'red';

            } else if (this.medicationDetails.overall_compliance >= 50 && this.medicationDetails.overall_compliance <= 75) { // if alert
                this.statusColor = 'yellow';
                this.medicationDetails.medStatus = 2;
            } else if (this.medicationDetails.overall_compliance > 75) { // if normal
                this.statusColor = 'normal';
                this.medicationDetails.medStatus = 0;
            }
            this.activeMedication.forEach(element => {
                if (element.medication_taken_percentage < 50) {
                    element.medStatus = 1;
                    element.medStatusColor = 'border-danger';
                } else if (element.medication_taken_percentage >= 50 && element.medication_taken_percentage <= 75) {
                    element.medStatus = 1;
                    element.medStatusColor = 'border-alert';
                }
                if (element.medication_taken_percentage > 75) {
                    element.medStatus = 0;
                    element.medStatusColor = 'border-normal';
                }
            });
        }, error => {
            this.dataLoadingCompleted();
        });
    }

    getLungsTabularView() {
        this.rows = [];
        this.columns = [];

        this.setTextForTimeFilter();

        const sub = this._participantDashboardService
            .getTabularViewOfLungs(this.participantId, this.firstDate, this.lastDate).subscribe(
            //success callback
            data => {
                if (data) {
                    data = data.json();
                    this.getColumnAndRow();
                    this.rows = data.all;
                    this.showTable = true;
                    this.tablularData = data.all;
                    if (this.tablularData.length) {
                        this.isDatePrevBtnDisabled = false;
                    } else {
                        this.isDatePrevBtnDisabled = true;
                    }
                    this.vitalName = data.vitalType;
                    // this.changeDataWithUnit('us');
                    this._storage.set('displayMonth', 0);
                    this._storage.set('timeLine', this.getTimeLineAsWeekOrMonth());
                    this.changeDataWithUnit(this.selectedUnit);
                }
                this.vitalGrid.offset = 0;
                sub.unsubscribe();
            },
            //failure callback
            err => {
                sub.unsubscribe();
            });

        this.subscription.push(sub);
    }
    // get Table data for Development
    getDevelopmentTabularView() {
        this.rows = [];
        this.columns = [];
        this.setTextForTimeFilter();
        const sub = this._participantDashboardService
            .getTabularViewOfDevelopment(this.participantId, this.firstDate, this.lastDate).subscribe(
            //success callback
            data => {
                if (data) {
                    data = data.json();
                    this.getColumnAndRow();
                    this.tablularData = data.all;
                    this.rows = data.all;
                    this.showTable = true;
                    if (this.tablularData.length) {
                        this.isDatePrevBtnDisabled = false;
                    } else {
                        this.isDatePrevBtnDisabled = true;
                    }
                    this.vitalName = data.vital_type;
                    // this.changeDataWithUnit('us');
                    this.getDevelopmentGraphData();
                }

                if (this.vitalGrid) {
                    this.vitalGrid.offset = 0;
                }

                sub.unsubscribe();
            },
            //failure callback
            err => {
                sub.unsubscribe();
            });
        this.subscription.push(sub);
    }

    setTextForTimeFilter() {
        const dateDispStr = this.firstDate.format('MMM D') + ' - ' + this.lastDate.format('MMM D');
        const today = CommonUtil.stripTime(moment());

        if (this.daysOptionSelected === '7') {
            this.dateDropdown[0].filterBy = '7 Days(' + dateDispStr + ')';
            this.dateDropdown[1].filterBy = '30 Days(' + moment(today).subtract(30, 'days').format('MMM D') + ' - ' + today.format('MMM D') + ')';
        } else {
            this.dateDropdown[0].filterBy = '7 Days(' + moment(today).subtract(7, 'days').format('MMM D') + ' - ' + today.format('MMM D') + ')';
            this.dateDropdown[1].filterBy = '30 Days(' + dateDispStr + ')';
        }

        this.setFilterSelectedText();

    }

    setFilterSelectedText() {
        const selectedOption = _.find(this.dateDropdown, val => val.id === this.daysOptionSelected);
        if (selectedOption) {
            this.selectedFilterText = selectedOption.filterBy;
        }
    }

    selectLungType(id) {
        const selectedOption = _.find(this.fevFvcDropdown, val => val.id === this.selectedFvc);
        if (selectedOption) {
            this.selectedLungValue = selectedOption.filterBy;
        }
        if (this.selectedLungValue === 'FEV1/FVC') {
            this.tooltipVal = this.lung.both;
        } else {
            this.tooltipVal = this.lung.other;
        }
        this.getLungsGraphData();
    }

    selectDevelopmentType(id) {
        const selectedOption = _.find(this.developmentDropdown, val => val.id === this.selectedDevelopment);
        if (selectedOption) {
            this.selectedDevelopmentValue = selectedOption.filterBy;
        }
        this.getDevelopmentGraphData();
    }

    // To get Lung graph data
    getLungsGraphData() {
        // putting the lung type graph selected in the local storage.
        this._storage.set('percentile', this.selectedLungValue);
        // condition to rename the variable to make the service call
        if (this.selectedLungValue === 'FEV1/FVC') {
            this.selectedLungValue = 'FEV1FVC';
        }
        const sub = this._participantDashboardService.getLungsGraphData(this.selectedLungValue,
            this.participantId, this.firstDate, this.lastDate).subscribe(
            //success callback
            data => {
                if (this.selectedLungValue === 'FEV1FVC') {
                    this.selectedLungValue = 'FEV1/FVC';
                }
                if (data) {
                    data = data.json();
                    this.graphData = data;
                } else {
                    this.graphData = {};
                }

                sub.unsubscribe();
            },
            //error callback
            err => {
                if (this.selectedLungValue === 'FEV1FVC') {
                    this.selectedLungValue = 'FEV1/FVC';
                }
                this.graphData = {};
                sub.unsubscribe();
            }
            );

        //this.subscription.push(sub);
    }

    // To get Development graph data
    getDevelopmentGraphData() {
        if (this.selectedDevelopmentValue === 'Weight/BMI') {
            this.selectedDevelopmentValue = 'WeightBMI';
        }
        this._storage.set('percentile', this.selectedDevelopmentValue);
        this._participantDashboardService.getDevelopmentGraphData(this.selectedDevelopmentValue.replace(' ', ''),
            this.participantId, this.firstDate, this.lastDate).then(data => {
                this.graphData = data;
            });
    }

    changeDataWithUnit(selectedUnit: string) {
        this.getColumnAndRow();
        this._storage.set('selectedUnit', selectedUnit);
        this.selectedUnit = selectedUnit;
        if (selectedUnit === 'metric') {
            this.metricDisplayFont = '700';
            this.usDisplayFont = '400';
        } else {
            this.usDisplayFont = '700';
            this.metricDisplayFont = '400';
        }
        _.forEach(this.tablularData, (val, key) => {
            val.fev1_value = val['fev1_value_' + this.selectedUnit];
            val.fvc_value = val['fvc_value_' + this.selectedUnit];
            val.pef_value = val['pef_value_' + this.selectedUnit];
            val.unit = val['unit_' + this.selectedUnit];
            if (val.fev1_value === null) {
                val.fev1_value_changed = '-';
            } else {
                val.fev1_value_changed = val.fev1_value + val.unit;
            }
            if (val.fvc_value === null) {
                val.fvc_value_changed = '-';
            } else {
                val.fvc_value_changed = val.fvc_value + val.unit;
            }
            if (val.fev1_fvc_value === null) {
                val.fev1_fvc_value_changed = '-';
            } else {
                val.fev1_fvc_value_changed = val.fev1_fvc_value + '%';
            }
            if (val.pef_value === null) {
                val.pef_value_changed = '-';
            } else {
                if (selectedUnit === 'metric') {
                   val.pef_value_changed = val.pef_value + 'L/min';
                }else {
                  val.pef_value_changed = val.pef_value + val.unit;
                }
            }
            if (selectedUnit === 'metric') {
                val.unit = val.unit ? val.unit.charAt(0) : '';
            }
        });
        this.getLungsGraphData();
    }

    changeDevelopmentUnit(selectedUnit: string) {
        this.getColumnAndRow();
        this.selectedUnit = selectedUnit;
        this._storage.set('selectedUnit', selectedUnit);
        if (selectedUnit == 'metric') {
            this.metricDisplayFont = '700';
            this.usDisplayFont = '400';
            this.matriceTable = true;
            this.usTable = false;
        } else {
            this.usDisplayFont = '700';
            this.metricDisplayFont = '400';
            this.matriceTable = false;
            this.usTable = true;
        }
        this.getDevelopmentGraphData();
    }

    // to delte the lung details
    deleteLungsDetails(deleteData) {
        if (deleteData.is_editable === 0) {
            if (this.toastCanDeleteBaseline) {
                this._toasterService.clear(this.toastCanDeleteBaseline.toastId);
            }
            this.toastCanDeleteBaseline = this._toasterService.pop('failure', 'Error', 'Baseline value cannot be deleted');
            return true;
        } else {
            this._modal.open(ConfirmDialogModalComponent, overlayConfigFactory({ edit: false, textToShow: this.deleteText }, CustomConfirmDialogModalContext)).then(data => {
                this.editData = false;
                this.editButton = true;
            });
            this.unsubDelete = this._globalEventEmitterService.modalDeleteClickObservable.subscribe(closed => {
                const obj = {
                    'vital_id': deleteData.vital_id,
                };
                this._participantDashboardService.deleteLungsDetails(obj).then(data => {
                    if (this.toastCanDeleteBaseline) {
                        this._toasterService.clear(this.toastCanDeleteBaseline.toastId);
                    }
                    this.toastCanDeleteBaseline = this._toasterService.pop('success', 'Deleted', data.success_message);
                    this.clearCurrentUserVital();
                    this.loadCurrentUserVital();
                    this.unsubDelete.unsubscribe();
                });
            });
        }
    }


    deleteDevelopmentDetails(deleteData) {
        // if (deleteData.is_editable === 0) {
        //   this._toasterService.pop('failure', 'Error', 'Baseline value cannot be deleted');
        //   return true;
        // } else {
        this._modal.open(ConfirmDialogModalComponent, overlayConfigFactory({ edit: false, textToShow: this.deleteText }, CustomConfirmDialogModalContext)).then(data => {
            this.editData = false;
            this.editButton = true;
        });
        this.unsubDelete = this._globalEventEmitterService.modalDeleteClickObservable.subscribe(closed => {
            const obj = {
                'whbmi_id': deleteData,
            };
            this._participantDashboardService.deleteDevelopmentDetails(obj).then(data => {
                if (this.toastCanDeleteBaseline) {
                    this._toasterService.clear(this.toastCanDeleteBaseline.toastId);
                }
                this.toastCanDeleteBaseline = this._toasterService.pop('success', 'Deleted', data.success_message);
                // this.getDevelopmentTabularView();
                this.clearCurrentUserVital()
                this.loadCurrentUserVital();
                this.unsubDelete.unsubscribe();
            });
        });
    }

    editDevelopmentDetails(dataEdit, baseUnit) {
        // if (dataEdit.is_editable === 0) {
        //   this._toasterService.pop('failure', 'Error', 'Baseline value cannot be edited');
        //   return true;
        // } else {
        let t;
        this._modal.open(DevelopmentModalComponent,
            overlayConfigFactory({
                edit: true, showBenchmark: true, developmentDetails: dataEdit,
                editable: true, baseUnit: baseUnit, btnText: 'Save', developmentModalSettingsData: 'development'
            },
                DevelopmentModalContext)).then(d => {
                    t = d.result.then(data => {
                        this.getDevelopmentTabularView();
                        this.clearCurrentUserVital()
                        this.loadCurrentUserVital();
                        this.editData = false;
                        this.editButton = true;
                    });
                });
        // }
    }


    editLungDetails(dataEdit, baseUnit) {
        if (dataEdit.is_editable === 0) {
            if (this.toastCanDeleteBaseline) {
                this._toasterService.clear(this.toastCanDeleteBaseline.toastId);
            }
            this.toastCanDeleteBaseline = this._toasterService.pop('failure', 'Error', 'Baseline value cannot be edited');
            return true;
        } else {
            let t;
            debugger
            this._modal.open(LungsModalComponent,
                overlayConfigFactory({ edit: true, showBenchmark: true, lungDetails: dataEdit, baseUnit: this.selectedUnit, editable: true, btnText: 'Save', lungsModalSettingsData: 'lungs' },
                    LungsModalContext)).then(d => {
                        t = d.result.then(data => {
                            this.clearCurrentUserVital()
                            this.getLungsTabularView();
                            this.loadCurrentUserVital();
                            this.editData = false;
                            this.editButton = true;
                        });
                    });
        }
    }

    // For Tabular View
    getTabulerViewData(status) {
        this.rows = [];
        this.columns = [];
        // this.dataLoadingStarted();
        if (this.vitalGrid) {
            this.vitalGrid.offset = 0;
        }

        this._participantDashboardService.getDataForTabularView(this.participantId, this.selectedTimeline, this.currentVital).then(data => {
            this.dataLoadingCompleted();
            if (this.currentVital === 'ACTIVITY') {
                if (_.isArray(data)) {
                    this.tablularData = data;
                } else {
                    this.tablularData.push(data);
                }
                for (const rowData of this.tablularData) {
                    rowData.distance = rowData.distance + ' miles';
                    rowData.calories = rowData.calories + ' Calories';
                }
                this.rows = this.tablularData;
                this.showTable = true;
            } else {
                const temp = [];
                for (const item of data.all) {
                    for (const rowData of item.data) {
                        if (this.currentVital === 'FLUID') {
                            rowData.fluid_intake_quantity = rowData.fluid_intake_quantity + ' ' + rowData.unit;
                        }
                        if (rowData.reported_by === null) {
                            rowData.reported_by = '-';
                        }
                        temp.push(rowData);
                    }
                }
                this.getColumnAndRow();
                this.rows = temp;
                this.showTable = true;
                this.tablularData = temp;
                if (this.currentVital === 'FLUID') {
                    this._participantDashboardService.getPatientsFluidDataForGraphStaff(this.participantId, this.selectedTimeline).then(result => {
                        this.graphData = result;
                        this.dataLoadingCompleted();
                    });
                } else {
                    this.graphData = data;
                }

            }

        }, error => {
            this.dataLoadingCompleted();
        });
    }

    /** method will call after selecting dropdown of daywisefilter */
    getUpdatedData() {
        this._storage.set('timeLine', this.selectedTimeline);
        this._storage.set('currentVital', this.currentVital);
        this.getTabulerViewData('weight/bmi');
    }

    /** to change date to TODAY or YESTERDAY in carousel card*/
    getVitalDate(date1, date2) {
        if (date1.search('Today') === 0) {
            return 'Today';
        } else if (date1.search('Yesterday') === 0) {
            return 'Yesterday';
        } else {
            return date2;
        }
    }

    /** carousel click on card this method will trigger to get Vital Information */
    getVitalData(vital, index) {
        // Setting up the highlighting of the card
        if (Array.isArray(vital) && vital[0].vital_desc === 'Lung Function') {
            this.enableEdit(false);
            if (this.selectedLungValue === 'FEV1/FVC') {
                this.tooltipVal = this.lung.both;
            } else {
                this.tooltipVal = this.lung.other;
            }
            this._storage.set('timeLine', this.daysOptionSelected);
            this.getLungsTabularView();
            this.cardClicked = index;
            this.vitalName = 'LUNG';
        } else if (vital.vitalType === 'DEVELOPMENT') {
            this.enableEdit(false);
            this.tooltipVal = this.development.tooltipString;
            this.getDevelopmentTabularView();
            this.changeDevelopmentUnit('metric')
            this.cardClicked = index;
            this.vitalName = 'DEVELOPMENT';
        } else {
            this.cardClicked = index;
            this.vitalName = vital.vital_desc;
            this.currentVital = vital.vitalType;
            this.getTabulerViewData('weight/bmi');
        }
    }

    /** to open Symptom Assesment Modal */
    openSymptomModal(input_data) {
        if (this.isSymptomModalOpen) {
            return;
        };
        this.isSymptomModalOpen = true;
        if (input_data.value) {
            var value = input_data.value;
        }
        if (input_data.vitalType === 'Weight/BMI' || input_data.vitalType === 'DEVELOPMENT') {
            this._participantDashboardService.getCurrentVitalSymptomAssessment(this.participantId, 'WHBMI', input_data.whbmi_id).then(data => {
                data.vitalName = this.vitalName;
                if (value) {
                    data.value = value;
                }
                this._modal.open(SymptomAssesmentModalComponent,
                    overlayConfigFactory({ edit: false, symptomAssesmentData: { data: data } }, SymptomAssesmentModalContext)).then(d => {
                        this.isSymptomModalOpen = false;
                    });
            });
        } else {
            this._participantDashboardService.getCurrentVitalSymptomAssessment(
                // change the lung string
                this.participantId, 'LUNG', input_data.vital_id).then(data => {
                    if (data) {
                        data.vitalName = this.vitalName;
                    }
                    if (value) {
                        data.value = value;
                    }
                    this._modal.open(SymptomAssesmentModalComponent,
                        overlayConfigFactory({ edit: false, symptomAssesmentData: { data: data } }, SymptomAssesmentModalContext)).then(d => {
                            this.isSymptomModalOpen = false;
                        });
                });
        }
    }

    openMedicationModal() {
        this._modal.open(AddMedicationModalComponent,
            overlayConfigFactory({ edit: true, showBenchmark: false, medicationAssesmentData: this.participantId },
                AddMedicationModalContext));
    }

    getCarePlanList() {
        this._participantDashboardService.getListOfCarePlans(this.participantId).then(data => {
            this.listOfCarePlans = data;

            // limiting the number of care team members to be shown to three
            this.listOfCarePlans.completed.splice(2, this.listOfCarePlans.completed.length);
        });
    }

    getClass(status) {
        switch (status) {
            case 0: return 'green';
            case 1: return 'text-orange';
            case 2: return 'text-danger';
            case -1: return 'text-dark-grey';
        }
    }

    /** method to get care team members */
    getCareTeamMembers() {
        this._participantDashboardService.getListOfCareTeamMembers(this.participantId).then(data => {
            this.careTeamMembers = data;
            // limiting the number of care team members to be shown to three
            this.careTeamMembers.splice(2, this.careTeamMembers.length);
            // Adding a key and value for name initials of the care team members.
            for (const careTeam in this.careTeamMembers) {
                if (this.careTeamMembers[careTeam]) {
                    this.careTeamMembers[careTeam].name = this.careTeamMembers[careTeam].first_name + ' ' + this.careTeamMembers[careTeam].last_name;
                    this.careTeamMembers[careTeam].staff_name_initials =
                        this.careTeamMembers[careTeam].first_name.charAt(0) + this.careTeamMembers[careTeam].last_name.charAt(0);
                }
            }
        });
    }

    dataLoadingStarted(): void {
        this.isDataLoading = true;
    }

    dataLoadingCompleted(): void {
        this.isDataLoading = false;
    }

    // open add data modal for participant health status
    openDevelopmentModal(selectedUnit) {
        let t;
        this._modal.open(DevelopmentModalComponent,
            overlayConfigFactory({ edit: true, editable: false, selectedUnit: this.selectedUnit, btnText: 'Add Data', developmentModalSettingsData: 'development' },
                DevelopmentModalContext)).then(d => {
                    t = d.result.then(data => {
                        this.carouselData = [];
                        // this.getDevelopmentTabularView();
                        this.clearCurrentUserVital()
                        this.loadCurrentUserVital()
                    });
                });
    }
    enableEdit(data) {
        this.editData = data;
        this.editButton = !data;
        this.getColumnAndRow();
    }

    // open add data modal for Lungs
    openLungsModal() {
        let t;
        this._modal.open(LungsModalComponent,
            overlayConfigFactory({ edit: true, editable: false, btnText: 'Add Data', lungsModalSettingsData: 'lungs' },
                LungsModalContext)).then(d => {
                    t = d.result.then(data => {
                        this.carouselData = [];
                        // this.getLungsTabularView();
                        this.clearCurrentUserVital();
                        this.loadCurrentUserVital();
                    });
                });
    }

    // US and Metrice toggle for Development
    metriceUSToggle(check_id) {
        if (check_id == 'us') {
            console.log("selecte US");
        } else {
            console.log("selecte Metrice");
        }
    }

    unSubscribe() {
        _.forEach(this.subscription, (sub) => {
            if (sub) {
                sub.unsubscribe();
            }
        });
    }

    ngOnDestroy() {
        this.unSubscribe()
    }
    // get column and row data on basis of card selection in carousel
    getColumnAndRow() {
        this.columns = this.getColumn(this.vitalName);
    }

    // To get column on the basis of vital selected
    getColumn(cardName: string) {
        switch (cardName) {
            case 'Fluid Intake': {
                const columnList = [
                    { name: 'Date & Time', cellTemplate: this.DateFormat },
                    { name: 'Fluid Type', prop: 'fluid_type' },
                    { name: 'Quantity', prop: 'fluid_intake_quantity' },
                    { name: 'Reported By', prop: 'reported_by' }];
                return columnList;
            }
            case 'Blood Glucose': {
                const columnList = [
                    { name: 'Date & Time', cellTemplate: this.DateFormat },
                    { name: this.vitalName, prop: 'value' },
                    { name: 'Reported', cellTemplate: this.BGReportColumn },
                    { name: 'Reported By', prop: 'reported_by' },
                    { name: 'Associated Symptom Assessment', cellTemplate: this.viewSymptom }];
                return columnList;
            }
            case 'Activity': {
                const columnList = [
                    { name: 'Date & Time', cellTemplate: this.DateFormat },
                    { name: 'Steps', prop: 'steps' },
                    { name: 'Distance', prop: 'distance' },
                    { name: 'Calories Burned', prop: 'calories' },
                    { name: 'Reported By', prop: 'reported_by' }];
                return columnList;
            }
            case 'LUNG': {
                if (!this.editData) {
                    const columnList = [
                        { name: 'Date & Time', cellTemplate: this.DateFormat },
                        { name: 'Reported By', prop: 'reported_by' },
                        { name: 'FEV1', prop: 'fev1_value_changed' },
                        { name: 'FVC', prop: 'fvc_value_changed' },
                        { name: 'FEV1/FVC', prop: 'fev1_fvc_value_changed' },
                        { name: 'PEF', prop: 'pef_value_changed' },
                        { name: 'Assess', cellTemplate: this.editLung }];
                    return columnList;
                } else {
                    const columnList = [
                        { name: 'Date & Time', cellTemplate: this.DateFormat },
                        { name: 'Reported By', prop: 'reported_by' },
                        { name: 'FEV1', prop: 'fev1_value_changed' },
                        { name: 'FVC', prop: 'fvc_value_changed' },
                        { name: 'FEV1/FVC', prop: 'fev1_fvc_value_changed' },
                        { name: 'PEF', prop: 'pef_value_changed' },
                        { name: 'Actions', cellTemplate: this.editLungAction }];
                    return columnList;
                }
            }
            case 'DEVELOPMENT': {
                if (!this.editData) {
                    const columnList = [
                        { name: 'Date & Time', cellTemplate: this.DateFormat },
                        { name: 'Reported By', prop: 'reported_by' },
                        { name: 'Weight', cellTemplate: this.weightUs },
                        { name: 'Height', cellTemplate: this.heightUs },
                        { name: 'BMI', cellTemplate: this.bmiUs },
                        { name: 'Assess', cellTemplate: this.editDevelopment }];
                    return columnList;
                } else {
                    const columnList = [
                        { name: 'Date & Time', cellTemplate: this.DateFormat },
                        { name: 'Reported By', prop: 'reported_by' },
                        { name: 'Weight', cellTemplate: this.weightUs },
                        { name: 'Height', cellTemplate: this.heightUs },
                        { name: 'BMI', cellTemplate: this.bmiUs },
                        { name: 'Actions', cellTemplate: this.editDevelopmentAction }];
                    return columnList;
                }
            }
            default: {
                const columnList = [
                    { name: 'Date & Time', cellTemplate: this.DateFormat },
                    { name: this.vitalName, prop: 'value' },
                    { name: 'Reported By', prop: 'reported_by' },
                    { name: 'Associated Symptom Assessment', cellTemplate: this.viewSymptom }];
                return columnList;
            }
        }
    }

    onPage(event) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
        }, 100);
    }

    // To get month or week instead of 30 or 7
    getTimeLineAsWeekOrMonth() {
        let timeLine;
        if (this.daysOptionSelected === '7') {
            timeLine = 'week';
        } else if (this.daysOptionSelected === '30') {
            timeLine = 'month';
        }
        return timeLine;
    }
}


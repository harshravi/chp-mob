import { Component, OnInit, SimpleChange, OnChanges, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { ToasterService } from 'angular2-toaster';
import { CarePlanPatientsService } from './care-plan-patients.service';
import { CARE_PLAN_PATIENTS_CONSTANTS } from './care-plan-patients-constants';
import { DatatableComponent } from '@swimlane/ngx-datatable';
/** importing breadcrumb service to set breadcrumb */
import { BreadcrumbService } from '../../../services';
import { IRouteQueryParams, IEnrollmentOption, ICriticalOption } from './model/care-plan-patients.model';
import * as _ from 'lodash';

/** Imports for the Modal to be involked on Button Click */
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';

import { InvitePatientModalContext, InvitePatientModalComponent } from './../global-modal';

@Component({
  selector: 'app-care-plan-patients',
  templateUrl: './care-plan-patients.component.html',
  styleUrls: ['./care-plan-patients.component.scss'],
  providers: [CarePlanPatientsService]
})
export class CarePlanPatientsComponent implements OnInit, OnChanges, AfterViewChecked {
  // Selected patients's ID whose details are dispalyed.
  currentComponentWidth: any;
  @ViewChild('myTable') table: DatatableComponent;
  @ViewChild('tableWrapper') tableWrapper;

  // Selected patients's ID whose details are dispalyed.
  patientsId: any;
  // patients details of the selected care plan.
  patientsDetails: any;
  headerText = 'Patient List';
  timeout: any;
  searchedData = [];
  selectedEnroll = '1';
  selectedStatus = '3';
  tolatPatient;
  statusFlag = false;
  enrollmentFlag = false;
  enrollStatus;
  riskStatus;
  // get participant ID
  participant_id: any;
  // get program reference number
  program_ref_no: any;
  enrollmentStatusQueryValue: string;
  criticalStausQueryValue: string;
  isDataLoading: boolean;
  beforeSearchData: any;
  searchValue: string;
  isInvitePatientServiceDone = true;

  // List of participant risk status
  ParticipantStatus: ICriticalOption[] = [
    { status: CARE_PLAN_PATIENTS_CONSTANTS.ALL_RISK_STATUS, value: CARE_PLAN_PATIENTS_CONSTANTS.CONST_THREE },
    { status: CARE_PLAN_PATIENTS_CONSTANTS.DATA_NOT_RECEIVED, value: CARE_PLAN_PATIENTS_CONSTANTS.CONST_MINUS_ONE },
    { status: CARE_PLAN_PATIENTS_CONSTANTS.NORMAL, value: CARE_PLAN_PATIENTS_CONSTANTS.CONST_ZERO },
    { status: CARE_PLAN_PATIENTS_CONSTANTS.ALERT, value: CARE_PLAN_PATIENTS_CONSTANTS.CONST_ONE },
    { status: CARE_PLAN_PATIENTS_CONSTANTS.CRITICAL, value: CARE_PLAN_PATIENTS_CONSTANTS.CONST_TWO }
  ];
  // List of enrollment risk status
  ParticipantEnrollment: IEnrollmentOption[] = [
    { enroll: CARE_PLAN_PATIENTS_CONSTANTS.ALL_STATUS, value: CARE_PLAN_PATIENTS_CONSTANTS.CONST_ONE },
    { enroll: CARE_PLAN_PATIENTS_CONSTANTS.INVITED, value: CARE_PLAN_PATIENTS_CONSTANTS.CONST_TWO },
    { enroll: CARE_PLAN_PATIENTS_CONSTANTS.ENROLLED, value: CARE_PLAN_PATIENTS_CONSTANTS.CONST_THREE }
  ];

  constructor(private route: ActivatedRoute,
    private _carePlanPatientsService: CarePlanPatientsService,
    private _breadcrumbService: BreadcrumbService,
    private _storage: LocalStorageService,
    private changeDetectorRef: ChangeDetectorRef, private _toasterService: ToasterService, private _modal: Modal) {
    this.patientsId = route.snapshot.params['id'];
  }

  ngAfterViewChecked() {
    // Check if the table size has changed,
    if (this.table && this.table.recalculate && (this.tableWrapper.nativeElement.clientWidth !== this.currentComponentWidth)) {
      this.currentComponentWidth = this.tableWrapper.nativeElement.clientWidth;
      this.table.recalculate();
      this.changeDetectorRef.detectChanges();
    }
  }

  // function for filter data based on typed charecter
  updateFilter(event) {
    let val = event.target.value;
    val = val.toLowerCase();
    // filter our data
    let searchedData = this.beforeSearchData.filter(function (d) {
      if (d.firstName != null) {
        return d.participant_name.toLowerCase().indexOf(val) !== -1 || !val;
      }
    });
    if (searchedData.length === 0) {
      searchedData = this.beforeSearchData.filter(function (d) {
        if (d.email_id != null) {
          return d.email_id.toLowerCase().indexOf(val) !== -1 || !val;
        }
      });
    }
    if (event.target.value === '') {
      this.patientsDetails = this.beforeSearchData;
    } else {
      this.patientsDetails = searchedData;
    }

    // update the patientsDetails
    this.table.offset = 0;
  }

  filter() {
    this.table.offset = 0;
    this.patientsDetails = _.cloneDeep(this.searchedData);
    this.searchValue = '';
    // filter by enrollment status
    const enrollFound: IEnrollmentOption = _.find(this.ParticipantEnrollment, { value: this.selectedEnroll });
    if (enrollFound && enrollFound.enroll !== CARE_PLAN_PATIENTS_CONSTANTS.ALL_STATUS) {
      this.patientsDetails = _.filter(this.patientsDetails, (val: any) =>
        val.enrolmentStatus === enrollFound.enroll);
    }

    const criticalFound: ICriticalOption = _.find(this.ParticipantStatus, { value: this.selectedStatus });
    if (criticalFound && criticalFound.status !== CARE_PLAN_PATIENTS_CONSTANTS.ALL_RISK_STATUS) {
      this.patientsDetails = _.filter(this.patientsDetails, (val: any) =>
        parseInt(val.participantStatus) === parseInt(criticalFound.value));
    }

    this.beforeSearchData = this.patientsDetails;
  }

  ngOnInit() {
    let map = new Map<string, string>();
    map.set('carePlanName', String(this._storage.get('carePlanName')));
    map.set('id', String(this._storage.get('carePlanId')));
    // To identify from which page calling this component
    let pageName = this.route.snapshot.params['viewName'];
    if (pageName === 'PatientProfile') {
      map.set('patientName', String(this._storage.get('patientName')));
      map.set('patientId', String(this._storage.get('participantId')));
      this._breadcrumbService.setBreadcrumbs('Patient List From Patient Profile', map);
    } else if (pageName === 'CarePlan') {
      // patient list from care plan of patient profile when navigate from careplan card of patient profile
      let patientListFromCareplan = this._storage.get('careTeamFromPatientProfile');
      if (patientListFromCareplan) {
        map.set('carePlanName', String(this._storage.get('carePlanName')));
        map.set('carePlanId', String(this._storage.get('carePlanId')));
        map.set('patientName', String(this._storage.get('participantName')));
        map.set('id', String(this._storage.get('participantId')));
        this._breadcrumbService.setBreadcrumbs('Patient List From CarePlan of Patient Profile', map);
      } else {
        this._breadcrumbService.setBreadcrumbs('Patient List From CarePlan', map);
      }
    }

    const queryParams: IRouteQueryParams = <IRouteQueryParams>this.route.snapshot.params;
    this.enrollmentStatusQueryValue = queryParams.enrollmentStatus;
    this.criticalStausQueryValue = queryParams.criticalStatus;

    const enrollFound: IEnrollmentOption = _.find(this.ParticipantEnrollment, { enroll: this.enrollmentStatusQueryValue });
    if (enrollFound) {
      this.selectedEnroll = enrollFound.value;
    }

    const criticalFound: ICriticalOption = _.find(this.ParticipantStatus, { status: this.criticalStausQueryValue });
    if (criticalFound) {
      this.selectedStatus = criticalFound.value;
    }

    // Calling the service to load the patients details by passing Id.
    this.getPatientList();

    // setTimeout(() => {
    //   this.searchedData = _.cloneDeep(this.patientsDetails);
    // }, 2000);

  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (changes['patientsDetails'] !== undefined) {
      //this.searchedData = _.cloneDeep(this.patientsDetails);
    }
  }

  // Function to call service for patientsDetails
  getPatientList() {
    this.dataLoadingStarted();
    this._carePlanPatientsService.getCarePlanPatientsDetails(this.patientsId).then(data => {
      this.dataLoadingCompleted();
      data.forEach(v => {
        if (v.age == null) {
          v.age = '-';
        } if (v.enrolmentStatus === 'Invited') {
          v.carePlan = '-';
          v.age = '-';
        }
      });

      this.patientsDetails = data;
      this.searchedData = _.cloneDeep(this.patientsDetails);

      this.filter();

      // this.enrollmentSelection(this.selectedEnroll);
      // this.statusSelection(this.selectedStatus);

      // this.enrollStatus = this.enrollmentStatusQueryValue || 'All Status';
      // this.riskStatus = this.criticalStausQueryValue || 'All Risk Status';
      // this.getPatientListWithFilter();
    }, error => {
      this.dataLoadingCompleted();
    });
  }

  // Function to call service for Patients Details based on filter
  getPatientListWithFilter() {
    this.dataLoadingStarted();
    this._carePlanPatientsService.patientsDetailsWithFilter(this.patientsId, this.enrollStatus, this.riskStatus).then(data => {
      this.dataLoadingCompleted();
      data.forEach(v => {
        if (v.age == null) {
          v.age = '-';
        }
      });
      this.patientsDetails = data;
    }, error => {
      this.dataLoadingCompleted();
    });
  }

  // Based on status we are showing care plan patients text color name
  getColorStatus(row) {
    if (row.enrolmentStatus === 'Invited') {
      return 'text-success';
    } else {
      return '';
    }
  }
  // Enrolled Participant to CarePlan
  getEnrolledParticipant(participant_id) {
    this.dataLoadingStarted();
    const obj = {
      'participant_id': participant_id,
      'program_ref_no': this.patientsId
    };
    this._carePlanPatientsService.enrolledParticipant(obj).then(data => {
      this.dataLoadingCompleted();
      this.getPatientList();
    }, error => {
      this.dataLoadingCompleted();
      const errorObj = JSON.parse(error._body);
      this._toasterService.pop('error', 'Error', errorObj.error_message);
    });

  }

  dataLoadingStarted(): void {
    this.isDataLoading = true;
  }

  dataLoadingCompleted(): void {
    this.isDataLoading = false;
  }
  // To edit invited patient
  editInvitedPatient(emailId) {
    let t;
    if (!this.isInvitePatientServiceDone) {
      return;
    }
    this.isInvitePatientServiceDone = false;
    let program_ref_num = String(this._storage.get('carePlanId'))
    this._carePlanPatientsService.getInvitedPatientDetails(emailId, program_ref_num).then(dataCarePlan => {
      dataCarePlan.edit = true;
      dataCarePlan.program_ref_num = program_ref_num;
      this.isInvitePatientServiceDone = true;
      this._modal.open(InvitePatientModalComponent,
        overlayConfigFactory({
          edit: true, invitePatientData: { data: dataCarePlan }
        }, InvitePatientModalContext)).then(d => {
          t = d.result.then(data => {
            this.getPatientList();
          });
        });
    }, err => {
      this.isInvitePatientServiceDone = true;
    }
    );
  }
}

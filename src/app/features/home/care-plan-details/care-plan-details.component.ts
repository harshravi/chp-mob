import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarePlanDetailsService } from './care-plan-details.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ValidationService } from '../../../components/core/error-messages';
import { ToasterService } from 'angular2-toaster';
import { LocalStorageService } from 'angular-2-local-storage';
/** Imports for the Modal to be involked on Button Click */
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';

/** importing breadcrumb service to set breadcrumb */
import { BreadcrumbService } from '../../../services';

import { DateUtilityService } from '../../../services';

import { InvitePatientModalContext, InvitePatientModalComponent } from './../global-modal';

@Component({
  selector: 'app-care-plan-details',
  templateUrl: './care-plan-details.component.html',
  styleUrls: ['./care-plan-details.component.scss'],
  providers: [CarePlanDetailsService]
})
export class CarePlanDetailsComponent implements OnInit {
  // Refers to a formGroup and is being Declared as a FormGroup.
  form: FormGroup;
  // Selected program's ID whose details are dispalyed.
  programId: any;
  carePlanName: any;
  // Details of the selected care plan.
  programDetails: any;
  // Colors of the count boxes based upon the program status.
  colorOfBoxTextEnrolled = 'green';
  colorOfBoxTextCompleted = 'text-warning';
  colorOfBoxTextCritical = 'text-danger';
  colorOfBoxWhite = 'white-bg';
  borderOfBox = 'border-all';
  noPadClassForComponent = 'no-padding';
  // Constant text to be dispalyed as the headings of the Icontent boxes
  programOverViewText = 'Care Plan Overview';
  patientOverViewText = 'Patient Overview';
  criteriaText = 'Criteria';
  goalText = 'Goals';
  careTeamText = 'Care Team';
  InviteParticipantText = 'Invite New Patient';
  displayTextEnrolled = 'ENROLLED';
  displayTextInvited = 'INVITED';
  displayTextUnassigned = 'UNASSIGNED';
  displayTextCritical = 'CRITICAL';
  displayTextAlert = 'ALERT';
  // input style for the chips component
  styleInputForChips = 'bg-alert';
  // Object holding all the values to be passed as tags
  listOfTags = [];
  maxDate;
  genderSelection = [
    { genderLabel: 'Male' },
    { genderLabel: 'Female' }
  ];
  isDataLoading: boolean;
  isInvitePatientServiceDone = true;

  public mrnMask = [/([A-Za-z0-9 ])/, /([A-Za-z0-9 ])/, /([A-Za-z0-9 ])/,
    /([A-Za-z0-9 ])/, /([A-Za-z0-9 ])/, /([A-Za-z0-9 ])/, /([A-Za-z0-9 ])/, /([A-Za-z0-9 ])/, /([A-Za-z0-9 ])/, /([A-Za-z0-9 ])/,
    /([A-Za-z0-9 ])/, /([A-Za-z0-9 ])/, /([A-Za-z0-9 ])/, /([A-Za-z0-9 ])/, /([A-Za-z0-9 ])/
  ];
  disableSendInvite = true;
  constructor(private route: ActivatedRoute, private _carePlanDetailsService: CarePlanDetailsService,
    private _fb: FormBuilder, private _toasterService: ToasterService,
    private breadcrumbService: BreadcrumbService, private _storage: LocalStorageService, private _dateUtilityService: DateUtilityService,
    private _modal: Modal) {
    this.programId = route.snapshot.params['id'];
    route.snapshot.data['breadcrumb'] = route.snapshot.params['programName'];
  }

  ngOnInit() {
    let map = new Map<string, string>();
    map.set('carePlanName', this.route.snapshot.params['programName']);
    map.set('id', String(this._storage.set('carePlanId', this.route.snapshot.params['id'])));
    this._storage.set('carePlanName', this.route.snapshot.params['programName']);
    this._storage.set('carePlanId', this.route.snapshot.params['id']);
    // To identify from which page calling this component
    const pageName = this.route.snapshot.params['viewName'];
    if (pageName === 'PatientProfile') {
      this._storage.set('careTeamFromPatientProfile', true);
      map.set('patientName', String(this._storage.get('patientName')));
      map.set('patientId', String(this._storage.get('participantId')));
      this.breadcrumbService.setBreadcrumbs('View CarePlan Details from Patient Profile', map);
    } else if (pageName === 'CarePlan') {
      this.breadcrumbService.setBreadcrumbs('View CarePlan Details', map);
    }
    this.form = this._fb.group({
      'first_name': ['', ValidationService.firstName],
      'last_name': ['', ValidationService.lastName],
      'email_id': ['', ValidationService.emailValidator],
      'mrn': ['', ValidationService.alphaNumeric],
      'dob': ['', ValidationService.dateOfBirth],
      'gender': ['']
    });
    this.maxDate = new Date();
    this.getProgramDetails();
  }

  getProgramDetails() {
    this.dataLoadingStarted();
    this.listOfTags = []; // emptying the list again.So that values are not repeated
    // calling the service to load the program details by passing program Id.
    this._carePlanDetailsService.getCarePlanDetails(this.programId).then(data => {
      this.dataLoadingCompleted();
      this.programDetails = data;
      this.route.snapshot.data['breadcrumb'] = this.programDetails.program_name;
      // limiting the number of care team members to be shown to three
      this.programDetails.staff_details.splice(3, this.programDetails.staff_details.length);
      this.checkProgramEndDateToDisableInvites(this.programDetails.end_date);
      // Creating the object to be passed for the tags component.
      if (this.programDetails.data_ranges) {
        for (const vital of this.programDetails.data_ranges) {
          this.listOfTags.push(vital.data_description);
        }
      }
      // Adding a key and value for name initials of the care team members.
      for (const careTeam in this.programDetails.staff_details) {
        if (careTeam) {
          const temp = this.programDetails.staff_details[careTeam].staff_name.split(' ');
          this.programDetails.staff_details[careTeam].staff_name_initials = temp[0].charAt(0) + temp[temp.length - 1].charAt(0);
        }
      }
    }, error => {
      this.dataLoadingCompleted();
    });
  }
  // send care plan invitations to the users.
  // Bulk invites can be send with comma seprated emailID's
  sendCarePlanInvites(invitationObject) {
    this.checkProgramEndDateToDisableInvites(this.programDetails.end_date);
    const emailString = invitationObject.email_id;
    invitationObject.email_id = emailString.split(',');
    invitationObject.program_ref_no = this.programId;
    invitationObject.dob = this.changeDateFormat(invitationObject.dob);
    this._carePlanDetailsService.sendCarePlanInvites(invitationObject).then(data => {
      this.getProgramDetails();
      this.form.reset();
      this.form.get('gender').setValue('');
      if (data.success_message) {
        this._toasterService.pop('success', 'Success', data.success_message);
      }
    }, error => {
      this.form.reset();
      const errorObj = JSON.parse(error._body);
      this._toasterService.pop('error', 'Error', errorObj.error_message);
    });
  }

  /**
   * Check for program end date to disable the send invites button.
   */
  checkProgramEndDateToDisableInvites(endDate) {
    if (endDate !== null) {
      const todaysDate = moment(new Date());
      const ts = moment(todaysDate).valueOf();
      const programEndDate = moment(endDate);
      const result = programEndDate.diff(ts, 'days');
      if (result >= 0) {
        this.disableSendInvite = false;
      } else {
        this.disableSendInvite = true;
      }
    } else {
      this.disableSendInvite = false;
    }
  }
  gender(selectedGender) {
    this.form.value.gender = selectedGender;
  }
  changeDateFormat(date) {
    return moment(date).format('YYYY-MM-DD');
  }
  startDateChange() {
    this.form.value.dob = moment(this.form.value.dob).format('YYYY-MM-DD');
  }


  dataLoadingStarted(): void {
    this.isDataLoading = true;
  }

  dataLoadingCompleted(): void {
    this.isDataLoading = false;
  }
  // open modal to invite patient
  invitePatient() {
    let t;
    if (!this.isInvitePatientServiceDone) {
      return;
    }
    this.isInvitePatientServiceDone = false;
    // calling the service to load the program details by passing program Id.
    this._carePlanDetailsService.getCarePlanDetails(this.programId).then(dataCarePlan => {
      dataCarePlan.edit = false;
      this.isInvitePatientServiceDone = true;
      this._modal.open(InvitePatientModalComponent,
        overlayConfigFactory({
          edit: false, invitePatientData: { data: dataCarePlan }
        }, InvitePatientModalContext)).then(d => {
          t = d.result.then(data => {
            this.getProgramDetails();
          });
        });
    }, err => {
      this.isInvitePatientServiceDone = true;
    }
    );
  }
}

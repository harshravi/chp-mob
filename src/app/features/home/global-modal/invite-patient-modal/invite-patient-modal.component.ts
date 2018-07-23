import { Component, OnInit, DoCheck } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { ToasterService } from 'angular2-toaster';
import { InvitePatientModalContext } from './invite-patient-context';
import { LocalStorageService } from 'angular-2-local-storage';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ValidationService } from '../../../../components/core/error-messages';
import { CarePlanDetailsService } from '../../../home/care-plan-details/care-plan-details.service';
import { IProgramDetails, IStaffDetails } from './model/invite-patient-modal.model';


@Component({
  selector: 'app-invite-patient-modal',
  templateUrl: './invite-patient-modal.component.html',
  styleUrls: ['./invite-patient-modal.component.scss'],
  providers: [CarePlanDetailsService]
})
export class InvitePatientModalComponent implements OnInit, CloseGuard, ModalComponent<InvitePatientModalContext>, DoCheck {
  context: InvitePatientModalContext;
  programDetails: IProgramDetails;
  editData;
  showCareTeamList = false;
  searchValue: string;
  maxDate: Date;

  genderSelection: { genderLabel: string }[] = [
    { genderLabel: 'Male' },
    { genderLabel: 'Female' }
  ];

  // Refers to a formGroup and is being Declared as a FormGroup.
  form: FormGroup;
  public mrnMask: RegExp[] = [/([A-Za-z0-9 ])/, /([A-Za-z0-9 ])/, /([A-Za-z0-9 ])/, /([A-Za-z0-9 ])/,
    /([A-Za-z0-9 ])/, /([A-Za-z0-9 ])/, /([A-Za-z0-9 ])/, /([A-Za-z0-9 ])/, /([A-Za-z0-9 ])/, /([A-Za-z0-9 ])/,
    /([A-Za-z0-9 ])/, /([A-Za-z0-9 ])/, /([A-Za-z0-9 ])/, /([A-Za-z0-9 ])/, /([A-Za-z0-9 ])/
  ];

  // Selected program's ID whose details are dispalyed.
  disableSendInvite = true;
  showSelect = false;
  staff_id: String;
  selectedVal = 'Select';
  selectedCareTeam = false;
  invited = false;
  message = 'Once a care team member is assigned to a patient, the care team member will receive all relevant notifications.Every Patient must be assigned to a care team member to ensure optimal care.';
  showConfirmMsg = false;
  beforeSearch = [];
  disableCloseButton = false;
  // Var for highlighting div which is selected to add medication
  highlightedSearchedRow: number;
  constructor(public dialog: DialogRef<InvitePatientModalContext>,
    private _storage: LocalStorageService, private _fb: FormBuilder, private _carePlanDetailsService: CarePlanDetailsService,
    private _toasterService: ToasterService) {
    this.context = dialog.context;
    this.programDetails = this.context.invitePatientData['data'];
    this.editData = this.context.invitePatientData['data'];
    if (this.editData.gender === '1') {
      this.editData.gender = 'Male';
    } else if (this.editData.gender === '2') {
      this.editData.gender = 'Female';
    }
    if (this.context.edit === true) {
      this.showSelect = true;
    }
    this.diplayIntials();
    this.beforeSearch = this.programDetails.staff_details;
  }
  ngOnInit() {
    this.makeFormEmpty();
    if (this.editData.edit) {
      this.setPatchValueOnEdit();
      this.selectedCareTeam = true;
    }
    this.maxDate = new Date();
  }
  ngDoCheck() {
    // TO make close button enable/disable

    // for (const i in this.form.value) {
    //   if (this.form.value[i] !== '' && this.form.value[i] !== null) {
    //     this.disableCloseButton = false;
    //     break;
    //   } else {
    //     this.disableCloseButton = true;
    //   }
    // }
  }
  closeInvitePatientModal() {
    this.dialog.close();
  }
  invitePatient() {

  }
  displayCareTeamList() {
    this.showCareTeamList = true;
  }
  startDateChange() {
    this.form.value.dob = moment(this.form.value.dob).format('YYYY-MM-DD');
  }
  // send care plan invitations to the users.
  // Bulk invites can be send with comma seprated emailID's
  sendCarePlanInvites(invitation) {
    this.highlightedSearchedRow = null;
    this.checkProgramEndDateToDisableInvites(this.programDetails.end_date);

    const emailString = invitation.email_id;

    invitation.email_id = emailString.split(',');
    invitation.program_ref_no = this.programDetails.program_ref_no;
    invitation.staff_id = this.staff_id;
    invitation.dob = this.changeDateFormat(invitation.dob);
    if (!this.editData.edit) {
      this._carePlanDetailsService.sendCarePlanInvites(invitation).then(data => {
        this.form.reset();
        this.form.markAsUntouched();
        this.selectedCareTeam = false;
        this.highlightedSearchedRow = null;
        this.programDetails.staff_details = this.beforeSearch;
        this.searchValue = '';
        this.form.get('gender').setValue('');
        if (data.success_message) {
          this.invited = true;
          this.message = 'Patient Invited';
          //this.message = errorObj.error_message;
        }
      }, error => {
       // this.highlightedSearchedRow = null;
       // this.form.reset();
       // this.form.markAsUntouched();
        this.selectedCareTeam = true;
        const errorObj = JSON.parse(error._body);
        this.invited = true;
        this.message = errorObj.error_message;
      });
    } else {
      invitation.program_ref_no = String(this._storage.get('carePlanId'));
      console.log(invitation.program_ref_no);
      this._carePlanDetailsService.updateCarePlanInvites(invitation).then(data => {
        this.form.reset();
        this.form.markAsUntouched();
        this.selectedCareTeam = false;
        this.highlightedSearchedRow = null;
        this.form.get('gender').setValue('');
        if (data.success_message) {
          this.invited = true;
          this.message = 'Patient Invited';
        }
      }, error => {
       // this.highlightedSearchedRow = null;
       // this.form.reset();
       // this.form.markAsUntouched();
        this.selectedCareTeam = false;
        const errorObj = JSON.parse(error._body);
        this.invited = true;
        this.message = errorObj.error_message;
      });
    }
  }
  /**
   * Check for program end date to disable the send invites button.
   */
  checkProgramEndDateToDisableInvites(endDate: string) {
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

  changeDateFormat(date: string): string {
    return moment(date).format('YYYY-MM-DD');
  }

  gender(selectedGender: string) {
    this.form.value.gender = selectedGender;
  }

  careTeamSelected(careTeam: IStaffDetails, index) {
    this.showSelect = true;
    this.selectedCareTeam = true;
    this.staff_id = careTeam.staff_id;
    this.selectedVal = careTeam.staff_name;
    this.highlightedSearchedRow = index;
  }

  confirm() {
    if (this.form.touched || this.selectedCareTeam === true) {
      this.showConfirmMsg = true;
    } else {
      this.showConfirmMsg = false;
      this.confirmed();
    }
  }

  confirmed() {
    this.dialog.close(true);
  }

  closeConfirmMsg() {
    this.showConfirmMsg = false;
  }

  getCareTeam(event) {
    let val = event.target.value;
    val = val.toLowerCase();
    this.highlightedSearchedRow = null;
    this.selectedCareTeam = false;
    // filter our data
    if (val) {
      const searchedData = this.beforeSearch.filter((d) => {
        if (d.staff_name != null) {
          return d.staff_name.toLowerCase().indexOf(val) !== -1 || !val;
        }
      });

      this.programDetails.staff_details = searchedData;
    } else {
      this.programDetails.staff_details = this.beforeSearch;
    }
  }
  makeFormEmpty() {
    this.form = this._fb.group({
      'first_name': ['', ValidationService.firstName],
      'last_name': ['', ValidationService.lastName],
      'email_id': ['', ValidationService.emailValidator],
      'mrn': ['', ValidationService.alphaNumeric],
      'dob': ['', ValidationService.dateOfBirth],
      'gender': ['']
    });
  }

  // To disply intials of careteam member
  diplayIntials() {
    // Adding a key and value for name initials of the care team members.
    for (const careTeam in this.programDetails.staff_details) {
      if (careTeam) {
        const temp = this.programDetails.staff_details[careTeam].staff_name.split(' ');
        this.programDetails.staff_details[careTeam].staff_name_initials = temp[0].charAt(0) + temp[temp.length - 1].charAt(0);
      }
    }
  }
  // To set invited patient detail to form
  setPatchValueOnEdit() {
    this.form.patchValue({
      'first_name': this.editData.first_name,
      'last_name': this.editData.last_name,
      'email_id': this.editData.email,
      'mrn': this.editData.mrn,
      'dob': this.editData.dob,
      'gender': this.editData.gender
    });
    this.staff_id = this.editData.staff_id;

    for (let i = 0; i < this.editData.staff_details.length; i++) {
      if (this.editData.staff_details[i]) {
        if (this.editData.staff_details[i].staff_id === this.staff_id) {
          this.highlightedSearchedRow = i;
        }
      }
    }
  }
}

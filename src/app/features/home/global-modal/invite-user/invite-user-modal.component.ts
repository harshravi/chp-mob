import { Component, OnInit, SimpleChange, OnChanges } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { CustomInviteUserModalContext } from './custom-invite-user-modal-context';
import { InviteUserService } from './invite-user.service';
import { ToasterService } from 'angular2-toaster';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ValidationService } from '../../../../components/core/error-messages';
import { IRoleListType } from './model/role-list.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user-modal.component.html',
  styleUrls: ['./invite-user-modal.component.scss'],
  providers: [InviteUserService]
})

export class InviteUserModalComponent implements OnInit, OnChanges, CloseGuard, ModalComponent<CustomInviteUserModalContext> {
  // Refers to a formGroup and is being Declared as a FormGroup.
  form: FormGroup;

  // Declaring a variable which is of type CostomModalContext.
  context: CustomInviteUserModalContext;
  // List of roles
  listOfRoles: IRoleListType;

  // Varaibles for role object.
  invalidEmails: string;
  errorMessageStr: string;
  isDataLoading: boolean;
  constructor(public dialog: DialogRef<CustomInviteUserModalContext>, private _inviteUserService: InviteUserService,
    private _toasterService: ToasterService, private _fb: FormBuilder) {
    // Getting and Storing the referance of the dialog context.
    this.context = dialog.context;
    // Setting close guard form the Dialog.
    dialog.setCloseGuard(this);


    // Attaching close guard to the dialog component.
    dialog.setCloseGuard(this);
  }

  get user_list(): FormArray { return this.form.get('user_list') as FormArray; }

  ngOnInit() {
    this.dataLoadingStarted();
    this.form = this._fb.group({
      'user_list': this._fb.array([])
    });
    this.addDetail();
    // Calling the role list service to get all the created Roles.
    this._inviteUserService.getRoleList().then((data: IRoleListType) => {
      this.listOfRoles = data;
      this.dataLoadingCompleted();
    }, error => {
      this.dataLoadingCompleted();
    });
  }

  /** Helps in closing the Dialog after successful addition/update */
  closeInviteUserModal() {
    this.dialog.close();
  }


  ngOnChanges(changes: { [propName: string]: SimpleChange }) {

  }
  getSelectedOption(event) {
  }

  /** Adding new row for the Client Details */
  addDetail() {
    const control = <FormArray>this.form.controls['user_list'];
    // using role_id as key. As it will be send to backend and to display role name.
    const newFields = this._fb.group({
      'email_id': ['', [ValidationService.emailId, ValidationService.emailValidator]],
      'role_id': ['', ValidationService.roleType]
    });
    control.push(newFields);
  }

  // remove the item from the arry maintaning the list of email and role ids
  removeDetail(i: number): void {
    const control = <FormArray>this.form.controls['user_list'];
    control.removeAt(i);
  }

  // send invitation to the email Id's entered.
  saveInviteUser(formData) {
    this._inviteUserService.sendInvitationToUser(formData.user_list).then(data => {
      console.log('invitation send successfully');
      if (data.success_message) {
        this.form.reset();
        this._toasterService.pop('success', 'Update', data.success_message);
        this.closeInviteUserModal();
      } else if (data.error_code === 106) {
        console.log(data);
        this.invalidEmails = data.error_message;
        this._toasterService.pop('error', 'Error', 'Email ID has already been registered');
        this.markErrorRows(this.invalidEmails);
      } else if (data.error_code === 105) {
        this.invalidEmails = data.error_message;
        this._toasterService.pop('error', 'Error', 'Entered email ID is invalid');
      }
    });
  }
  // If the email id entered is invalid or already exists in that case highlight the particular rows.
  markErrorRows(invalidEmail) {
    const errEmailArr: string[] = invalidEmail ? invalidEmail.split(', ') : [];
    const control = <FormArray>this.form.controls['user_list'];
    _.each(control.controls, (form: FormGroup) => {
      if (_.includes(errEmailArr, form.get('email_id').value)) {
        form.get('email_id').setErrors({ 'emailUniqueFailed': true });
      }
    });
  }

  dataLoadingStarted(): void {
    this.isDataLoading = true;
  }

  dataLoadingCompleted(): void {
    this.isDataLoading = false;
  }
}

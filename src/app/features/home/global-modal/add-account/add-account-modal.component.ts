import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { CustomModalContext } from './custom-modal-context';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';

import { ValidationService } from '../../../../components/core/error-messages';
import { ClientService } from '../../../home/clients/client.service';

@Component({
  selector: 'app-add-account-modal',
  templateUrl: './add-account-modal.component.html',
  styleUrls: ['./add-account-modal.component.scss'],
  providers: [ClientService]
})
export class AddAccountModalComponent implements OnInit, CloseGuard, ModalComponent<CustomModalContext> {

  // Declaring the form with the DataType as FormGroup.
  form: FormGroup;

  // Declaring a client module list which is an Array.
  clientModules = [];

  // Date picker options
  // options:DatePickerOptions;

  // Remove this variable once calendar component is created.
  @Input() minDate;
  @Input() tempContractEndDate;
  // Declaring a variable which is of type CostomModalContext.
  context: CustomModalContext;

  // disable the save of update button as soon as the service is called
  disableSaveOrUpdateFlag;

  // disbale or enable save buttonof wizad
  isDisabled = true;

  constructor(public dialog: DialogRef<CustomModalContext>, private _fb: FormBuilder,
    private _clientService: ClientService, private _toasterService: ToasterService, private router: Router) {

    // Getting and Storing the referance of the dialog context.
    this.context = dialog.context;

    // this.options = new DatePickerOptions();

    // Attaching close guard to the dialog component.
    dialog.setCloseGuard(this);
  }

  ngOnInit() {

    /** Initializing the Form Group using a Form Builder. */
    this.form = this._fb.group({
      'client_name': ['', [ValidationService.clientName, ValidationService.clientNameisAlphabetNSpace]],
      'hospital_group': ['', [ValidationService.hospitalName, ValidationService.hospitalNameisAlphabetNSpace]],
      'address_line1': [''],
      'address_line2': [''],
      'city': [''],
      'state': [''],
      'phone_number': ['', Validators.required],
      'postal_code': ['', ValidationService.postalCodeOnlyNumber],
      'deployment_type': ['', ValidationService.deploymentName],
      'max_no_of_care_plan': [''],
      'contract_start_date': ['', ValidationService.contractStartDate],
      'contract_end_date': [''],
      'contract': ['', ValidationService.contractTime],
      'status': [''],
      'client_admin_list': this._fb.array([
        this.initDetails()
      ]),
      'facility_module_list': this._fb.array([
      ]),
      'facility_slno': [''],
      'facility_id': [''],
      'facility_address_id': ['']
    });



    /** Initializing the Modules options when the form is in EDIT mode */
    if (!this.context.edit) {
      this.initializeModuleOptions();
    }

    /** If EDIT is true then pull the value and initialize */
    if (this.context.edit) {
      this._clientService.getClientDetails(this.context.facilityId).then(data => {

        /** Formatting Data so as to remove null Values and replacing them with '' */
        data = this.replaceNullWithQuotes(data);

        /** Filling the data with the Backend Form Data */
        const control = <FormArray>this.form.controls['facility_module_list'];
        for (const d in data.facility_module_list) {
          if (data.facility_module_list[d]) {
            control.push(
              this.initModules(data.facility_module_list[d])
            );
          }
        }

        /** Filling the data with the form Data */
        const adminListControl = <FormArray>this.form.controls['client_admin_list'];

        // Nullyfying the initialization caused during the start of the program.
        // This leads to the setup that will help us further in order to populate
        // screen during the edit is in progress.
        adminListControl.controls = [];

        // Filling in data for the List of Client Admins using the list form the backend.
        for (const d in data.client_admin_list) {
          if (data.client_admin_list[d]) {
            adminListControl.push(
              this.initClientDetails(data.client_admin_list[d])
            );
          }
        }

        /** Setting Data in the form for non Nested Values */
        this.form.patchValue({
          'client_name': data.client_name,
          'hospital_group': data.hospital_group,
          'address_line1': data.address_line1,
          'address_line2': data.address_line2,
          'city': data.city,
          'state': data.state,
          'phone_number': data.phone_number,
          'postal_code': data.postal_code,
          'deployment_type': data.deployment_type,
          'max_no_of_care_plan': data.max_no_of_care_plan,
          'contract_start_date': data.contract_start_date,
          'contract_end_date': data.contract_end_date,
          'contract': data.contract,
          'status': data.status,
          'facility_slno': data.facility_slno,
          'facility_id': data.facility_id,
          'facility_address_id': data.facility_address_id
        });
      });
    }
    /**
     * Function called on load for picking todays date.
     * Needs to remove it once calendar component is created
     */
    const dateToday = new Date();
    const month = dateToday.getMonth() + 1;
    const day = dateToday.getDate();
    const year = dateToday.getFullYear();
    let monthStr = month.toString();
    let dayStr = day.toString();
    const inputForDate = document.getElementById('startDate');

    if (month < 10) {
      monthStr = '0' + month.toString();
    }
    if (day < 10) {
      dayStr = '0' + day.toString();
    }
    this.minDate = year + '-' + monthStr + '-' + dayStr;
    inputForDate.setAttribute('min', this.minDate);
  }



  /**
   * Some of the data coming from the backend is coming null in multiple sections
   * in order to get rid of this data we need to go ahead and do some data wrangling.
   * This will give us data without null values and will enable us easy binding.
   */
  replaceNullWithQuotes(data) {
    for (const d in data) {
      if (data[d] === null) {
        data[d] = '';
      }
    }
    for (const fdata in data.facility_module_list) {
      if (data.facility_module_list[fdata]) {
        for (const d in data.facility_module_list[fdata]) {
          if (data.facility_module_list[fdata][d] === null) {
            data.facility_module_list[fdata][d] = '';
          }
        }
      }
    }
    for (const fdata in data.client_admin_list) {
      if (data.client_admin_list[fdata]) {
        for (const d in data.client_admin_list[fdata]) {
          if (data.client_admin_list[fdata][d] === null) {
            data.client_admin_list[fdata][d] = '';
          }
        }
      }
    }
    return data;
  }

  /** Initialization methods  */
  initializeModuleOptions() {
    this._clientService.getModuleData().then(data => {
      const control = <FormArray>this.form.controls['facility_module_list'];
      for (const d in data) {
        if (data[d]) {
          control.push(
            this.initModules(data[d])
          );
        }
      }
    });
  }

  /** Initialize the Checkbox and Label Group */
  initModules(data) {

    return this._fb.group({
      'facility_module_id': [data.facility_module_id],
      'module_id': [data.module_id],
      'module_name': [data.module_name],
      'mandatory_flag': [data.mandatory_flag],
      'parent_moduleId': [''],
      'selected': [{ value: data.selected, disabled: data.mandatory_flag }],
      'contract': [data.contract, Validators.required],
      'contract_start_date': [data.contract_start_date, Validators.required]

    });
  }

  /** Initialize the Client Data from Backend */
  initClientDetails(data) {
    return this._fb.group({
      'admin_id': [data.admin_id],
      'name': [data.name, Validators.required],
      'job_title': [data.job_title, Validators.required],
      'email': [data.email, [Validators.required, ValidationService.emailValidator]],
      'system_role': [data.system_role, Validators.required],
      'phone_number': [data.phone_number, Validators.required]
    });
  }

  /** Initialization and a Object factory for the Admin Details */
  initDetails() {
    return this._fb.group({
      'admin_id': [''],
      'name': ['', [ValidationService.firstName, ValidationService.firstNameisAlphabetNSpace]],
      'job_title': ['', [ValidationService.jobTitle, ValidationService.JobTitalisAlphabetNSpace]],
      'email': ['', [ValidationService.emailId, ValidationService.emailValidator]],
      'system_role': ['', Validators.required],
      'phone_number': ['', [ValidationService.phoneNumber, ValidationService.phoneOnlyNumbers]]
    });
  }

  /** Adding new row for the Client Details */
  addDetail() {
    const control = <FormArray>this.form.controls['client_admin_list'];
    control.push(this.initDetails());
  }

  /** Delete the row from the Admin Details */
  removeDetail(i: number) {
    const control = <FormArray>this.form.controls['client_admin_list'];
    control.removeAt(i);
  }
  /** Submit Create Client form */
  submitClientCreationForm() {

    this.disableSaveOrUpdateFlag = true;
    // Save the Data if Edit is disabled and its for the first time. Else id edit is TRUE then update the data.
    for (const obj in this.form.value.facility_module_list) {
      if (this.form.value.facility_module_list[obj].mandatory_flag === 1) {
        this.form.value.facility_module_list[obj].selected = true;
      }
    }
    if (!this.context.edit) {
      this._clientService.createClient(this.form.value).then(data => {
        this.isDisabled = !this.isDisabled;
        this.closeClientModal();
        this.disableSaveOrUpdateFlag = true;
        this._toasterService.pop('success', 'Saved', 'Client details saved');
      }, error => {
        this.isDisabled = !this.isDisabled;
        this._toasterService.pop('failure', 'Error', 'Fill all mandatory fields');
      });
    } else {
      this._clientService.updateClient(this.form.value).then(data => {
        this.isDisabled = !this.isDisabled;
        this.closeClientModal();
        this.disableSaveOrUpdateFlag = true;
        this._toasterService.pop('success', 'Saved', 'Client details updated');
      }, error => {
        this.isDisabled = !this.isDisabled;
        this._toasterService.pop('failure', 'Error', 'Fill all mandatory fields');
      });
    }
  }

  // Close the Client Modal
  closeClientModal() {
    this.router.navigate(['/home/clients']);

    // True is requrned when the modal is closed successfully.
    this.dialog.close(true);
  }

  // called whenever value change is there in contract fields
  getEndDate() {

    const parsedDate = this.form.value.contract_start_date.split('-');
    const newYear = parseInt(parsedDate[0], 10) + parseInt(this.form.value.contract, 10);

    parsedDate[0] = newYear.toString();
    this.tempContractEndDate = parsedDate[1] + '/' + parsedDate[2] + '/' + parsedDate[0];
    this.form.value.contract_end_date = this.tempContractEndDate;
  }
}

import { Component, OnInit, SimpleChange, OnChanges } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { CustomAddRoleModalContext } from './custom-add-role-modal-context';
import { AddRoleService } from './add-role.service';
import { ToasterService } from 'angular2-toaster';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ValidationService } from '../../../../components/core/error-messages';
import { IRole } from './model/add-role.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role-modal.component.html',
  styleUrls: ['./add-role-modal.component.scss'],
  providers: [AddRoleService]
})

export class AddRoleModalComponent implements OnInit, OnChanges, CloseGuard, ModalComponent<CustomAddRoleModalContext> {
  // Refers to a formGroup and is being Declared as a FormGroup.
  form: FormGroup;

  // Declaring a variable which is of type CostomModalContext.
  context: CustomAddRoleModalContext;
  // List of roles
  listOfRoles: IRole[];

  // List of type of roles.
  listTypeOfRoles: any;
  // Varaibles for role object.
  roleName: String;
  roleDescription: String;
  roleId: String;

  roleIdForDeletion: String;
  selectedRoleForReplacement;
  fieldErrorStr: String;
  flagForRoleDeletion = true;
  // var holds the data of the role which is selected for removal.
  deleteData;
  // show the dialog with confirm and cancel button once remove is clicked.
  showDeleteConfirmBox = false;
  // Role id coming selected from the dropdown. When edit is selected
  selectedRoleForEditing: Object;
  // Flag to disable the select role type list when edit is clicked.
  disableSelectRoleType = true;
  selectComponentList = [];
  editOrSave = 'Save';
  isDataLoading: boolean;
  constructor(public dialog: DialogRef<CustomAddRoleModalContext>, private _globalAddRoleService: AddRoleService,
    private _toasterService: ToasterService, private _fb: FormBuilder) {
    // Getting and Storing the referance of the dialog context.
    this.context = dialog.context;
    // Setting close guard form the Dialog.
    dialog.setCloseGuard(this);

    // Checking for data in context. IF data is present that means edit is clicked.
    // Else create new Role. To show the role name and description when modal is open.
    if (this.context.selectedRoleData) {
      this.selectedRoleForEditing = this.context.selectedRoleData['roleId'];
      if (this.context.edit) {
        this.editOrSave = 'Update';
        this.disableSelectRoleType = false;
      }
    }

    // Attaching close guard to the dialog component.
    dialog.setCloseGuard(this);
  }

  ngOnInit() {
    this.form = this._fb.group({
      'role_name': ['', ValidationService.roleName],
      'role_description': [''],
      'role_type': ['', ValidationService.roleType]
    });
    this.dataLoadingStarted();
    // Calling the role list service to get all the created Roles.
    this._globalAddRoleService.getRoleList().then(data => {
      this.listOfRoles = data;
      for (const role in this.listOfRoles) {
        if (this.listOfRoles[role].role_id === this.selectedRoleForEditing) {
          this.form.patchValue({
            'role_name': this.listOfRoles[role].role_name,
            'role_description': this.listOfRoles[role].role_desc,
            'role_type': this.listOfRoles[role].role_type
          });
          this.roleId = this.listOfRoles[role].role_id;
        }
      }
    });
    // Calling the service to get the list of role types.
    // for the select list in creating global roles.
    this._globalAddRoleService.getListOfRoleTypes().then(data => {
      this.listTypeOfRoles = data;
      this.dataLoadingCompleted();
      for (const item of this.listTypeOfRoles) {
        this.selectComponentList.push(item.role_type_name);
      }
    }, error => {
      this.dataLoadingCompleted();
    });
  }

  // save a new role
  saveNewRole(value: any) {
    this.fieldErrorStr = null;
    if (this.roleId != null && this.roleId !== '') {
      const editRoleObject = {
        role_id: this.roleId,
        role_name: value.role_name,
        role_desc: value.role_description,
        role_type: value.role_type
      };
      this._globalAddRoleService.editRoleAndDescription(editRoleObject).then(data => {
        if (data.success_message) {

          // clearing the fields once save is successfull
          this.form.reset();
          this.roleId = '';
          this.editOrSave = 'Save';
          this.disableSelectRoleType = true;
          this._toasterService.pop('success', 'Update', data.success_message);
          // calling the role service to reload the list of roles in the modal
          this.getRoleList();
        } else if (data.fieldErrors) {
          this.fieldErrorStr = data.fieldErrors[0].message;
        } else if (data.error_message) {
          this.fieldErrorStr = data.error_message;
        }
      });
    } else {
      const roleObject = {
        role_name: value.role_name,
        role_desc: value.role_description,
        role_type: value.role_type
      };
      this._globalAddRoleService.saveRoleAndDescription(roleObject).then(data => {
        if (data.success_message) {
          // clearing the fields once save is successfull
          this.form.reset();
          this._toasterService.pop('success', 'Saved', data.success_message);
          // calling the role service to reload the list of roles in the modal
          this.getRoleList();
        } else if (data.fieldErrors) {
          this.fieldErrorStr = data.fieldErrors[0].message;
        } else if (data.error_message) {
          this.fieldErrorStr = data.error_message;
        }
      });
    }
  }
  /** Helps in closing the Dialog after successful addition/update */
  closeAddRoles() {
    this.dialog.close();
  }

  /**Helps in closing the dialog opened when role is deleted with mapping present**/
  closeConfirmDialogOfRemoveRole() {
     _.each(this.listOfRoles, (val) => {
      val.isRemoving = false;
    });
    this.showDeleteConfirmBox = false;
  }
  // edit a created role.
  // Just to put the selected values in the input fields. Then service call happens through save.
  editRole(editData) {
    this.editOrSave = 'Update';
    this.disableSelectRoleType = false;
    this.form.patchValue({
      role_name: editData.role_name,
      role_description: editData.role_desc,
      role_type: editData.role_type
    });
    this.roleId = editData.role_id;
  }

  // deleting a role
  deleteRole() {
    this.roleIdForDeletion = this.deleteData.role_id;
    this.showDeleteConfirmBox = false;
    this._globalAddRoleService.deleteRoleAndDescription(this.deleteData).then(data => {
      if (data.success_message) {
        this._toasterService.pop('success', 'Deleted', data.success_message);
        // calling the role service to reload the list of roles in the modal
        this.getRoleList();
      } else if (data.error_message) {
        this._toasterService.pop('error', 'Error', data.error_message);
      }
    });
  }

  // Method is just to show the confirm dialog once a user clicks on remove.
  showRemoveConfirmDialog(index: number): void {

    _.each(this.listOfRoles, (val) => {
      val.isRemoving = false;
    });

    const item: IRole = this.listOfRoles[index];
    if (item) {
      item.isRemoving = true;
    }
      //this.deleteData = deleteItem;
      this.showDeleteConfirmBox = true;
  }

  // get the role list
  getRoleList() {
    this._globalAddRoleService.getRoleList().then(data => {
      this.listOfRoles = data;
    });
  }

  // Will be used for showing the row highlighted. later on
  ngOnChanges(changes: { [propName: string]: SimpleChange }) {

  }
  getSelectedOption(event) {
  }

  dataLoadingStarted(): void {
    this.isDataLoading = true;
  }

  dataLoadingCompleted(): void {
    this.isDataLoading = false;
  }

}

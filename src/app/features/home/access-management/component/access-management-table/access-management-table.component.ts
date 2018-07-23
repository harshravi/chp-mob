import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';

/** Imports for the Modal to be involked on Button Click */
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { CustomAddRoleModalContext, AddRoleModalComponent } from '../../../global-modal/add-role';

@Component({
  selector: 'app-access-management-table',
  templateUrl: './access-management-table.component.html',
  styleUrls: ['./access-management-table.component.scss']
})
export class AccessManagementTableComponent implements OnInit, OnChanges {

  // Get a referance of the Table element using the #myTable identifier
  @ViewChild('myTable') table: any;

  // This input parameter carries the input data for the list of roles
  @Input() listOfRoles;

  // This input parameter carries the input data for the mapping and privileges table
  @Input() mappingAndPrivileges;

  // This input will get the columns names dynamically from the backend
  @Input() columnArray;

  // Outputs for the Inner Grid Components
  @Output()
  checkBoxEmitted = new EventEmitter<boolean>();
  @Output() selectedStatus = new EventEmitter();

  // output for inner checkbox selection change
  @Output() selectionChange = new EventEmitter();

  // tell parent component that user clicked on saveTableData
  @Output() isSaveClicked = new EventEmitter();

  // tell the parent component that user has selected a different role
  @Output() newRoleSelected = new EventEmitter();

  // Emits true if there is a data refresh Required
  @Output() refreshRequired = new EventEmitter<boolean>();

  selectRoleListVar;
  selectRoleDescription;
  /** Initializing the variables for the grid */

  // Row Array for binding with the Data Table
  rows = [];

  // Temprory variable to store the search values
  temp = [];
  expanded: any = {};
  timeout: any;
  loadingIndicator = true;
  listItems = [];
  isOptions;
  /** List of Columns that needs to be injected. This can be exported too */

  columns = [
    // { prop: 'module_name', name: 'Pages/Features' }
  ];

  constructor(private _modal: Modal) { }

  ngOnInit() {
    // Initializing the data in the table
    setTimeout(() => {
      this.rows = this.mappingAndPrivileges.modules;

      // Caching the results in the temp Variable that will be used for filteration
      // this.temp = [...this.accountData];
      // this.loadingIndicator = false;
      for (const a in this.mappingAndPrivileges.actions) {
        if (this.mappingAndPrivileges.actions[a]) {
          this.columns.push({ prop: 'action_name', name: this.mappingAndPrivileges.actions[a].action_name });
        }
      }

      this.selectRoleListVar = this.listOfRoles[0].role_id;
      this.selectRoleDescription = this.listOfRoles[0].role_desc;
    }, 1500);
  }

  // Open modal for adding a new Role.
  openAddRoleModal(modalTypeCalled) {
    if (modalTypeCalled === 'edit') {
      const dialog = this._modal.open(AddRoleModalComponent,
       overlayConfigFactory({ edit: true, selectedRoleData: { roleId: this.selectRoleListVar } }, CustomAddRoleModalContext));
      // Evaluating the Promise to get the boolean value of the grid update
      dialog
        .then((d) => d.result)
        .then((r) => {
          this.refreshRequired.emit(true);
        }, (error) => {  });
    } else {
      this._modal.open(AddRoleModalComponent, overlayConfigFactory({ edit: false }, CustomAddRoleModalContext));
    }

  }

  // Whenever a new role is selected from the dropdown.
  // Emitting a event with role id.
  // Changing the role_desc here as soon as new value is selected.
  changeInSelectRoleList(event) {
    this.newRoleSelected.emit(event);
    for (const role of this.listOfRoles) {
      if (role.role_id === event) {
        this.selectRoleDescription = role.role_desc;
      }
    }
  }

  // Whenever there is a change in any of the table values.
  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (changes['mappingAndPrivileges'] !== undefined) {
      if (this.selectRoleListVar === undefined) {
        setTimeout(() => {
          this.selectRoleListVar = this.listOfRoles[0].role_id;
          this.selectRoleDescription = this.listOfRoles[0].role_desc;
        }, 2000);
      }
      setTimeout(() => {
        this.rows = this.mappingAndPrivileges.modules;
      }, 1200);
    }

  }

  // Toggling the rows to show the details inside a row.
  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  // Method is allowing to open a row. to view the details.
  onDetailToggle(event) {

  }

  // Whenever any checkbox value is changed, Checked or unchecked
  changePrivilege(event, action_id, feature_id) {
    const changeSelection = {
      selected: event,
      feature_id: feature_id,
      action_id: action_id
    };
    this.selectionChange.emit(changeSelection);
  }

  // Emits that save is clicked.
  saveTableData() {
    this.isSaveClicked.emit();
  }

}

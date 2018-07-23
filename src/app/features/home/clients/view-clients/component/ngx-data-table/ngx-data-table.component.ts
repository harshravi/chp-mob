import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';

/** Imports for the Modal to be involked on Button Click */
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { CustomModalContext, AddAccountModalComponent } from '../../../../global-modal';
import { IDropdownOption } from '../../../../../../models';
import { ICustomDropdownOptions } from '../../../../../../components/core/dropdown/model/dropdown.model';

@Component({
  selector: 'app-ngx-data-table',
  templateUrl: './ngx-data-table.component.html',
  styleUrls: ['./ngx-data-table.component.scss']
})
export class NgxDataTableComponent implements OnInit, OnChanges {

  /** List of Columns that needs to be injected. This can be exported too */
  columns = [
    { prop: 'client_name', name: 'Account Name' },
    { prop: 'contract', name: 'Term (Yr)' },
    { prop: 'contract_start_date', name: 'Since' },
    { prop: 'contract_end_date', name: 'Ending' },
    { prop: 'status', name: 'Status' }
  ];
  // Get a referance of the Table element using the #myTable identifier
  @ViewChild('myTable') table: any;

  // This inpur parameter carries the input data for the admin
  @Input() accountData;

  // Outputs for the Inner Grid Components
  @Output() checkBoxEmitted = new EventEmitter<boolean>();
  @Output() selectedStatus = new EventEmitter();

  // Emits true if there is a data refresh Required
  @Output() refreshRequired = new EventEmitter<boolean>();


  /** Initializing the variables for the grid */

  // Row Array for binding with the Data Table
  rows = [];

  // Temprory variable to store the search values
  temp = [];
  expanded: any = {};
  timeout: any;
  loadingIndicator = true;
  customDropdownOptions: ICustomDropdownOptions;
  isOptions;
  showDisabled = false;

  constructor(private _modal: Modal) {
  }


  ngOnInit() {
    // Initializing the data in the table
    setTimeout(() => {
      this.rows = this.accountData;

      // Caching the results in the temp Variable that will be used for filteration
      this.temp = [...this.accountData];
      this.loadingIndicator = false;
    }, 1000);

    this.customDropdownOptions = {
      data: [
        {
          text: 'Approve',
          value: 'Approve'
        },
        {
          text: 'Reject',
          value: 'Reject'
        },
        {
          text: 'Edit',
          value: 'Edit'
        },
      ]
    };

  }

  // Figures the changes made in the variable so as to update the
  // rows in the DataTable. In this case the variable is `accountData`
  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    this.rows = changes['accountData']['currentValue'];
  }



  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
    }, 100);
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {

  }

  updateFilter(event) {
    const val = event.target.value;

    // Filter our data with respect to the search type
    const data = this.temp.filter(function (d) {
      return d.client_name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // Update the rows with the filtered data
    this.rows = data;
  }

  onCheckedOrUnchecked(event) {
    const isChecked = event;
    this.checkBoxEmitted.emit(isChecked);
  }

  /** Open the New Account Addition Modal */
  openAccountModal() {
    const dialog = this._modal.open(AddAccountModalComponent, overlayConfigFactory({ edit: false }, CustomModalContext));

    // Evaluating the Promise to get the boolean value of the grid update
    dialog
      .then((d) => d.result)
      .then((r) => {
        this.refreshRequired.emit(true);
      }, (error) => {  });
  }

  /** Edit Client Details */
  editClientDetails(facilityId: string) {
    const dialog = this._modal.open(AddAccountModalComponent,
      overlayConfigFactory({ edit: true, facilityId: facilityId }, CustomModalContext));

    // Evaluating the Promise to get the boolean value of the grid update
    dialog
      .then((d) => d.result)
      .then((r) => {
        this.refreshRequired.emit(true);
      }, (error) => {  });
  }

  // @todo sathish - this function is not linked to the ngx grid dropdown change
  selectedOption(event, id) {
    const obj = {
      status: event,
      facility_id: id
    };
    this.selectedStatus.emit(obj);
    if (event === 'Edit') {
      this.editClientDetails(id);
    }
  }

  getOptions(row) {
    const option: IDropdownOption[] = [];

    if ((row.status_name === 'PENDING_APPROVAL' || row.status_name === 'REJECTED')
      && (this.getRoleStatus('ROLE_approve_viewclients_clientmanagement'))) {
      option.push({ value: 'Approve', text: 'Approve' });
    }

    if ((row.status_name === 'PENDING_APPROVAL') && (this.getRoleStatus('ROLE_reject_viewclients_clientmanagement'))) {
      option.push({ value: 'Reject', text: 'Reject' });
    }

    if ((row.status_name === 'ACTIVE') && (this.getRoleStatus('ROLE_disable_viewclients_clientmanagement'))) {
      option.push({ value: 'Disable', text: 'Disable' });
    }

    if ((row.status_name === 'DISABLED') && (this.getRoleStatus('ROLE_enable_viewclients_clientmanagement'))) {
      option.push({ value: 'Enable', text: 'Enable' });
    }

    if ((row.status_name === 'PENDING_APPROVAL') && (this.getRoleStatus('ROLE_edit_editclientpendingapproval_clientmanagement'))) {
      option.push({ value: 'Edit', text: 'Edit' });
    }

    if ((row.status_name === 'ACTIVE' || row.status_name === 'REJECTED' || row.status_name === 'EXPIRED')
      && (this.getRoleStatus('ROLE_edit_editclientafterapproval_clientmanagement'))) {
      option.push({ value: 'Edit', text: 'Edit' });
    }

    return option;
  }

  getRoleStatus(data) {
    let previlages = JSON.parse(window.localStorage.getItem('VETAHEALTH.LOGGED_IN_USER_OBJECT'));
    previlages = JSON.parse(previlages).previleges;
    for (const obj in previlages) {
      if (previlages[obj] === data) {
        return true;
      }
    }
  }
}

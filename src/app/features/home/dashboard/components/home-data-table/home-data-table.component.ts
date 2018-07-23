import {
  Component, OnInit, ViewEncapsulation, ChangeDetectorRef,
  AfterViewChecked, Input, ViewChild, Output, EventEmitter, OnChanges,
  SimpleChange, Pipe, PipeTransform, OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { CheckBoxService } from '../../../../../services';
import { PubSubService } from '../../../../../services';
import { DATATABLE_EXCEPTIONS } from '../../../../../constants/exception-messges';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';

import {
  InterventionComponent, InterventionModalContext,
  InterventionComplianceComponent, InterventionComplianceModalContext
} from '../../../global-modal';

/** Imports for the Modal to be involked on Button Click */
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { CommonUtil } from '../../../../../utils';
import { DateUtilityService } from '../../../../../services';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import {
  IDashboardPatientDetail, IPatientListGridRequest, IPatientListGridData,
  ICarPlanName, IVitalList
} from './model/patient-list.model';
// IGridOptions

import { UserManagementService } from '../../../../../services/UserManagement';
import { IUserDetail } from '../../../../../models';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-home-data-table',
  templateUrl: './home-data-table.component.html',
  styleUrls: ['./home-data-table.component.scss'],
  providers: [CheckBoxService],
  encapsulation: ViewEncapsulation.None
})
export class HomeDataTableComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
  private currentComponentWidth;

  @ViewChild('myTable') table: DatatableComponent;
  @ViewChild('tableWrapper') tableWrapper;

  @Input() listData;
  @Input() isChecked: boolean;
  @Input() listAllData;
  @Input() myCareplan: Object;
  @Input() allCarePlan: Object;
  @Output() dashboardHeader = new EventEmitter();
  participantId;

  @Output() selectionChange = new EventEmitter<Object>();
  @Output() updateDataForGrid = new EventEmitter();

  messages = DATATABLE_EXCEPTIONS.DASHBOARD;
  commonUtils = CommonUtil;
  rows = [];
  temp = [];
  allData = [];
  expanded: any = {};
  timeout: any;
  loadingIndicator = true;
  hidePrevBtn = true;
  carePlanData: Object;
  isMycarePlan: Boolean;
  program_name: Object;
  offsetCount = 0;
  title;
  plan_text = 'Care Plan';
  stage_text = 'Risk State';
  multiselectOne = 'one';
  multiselectTwo = 'two';
  selectedWorkout = 'back';
  programNumber = [];
  riskStatus = [];
  isMyParticipant;
  updatedData;
  updatedStage;
  isDataLoading: boolean;

  public showParticipant = true;

  // Current Row Being Toggled
  rowToggled: any;

  textCenter = 'align-center';

  searchParticipant = '';
  subScriptions: Subscription[] = [];
  userDetail: IUserDetail;

  // Array to show risk status
  riskStatusDetails = [
    { program_name: 'Normal', program_ref_no: '0', selected: false },
    { program_name: 'Alert', program_ref_no: '1', selected: false },
    { program_name: 'Critical', program_ref_no: '2', selected: false },
    { program_name: 'Data Not Received', program_ref_no: '-1', selected: false },
  ];

  ParticipantDetails = [
    { settings_type_label: 'My Participants', value: '1' },
    { settings_type_label: 'All Participants', value: '2' }
  ];

  gridData: IPatientListGridData;
  gridOptions: IPatientListGridRequest;
  // offsetValue = 0;

  columns = [
    { prop: 'participant_name', name: 'Patient Name' },
    { prop: 'age', name: 'Age' },
    { prop: 'care_plan_count', name: 'Care Plan' },
    { prop: 'meds_count', name: 'Meds' },
    { prop: 'medication_compliance', name: 'Medication Compliance' }
  ];

  highlightedDiv: number;

  constructor(private _CheckBoxService: CheckBoxService, private _pubSub: PubSubService,
    private _modal: Modal, private _dateUtilityService: DateUtilityService,
    private changeDetectorRef: ChangeDetectorRef,
    private _userManagementService: UserManagementService,
    private _storage: LocalStorageService) {
    this.isMyParticipant = this.ParticipantDetails[0].value;
  }

  ngAfterViewChecked() {
    // Check if the table size has changed,
    if (this.table && this.table.recalculate && (this.tableWrapper.nativeElement.clientWidth !== this.currentComponentWidth)) {
      this.currentComponentWidth = this.tableWrapper.nativeElement.clientWidth;
      this.table.recalculate();
      this.changeDetectorRef.detectChanges();
    }
  }

  onPage(event) {
    this.gridOptions.offset = event.offset;
    this.updateGridWithCurrentData();
  }
  // call this method for responsive method
  updateTableNext(event) {
    this.offsetCount++;
    this.hidePrevBtn = false;
    this.gridOptions.offset = this.offsetCount;
    this.updateGridWithCurrentData();
  }
  updateTablePrev(event) {
    this.offsetCount--;
    this.gridOptions.offset = this.offsetCount;
    if (this.offsetCount <= 0) {
      this.hidePrevBtn = true;
    }
    this.updateGridWithCurrentData();
  }
  /**
   * This is a refactored utility function which helps to toggle the rows and helps in
   * collapsing the whole table and expanding it out as well.
   * @param row Currently clicked row. This helps in evaluating the current row and then toggling it out.
   */
  toggleAndAssign(row) {
    this.table.rowDetail.toggleExpandRow(row);
    this.rowToggled = row;
  }

  toggleExpandRow(row) {
    if (this.rowToggled === row || this.rowToggled === undefined) {
      this.toggleAndAssign(row);
    } else {
      this.table.rowDetail.collapseAllRows();
      this.toggleAndAssign(row);
    }
    this.dashboardHeader.emit(row);
  }

  onDetailToggle(event) {
  }

  updateFilter(event) {
    this.gridOptions.offset = 0;
    this.table.offset = 0;
    this.updateGridWithCurrentData();

    // let val = event.target.value;
    // val = val.toLowerCase();
    // // filter our data
    // const temp = this.temp.filter(function (d) {
    //   return d.participant_name.toLowerCase().indexOf(val) !== -1 || !val;
    // });

    // // update the rows
    // this.rows = temp;
    // this.table.offset = 0;
  }

  // onChange(checked) {
  //   if (checked) {
  //     this.rows = this.listData;
  //     this.temp = this.listData;
  //     this.isMycarePlan = true;
  //   }
  //   else {
  //     this.rows = this.allData;
  //     this.temp = this.allData;
  //     this.isMycarePlan = false;
  //   }
  // }

  participantSelection(selectedCategory) {
    if (selectedCategory === '1') {
      this.rows = this.listData;
      this.temp = this.listData;
      this.isMycarePlan = true;
      this.isChecked = true;
      this.carePlanData = this.myCareplan;
      this.resetItems();

    } else if (selectedCategory === '2') {
      this.rows = this.allData;
      this.temp = this.allData;
      this.isMycarePlan = false;
      this.isChecked = false;
      this.carePlanData = this.allCarePlan;
      this.resetItems();
    }
  }

  // add tags on dropdown selection
  onSelection(data) {
    const temp = [];
    const program_name = [];
    const risk_name = [];
    const options = (this.isMycarePlan) ? this.myCareplan : this.allCarePlan;
    this.riskStatus = [];
    this.programNumber = [];
    this._CheckBoxService.setCheckBoxData(data);
    const newData = this._CheckBoxService.getCheckBoxData();
    // Check or Uncheck option from list
    if (data.selected) {
      for (const obj in options) {
        if (options[obj].selected !== undefined && options[obj].program_name === data) {
          options[obj].selected = true;
        }
      }
    }

    if (!data.selected) {
      for (const obj in options) {
        if (options[obj].selected !== undefined && options[obj].program_name === data) {
          options[obj].selected = false;
        }
      }
    }

    // updating table data and Checkbox data
    this.updateData(newData);
  }

  // watching for changes
  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (changes['listData'] !== undefined && this.isChecked) {
      this.rows = this.listData;
      this.temp = this.listData;
    } else if (changes['listAllData'] !== undefined) {
      if (!this.isChecked) {
        this.rows = this.listAllData;
        this.temp = this.listAllData;
      }
      this.allData = this.listAllData;
    }
  }

  removeSelection(data) {
    this._CheckBoxService.removeCheckBoxData(data);
    const newData = this._CheckBoxService.getCheckBoxData();
    const options = (this.isMycarePlan) ? this.myCareplan : this.allCarePlan;
    const pgmName = [];
    this.riskStatus = [];
    this.programNumber = [];
    // uncheck data from list
    for (const obj in options) {
      if (options[obj].selected !== undefined && options[obj].program_name === data) {
        options[obj].selected = false;
      }
    }
    // uncheck data from stage list
    for (const obj in this.riskStatusDetails) {
      if (this.riskStatusDetails[obj].program_name === data) {
        this.riskStatusDetails[obj].selected = false;
      }
    }

    // updating table data and Checkbox data
    this.updateData(newData);
  }

  getVitalComponentClass(status) {
    switch (status) {
      case -1: return 'vital-gray';
      case 0: return 'vital-green';
      case 1: return 'vital-orange';
      case 2: return 'vital-red';
    }
  }

  ngOnInit() {

    this.userDetail = <IUserDetail>this._storage.get('userdetails');

    this.gridOptions = {
      my_patients: this.showParticipant,
      program_nums: null,
      risk_status: null,
      search_params: null,
      offset: 0
    };

    // Putting this condition as a Role based calling of services.
    // These services are not required for client admin.
    if (this.userDetail.roleType !== 'ADMIN') {

      this._userManagementService.getMyCarePlans().then(data => {
        this.myCareplan = data;
        // this.allCarePlan = data.other_programs;
      });

      this._userManagementService.getAllCarePlans().then(data => {
        // this.myCarePlan = data.my_programs;
        this.allCarePlan = data;
      });
    }

    this.subScriptions.push(
      this._pubSub.Stream.subscribe(message => {
      })
    );

    const intialData: IPatientListGridRequest = <IPatientListGridRequest>{
      offset: 0,
      my_patients: this.showParticipant,
      search_params: this.searchParticipant
    };

    this.updateGridData(intialData);

    setTimeout(() => {
      this.temp = this.listData;
      this.rows = this.listData;
      this.allData = this.listAllData;
      this.loadingIndicator = false;
      this.carePlanData = this.myCareplan;

      this.isMycarePlan = true;
    }, 2000);
  }

  resetItems() {
    this._CheckBoxService.removeCompleteData();
    const newData = this._CheckBoxService.getCheckBoxData();
    // updating table data and Checkbox data
    this.updateData(newData);
  }

  updateData(newData) {
    const temp = [];
    this.rows = [];
    const program_name = [];
    const risk_name = [];
    this.updatedData = [];
    this.updatedStage = [];
    this.programNumber = [];
    this.riskStatus = [];
    this.table.offset = 0;
    // seperation based on careplan or risk stage
    for (const obj in newData) {
      if ((newData[obj].program_ref_no === '0') ||
        (newData[obj].program_ref_no === '1') || (newData[obj].program_ref_no === '2') || (newData[obj].program_ref_no === '-1')) {
        risk_name.push(newData[obj].program_ref_no);
        program_name.push(newData[obj].program_name);
        this.riskStatus = risk_name;
      } else {
        temp.push(newData[obj].program_ref_no);
        program_name.push(newData[obj].program_name);
        this.programNumber = temp;
      }
    }

    // updating the count in dropdown and updating tags
    this.program_name = program_name;
    this.updatedData = this.programNumber;
    this.updatedStage = this.riskStatus;

    const selectedData = {
      data: (this.programNumber.length === 0) ? null : this.programNumber,
      risk_status: (this.riskStatus.length === 0) ? null : this.riskStatus,
      checked: this.isChecked
    };

    this.gridOptions.program_nums = selectedData.data;
    this.gridOptions.risk_status = selectedData.risk_status;
    this.gridOptions.my_patients = this.showParticipant;
    this.gridOptions.offset = 0;

    this.updateGridWithCurrentData();

    //this.selectionChange.emit(selectedData);
  }

  getRowClass(row) {
    return 'danger';
  }

  openInterventionModal(type, participat_id) {
    let t;
    if (type === 'vitals') {
      this._modal.open(InterventionComponent, overlayConfigFactory({ addMedicationPlan: false, participantId: participat_id },
        InterventionModalContext)).then(d => {
          t = d.result.then(data => {
            if (data === 'saved' || data === true) {
              this.updateGridWithCurrentData();
            }

          });
        });
    } else if (type === 'compliance') {
      this._modal.open(InterventionComplianceComponent, overlayConfigFactory({ addMedicationPlan: false, participantId: participat_id },
        InterventionComplianceModalContext)).then(d => {
          t = d.result.then(data => {
            if (data === 'saved' || data === true) {
              this.updateGridWithCurrentData();
            }

          });
        });
    }
  }

  showMyParticipant(event) {
    this.searchParticipant = '';
    if (event) {
      this.rows = this.listData;
      this.temp = this.listData;
      this.isMycarePlan = true;
      this.isChecked = true;
      this.carePlanData = this.myCareplan;
      // this.resetItems();
    } else {
      if (this.allData) {
        this.rows = this.allData;
        this.temp = this.allData;
      }
      this.isMycarePlan = false;
      this.isChecked = false;
      this.carePlanData = this.allCarePlan;
      // this.resetItems();
    }

    const newData = this._CheckBoxService.getCheckBoxData();
    // updating table data and Checkbox data
    this.updateData(newData);
  }

  isLinkDisabled(item) {
    if (item > 0) {
      return '';
    } else {
      return 'not-active';
    }
  }

  unSubscribe() {
    _.forEach(this.subScriptions, (sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }

  showParticipantChange() {
    this.updateGridWithCurrentData();
    if (this.showParticipant) {
      this.participantSelection('1');
    } else {
      this.participantSelection('2');
    }
  }

  updateGridWithCurrentData() {
    const intialData: IPatientListGridRequest = <IPatientListGridRequest>{
      offset: this.gridOptions.offset,
      my_patients: this.showParticipant,
      search_params: this.searchParticipant,
      program_nums: this.gridOptions.program_nums,
      risk_status: this.gridOptions.risk_status
    };

    this.updateGridData(intialData);
  }

  // get my Participants List
  async updateGridData(reqObj: IPatientListGridRequest): Promise<IPatientListGridData> {
    this.dataLoadingStarted();
    this.unSubscribe();
    try {
      const data: any = await this._userManagementService.getParticipantList(reqObj)
        .first().toPromise<IPatientListGridData>();
      this.gridData = <IPatientListGridData>data.json();
      this.dataLoadingCompleted();
    } catch (e) {
      this.dataLoadingCompleted();
    }

    return this.gridData;
  }

  /**
 * Helps in order to close and open the list of participants.
 */
  toggleList(i) {
    // let currentElem = document.querySelectorAll('[data-anchor]')[i];
    // currentElem.scrollIntoView();
    this.highlightedDiv = i;
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 50);

  }

  ngOnDestroy() {
    this.unSubscribe();
  }

  dataLoadingStarted(): void {
    this.isDataLoading = true;
  }

  dataLoadingCompleted(): void {
    this.isDataLoading = false;
  }
  // call a function when key event is enter in search input
  searchKeyPress(event) {
    if (event.keyCode === 13 || this.searchParticipant === '') {
      this.updateGridWithCurrentData();
    }
    return true;
  }  
}

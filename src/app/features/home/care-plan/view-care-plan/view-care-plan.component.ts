import { Component, OnInit, ViewChild, TemplateRef, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CarePlanService } from '../care-plan.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { ActivatedRoute, Router } from '@angular/router';

import { ParticipantDashboardService } from './../../../home/participant-dashboard/participant-dashboard.service';
import { VIEW_CARE_PLAN_CONSTANTS } from './view-care-plan-constants';
import { GlobalEventEmitterService } from '../../../../services/EventEmitter/global-event-emitter.service';
/** importing breadcrumb service to set breadcrumb */
import { BreadcrumbService } from '../../../../services';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';

@Component({
  selector: 'app-view-care-plan',
  templateUrl: './view-care-plan.component.html',
  styleUrls: ['./view-care-plan.component.scss'],
  providers: [CarePlanService, ParticipantDashboardService],

})
export class ViewCarePlanComponent implements OnInit, AfterViewInit, OnDestroy {
  isDataLoading: boolean;
  // Search Grid's title
  searchBoxTitle = 'Filter';

  @ViewChild('carePlanRowContainer') carePlanRowContainer: ElementRef;
  taskBarlastStatus: boolean;

  // Colors of the count boxes based upon the program status.
  colorOfBoxEnrolled = VIEW_CARE_PLAN_CONSTANTS.COLOR_GREEN;
  colorOfBoxCompleted = VIEW_CARE_PLAN_CONSTANTS.COLOR_ALERT;
  colorOfBoxCritical = VIEW_CARE_PLAN_CONSTANTS.COLOR_CRITICAL;
  // Text to be displayed inside each of the coloured boxes:
  // These values used a constants
  displayTextEnrolled = VIEW_CARE_PLAN_CONSTANTS.LABEL_ENROLLED;
  displayTextInvited = VIEW_CARE_PLAN_CONSTANTS.LABEL_INVITED;
  displayTextCritical = VIEW_CARE_PLAN_CONSTANTS.LABEL_CRITICAL;
  displayTextUnassigned = VIEW_CARE_PLAN_CONSTANTS.LABEL_UNASSIGNED;

  // list of all the care plans associated to a physician
  listOfCarePlans: any;
  allCarePlanList: any;
  tempListForSearch = [];
  // flag for only showing the all programs when checkbox is unchecked.
  // same flag is used as a part condition for displaying no careplan error message.
  showMyProgramsFlag = true;
  noDataFlag = false;
  // to hide the checkbox when my careplans are not there.
  hideShowCheckboxForMyCarePlans = true;
  /** Variable to know to display all care plans or particular participant care plans */
  participantCarePlan: string;
  searchParticipantText: string;
  /** Variable to store filter text*/
  filterText;
  // Colors of the count boxes based upon the program status.
  colorOfBoxTextEnrolled = 'green';
  colorOfBoxTextCompleted = 'text-warning';
  colorOfBoxTextCritical = 'text-danger';
  colorOfBoxWhite = 'white-bg';
  borderOfBox = 'border-all';
  // Padding bottom
  PaddingBottom = 'p-b';
  isTaskOpenCarePlan: boolean;
  subscription: Subscription[] = [];

  constructor(private _carePLanService: CarePlanService, private _storage: LocalStorageService,
    private _participantDashboardService: ParticipantDashboardService, private route: ActivatedRoute,
    private _breadcrumbService: BreadcrumbService, private _globalEventEmitterService: GlobalEventEmitterService) {
    this.taskBarlastStatus = true;
  }

  adjustCarePlanRowCallback(isTaskbarOpen) {
    setTimeout(() => {
      const ele = this.carePlanRowContainer.nativeElement;
      if (isTaskbarOpen && ele.offsetWidth < 1000) {
        this.isTaskOpenCarePlan = true;
      } else {
        this.isTaskOpenCarePlan = false;
      }
    }, 100);
  }

  ngOnInit() {
    // setting page name to get list of breadcrumb
    this._breadcrumbService.setBreadcrumbs('View Care Plan', null);
    this.participantCarePlan = this.route.snapshot.params['id'];
    this.getCarePlans();

    this.subscription.push(this._globalEventEmitterService.taskbarToggleObservable.subscribe(val => {
      this.taskBarlastStatus = val;
      this.adjustCarePlanRowCallback(val);
    }));

    this.adjustCarePlanRowCallback(true);
  }

  ngAfterViewInit() {

  }

  // get all the care plans
  // It gives both all and my careplans. Then on load only we are showing my care plans
  getCarePlans() {
    this.dataLoadingStarted();
    this._carePLanService.getCarePlans().then(data => {
      this.allCarePlanList = data;
      // if (this.allCarePlanList.my_programs_empty_msg == null) {
      //   this.listOfCarePlans = this.allCarePlanList.my_careplans;
      //   this.tempListForSearch = this.listOfCarePlans;
      // }
      if (this.allCarePlanList.my_careplans.length !== 0) {
        // this.hideShowCheckboxForMyCarePlans = true;
        this.listOfCarePlans = this.allCarePlanList.my_careplans;
        this.tempListForSearch = this.listOfCarePlans;
      } else {
        // this.listOfCarePlans = this.allCarePlanList.all_careplans;
        // this.tempListForSearch = this.listOfCarePlans;
        this.noDataFlag = true; // showing the No data available message
      }
      this.dataLoadingCompleted();
    }, error => {
      this.dataLoadingCompleted();
    });
  }

  // When the checkbox for showing my care plans is unchecked.
  // Event is triggered and is being handled here.
  changeMyProgramsToAllPrograms(event) {
    this.searchParticipantText = '';
    if (event === false) {
      this.listOfCarePlans = this.allCarePlanList.all_careplans;
      this.tempListForSearch = this.listOfCarePlans;
      this.showMyProgramsFlag = false;
      this.noDataFlag = false;
    } else {
      this.showMyProgramsFlag = true;
      if (this.allCarePlanList.my_programs_empty_msg == null) {
        this.listOfCarePlans = this.allCarePlanList.my_careplans;
        this.tempListForSearch = this.listOfCarePlans;
        this.noDataFlag = false;
      } else {
        this.listOfCarePlans = [];
        this.tempListForSearch = this.listOfCarePlans;
        this.noDataFlag = false;
      }
    }
    this.adjustCarePlanRowCallback(this.taskBarlastStatus);
  }

  // search the list of careplans.
  updateFilter(event) {
    this.filterText = event.target.value;
    this.filterWithText(this.filterText);
  }

  // search the list with text
  filterWithText(val) {
    val = val.toLowerCase();
    // Filter our data with respect to the search type
    const data = this.tempListForSearch.filter((d) => {
      return d.program_name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    if (data.length === 0) {
      this.noDataFlag = true;
      this.listOfCarePlans = data;
    } else {
      this.noDataFlag = false;
      this.listOfCarePlans = data;
    }
  }

  // setting careplan name and regId,because when user click on
  // any careplan patients,invited or any other card inside careplan view card then in breadcrum we
  // have to show careplan name so setting care plan name and id in this compenent only
  setData(carePlan) {
    this._storage.set('carePlanName', carePlan.program_name);
    this._storage.set('carePlanId', carePlan.program_ref_no);
  }

  dataLoadingStarted(): void {
    this.isDataLoading = true;
  }

  dataLoadingCompleted(): void {
    this.isDataLoading = false;
  }

  unSubscribe() {
    _.forEach(this.subscription, (sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }

  ngOnDestroy() {
    this.unSubscribe();
  }

}

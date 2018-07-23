import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { ActivatedRoute, Router } from '@angular/router';
/** importing breadcrumb service to set breadcrumb */
import { BreadcrumbService } from '../../../../services';


import { ParticipantDashboardService } from './../../../home/participant-dashboard/participant-dashboard.service';

@Component({
  selector: 'app-patient-care-plan',
  templateUrl: './patient-care-plan.component.html',
  styleUrls: ['./patient-care-plan.component.scss'],
  providers: [ParticipantDashboardService]
})
export class PatientCarePlanComponent implements OnInit {
  // Search Grid's title
  searchBoxTitle = 'Filter';

  // Colors of the count boxes based upon the program status.
  colorOfBoxEnrolled = 'bg-green';
  colorOfBoxCompleted = 'bg-alert';
  colorOfBoxCritical = 'bg-danger';
  // Text to be displayed inside each of the coloured boxes:
  // These values used a constants
  displayTextEnrolled = 'ENROLLED';
  displayTextInvited = 'INVITED';
  displayTextCritical = 'CRITICAL';

  colorOfBoxTextEnrolled = 'green';
  colorOfBoxTextCompleted = 'text-warning';
  colorOfBoxTextCritical = 'text-danger';
  colorOfBoxWhite = "white-bg";
  borderOfBox = "border-all";

  // list of all the care plans associated to a physician
  listOfCarePlans: any;
  allCarePlanList: any;
  tempListForSearch = [];
  // flag for only showing the all programs when checkbox is unchecked.
  // same flag is used as a part condition for displaying no careplan error message.
  showMyProgramsFlag = true;
  // to hide the checkbox when my careplans are not there.
  hideShowCheckboxForMyCarePlans = true;
  noDataFlag = false;
  isDataLoading: boolean;

  constructor(private _storage: LocalStorageService,
    private _participantDashboardService: ParticipantDashboardService,
    private route: ActivatedRoute, private _breadcrumbService: BreadcrumbService) { }

  ngOnInit() {
    let map = new Map<string, string>();
    this._storage.set('patientName', this._storage.get('participantName'));
    map.set('participantName', String(this._storage.get('participantName')));
    map.set('id', String(this._storage.get('participantId')));
    this.getCarePlans(true);
    this._breadcrumbService.setBreadcrumbs('Patient Care Plan', map);
  }

  // get all the care plans
  // It gives both all and my careplans. Then on load only we are showing my care plans
  getCarePlans(event) {
    this.dataLoadingStarted();
    this.noDataFlag = false;
    const participantId = this._storage.get('participantId');
    // if (event) {
    //   this._participantDashboardService.getCarePlanOfParticipant(participantId).then(data => {
    //     this.listOfCarePlans = data.active_careplans;
    //     this.tempListForSearch = this.listOfCarePlans;
    //     if (this.listOfCarePlans === undefined || this.listOfCarePlans.length === 0) {
    //       this.noDataFlag = true;
    //     }
    //   });
    // } else {
    //   this._participantDashboardService.getCarePlanOfParticipant(participantId).then(data => {
    //     this.listOfCarePlans = data.inactive_careplans;
    //     this.tempListForSearch = this.listOfCarePlans;
    //     if (this.listOfCarePlans === undefined || this.listOfCarePlans.length === 0) {
    //       this.noDataFlag = true;
    //     }
    //   });
    // }
    this._participantDashboardService.getCarePlanOfParticipant(participantId).then(data => {
       this.dataLoadingCompleted();
      (event) ? this.listOfCarePlans = data.active_careplans : this.listOfCarePlans = data.inactive_careplans;
      this.tempListForSearch = this.listOfCarePlans;
      if (this.listOfCarePlans === undefined || this.listOfCarePlans.length === 0) {
        this.noDataFlag = true;
      }
    }, error => {
      this.dataLoadingCompleted();
    });
  }
  // search the list of careplans.
  updateFilter(event) {
    let val = event.target.value;
    val = val.toLowerCase();
    if (this.tempListForSearch === undefined) {
      this.tempListForSearch = [];
    }
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
    this._storage.set('carePlanName', carePlan.program_name)
    this._storage.set('carePlanId', carePlan.program_ref_no)
  }

  dataLoadingStarted(): void {
    this.isDataLoading = true;
  }

  dataLoadingCompleted(): void {
    this.isDataLoading = false;
  }
}

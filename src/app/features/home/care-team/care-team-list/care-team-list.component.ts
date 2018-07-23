import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { ParticipantDashboardService } from '../../../home/participant-dashboard/participant-dashboard.service';
import { CareTeamService } from '../../../home/care-team/care-team.service';
/** importing breadcrumb service to set breadcrumb */
import { BreadcrumbService } from '../../../../services';

@Component({
  selector: 'app-care-team-list',
  templateUrl: './care-team-list.component.html',
  styleUrls: ['./care-team-list.component.scss'],
  providers: [ParticipantDashboardService, CareTeamService]
})
export class CareTeamListComponent implements OnInit {

  // care team members list.
  careTeamMembers: any;
  noPadClassForComponent = 'no-padding';

  // For table column align center.
  textCenter = 'align-center';

  /** For tabular view */
  rows: Object;
  count = 0;
  offset = 0;
  limit = 10;
  externalPaging = true;

  // Client Grid's title
  gridIBoxTitle = 'Care Team';

  // Variables related to roles
  selectedRole = -1;
  roleList = [];
  temp;
  // Variable to get ref_id of program
  ref_id;
  isDataLoading: boolean;

  constructor(private route: ActivatedRoute, private _participantDashboardService: ParticipantDashboardService,
    private _storage: LocalStorageService, private _careTeamService: CareTeamService, private _breadcrumbService: BreadcrumbService) { }

  ngOnInit() {
    let map = new Map<string, string>();
    // To find from which page we are calling care team list
    let pageName = this._storage.get('careTeamFromPatientProfile');
    console.log(pageName);
    if (pageName) {
      map.set('carePlanName', String(this._storage.get('carePlanName')));
      map.set('carePlanId',  String(this._storage.get('carePlanId')));
      map.set('patientName',  String(this._storage.get('participantName')));
      map.set('id',  String(this._storage.get('participantId')));
      this._breadcrumbService.setBreadcrumbs("Care Team From Care Plan of Patient Profile", map);
    } else {
      map.set('carePlanName', String(this._storage.get('carePlanName')));
      map.set('id', this.route.snapshot.params['id']);
      this._breadcrumbService.setBreadcrumbs("Care Team From Care Plan", map);
    }

    this.ref_id = this.route.snapshot.params['id'];
    this.getCareTeamMembers();
  }
  /** method to get care team members */
  getCareTeamMembers() {
    this.dataLoadingStarted();
    if (this.ref_id === 'ParticipantView') {
      const participantId = this._storage.get('participantId');
      this._participantDashboardService.getListOfCareTeamMembers(participantId).then(data => {
        this.dataLoadingCompleted();
        // Adding a key and value for name initials of the care team members.
        for (const careTeam in data) {
          if (data[careTeam]) {
            data[careTeam].name = data[careTeam].first_name + ' ' + data[careTeam].last_name;
            data[careTeam].staff_name_initials = data[careTeam].first_name.charAt(0) + data[careTeam].last_name.charAt(0);
          }
        }
        this.rows = data;
        this.temp = data;
        this.count = data.length;
        this.isDataLoading = false;
      }, error => {
      this.dataLoadingCompleted();
    });
    } else {
      this._careTeamService.getListOfCareTeamMembersOfCarePlan(this.ref_id).then(data => {
        this.dataLoadingCompleted();
        this.isDataLoading = true;
        // Adding a key and value for name initials of the care team members.
        for (const careTeam in data) {
          if (data[careTeam]) {
            data[careTeam].name = data[careTeam].first_name + ' ' + data[careTeam].last_name;
            data[careTeam].staff_name_initials = data[careTeam].first_name.charAt(0) + data[careTeam].last_name.charAt(0);
          }
        }
        this.rows = data;
        this.temp = data;
        this.count = data.length;
        this.isDataLoading = false;
      }, error => {
      this.dataLoadingCompleted();
    });
    }

  }

  /** method will trigger on selcting of role dropdown */
  getRole() {

  }

  updateFilter(event) {
    let val = event.target.value;
    val = val.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    this.count = temp.length;
  }
  dataLoadingStarted(): void {
    this.isDataLoading = true;
  }

  dataLoadingCompleted(): void {
    this.isDataLoading = false;
  }
}

import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { UserManagementService } from '../../../services';
import { BreadcrumbRouteEventEmitterService } from '../../../services/breadcrumb-route-service/breadcrumb-route.service';


@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss'],
  providers: [UserManagementService]
})
export class DashboardHeaderComponent implements OnInit, OnChanges {

  // This variable will give the view Card information.
  @Input()
  viewCardInfo: string;
  @Input() userName: string;
  @Input() participantData;

  dashboardHeaderTitle: string;
  userData;
  myData: Object;
  // Object storing all the userdetails from local storage
  userObject: any;
  firstName; lastName; middleName; facilityName; alertStatus; criticalStatus; totalCount; roleName; textForImg;

  InnerDisplayText = 'PATIENTS';
  colorOfBoxTotal = 'bg-muted';
  headingTotal = 'TOTAL';

  headingAlert = 'ALERT';
  colorOfBoxAlert = 'bg-alert';

  headingCritical = 'CRITICAL';
  colorOfBoxCritical = 'bg-danger';

  InnerDisplayTextAlert = 'Alert';
  InnerDisplayTextCritical = 'Critical';
  colorOfBoxWhite = "white-bg";
  borderOfBox = "border-all";
  colorOfBoxTextCritical = 'text-danger';
  colorOfBoxTextAlert = 'text-warning';

  constructor(private router: Router, private _storage: LocalStorageService, private _breadcrumbRouteEventEmitterService: BreadcrumbRouteEventEmitterService,
    private _userService: UserManagementService) {
    this._breadcrumbRouteEventEmitterService.BreadcrumbRouteObservable.subscribe(val => {
      this.viewCardInfo = val;
    });
  }



  ngOnInit() {
    this.userObject = this._storage.get('userdetails');
    this._userService.getParticipantData().subscribe(data => {
      const statusData = data.json();
      if (statusData) {
        this.participantData.alert_status = statusData.alert_status;
        this.participantData.critical_status = statusData.critical_status;
        this.participantData.data_not_received = statusData.data_not_received;
      }
    });
  }
  getName() {
    this.textForImg = this.firstName[0] + ' ' + this.lastName[0];
    this.myData = this.participantData;
  }
  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (changes['participantData'] !== undefined) {
      if (this.participantData) {
        this.userData = this.participantData;
        this.firstName = this.userData.first_name;
        this.lastName = this.userData.last_name;
        this.middleName = this.userData.middle_name;
        this.alertStatus = this.userData.alert_status;
        this.criticalStatus = this.userData.critical_status;
        this.totalCount = this.userData.total_count;
        this.roleName = this.userData.role_name;
        this.facilityName = this.userData.facility_name;
        this.getName();
      }
    }
  }
  getRouteName(headerTitle) {
    this.dashboardHeaderTitle = headerTitle;
  }

}

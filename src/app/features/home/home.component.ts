import { Component, OnInit, ViewContainerRef, Input, ChangeDetectorRef } from '@angular/core';
import { UserManagementService } from '../../services';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
// Breadcrumb services
import { MenuItem } from 'primeng/primeng';
import { BreadcrumbService } from '../../services';
import { BreadcrumbRouteEventEmitterService } from '../../services/breadcrumb-route-service/breadcrumb-route.service';
import { DateUtilityService } from '../../services';
import { AppACLService, AclService } from '../../services/';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [UserManagementService, BreadcrumbService, BreadcrumbRouteEventEmitterService,
    DateUtilityService]
})
export class HomeComponent implements OnInit {

  dashboardHeaderTitle: string;
  userDetails: any;
  fullName: string;
  participantDetails: Object;
  isParticipant = false;

  // User Object from LocalStorage
  userObject: any;

  // Variable for breadcrumb 
  breadcrumbs: any;
  breadcrumbItems: MenuItem[];

  constructor(private _userService: UserManagementService, private _router: Router,
    private _storage: LocalStorageService, private _activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private _breadcrumbRouteEventEmitterService: BreadcrumbRouteEventEmitterService,
    private changeDetectorRef: ChangeDetectorRef,
    private _appACLService: AppACLService) {
    this.breadcrumbItems = [];

    this.breadCrumbEventEmitter();
  }

  ngOnInit() {

    this.userObject = this._storage.get('userdetails');
    if (this.userObject.roleType != 'ADMIN') {
      this.userDetails = this._userService.getUserDetails();
      this.fullName = this.getFullName(this.userDetails);

      // this.participantDetails = this._userService.getParticipantData()
      this._userService.getParticipantData().subscribe(data => {
        this.participantDetails = data.json();
      });

      this._router.events.subscribe(event => {
        var url = event['url'];
        var componentName = url.split("/");
        if (componentName[2] == 'participant-dashboard') {
          this._storage.set('isParticipant', true);
          this.isParticipant = true;
        }
        else {
          this._storage.set('isParticipant', false);
          this.isParticipant = false;
        }
      });
    } else {
      this.participantDetails = this._storage.get('userdetails');
      console.log(this.participantDetails);
    }

    // Set breadcrumb to get breadcrumb list
    this.breadcrumbService.setBreadcrumbs('Home', null);
    // Subscribe breadcrumb service
    this.breadcrumbService.breadcrumbItem.subscribe((val: MenuItem[]) => {
      if (val) {
        this.breadcrumbItems = val;
        this.changeDetectorRef.detectChanges();
      }
    });

  }

  getFullName(data: Object) {
    if (data['middle_name'] != undefined) {
      return data['first_name'] + " " + data['middle_name'] + " " + data['last_name'];
    }
    else {
      return data['first_name'] + " " + data['last_name'];
    }
  }

  getRouteName(headerTitle) {
    this.dashboardHeaderTitle = headerTitle;
  }

  // Breadcrumb Event Emitter to get page title
  breadCrumbEventEmitter() {
    this._router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(event => {  // note, we don't use event
        this.breadcrumbs = [];
        let currentRoute = this._activatedRoute.root,
          url = '';

        do {
          const childrenRoutes = currentRoute.children;
          currentRoute = null;
          childrenRoutes.forEach(route => {
            if (route.outlet === 'primary' && route.snapshot.data['breadcrumb'] !== null) {
              const routeSnapshot = route.snapshot;
              url += '/' + routeSnapshot.url.map(segment => segment.path).join('/');
              this.breadcrumbs.push({
                label: route.snapshot.data['breadcrumb'],
                pageTitle: route.snapshot.data['pageTitle'],
                url: url
              });
              currentRoute = route;
            }
          });
        } while (currentRoute);

        const val = this.breadcrumbs.slice(-1)[0]['pageTitle'];

        this._breadcrumbRouteEventEmitterService.breadcrumbRouteChangeEvent(val);

      });
  }
}

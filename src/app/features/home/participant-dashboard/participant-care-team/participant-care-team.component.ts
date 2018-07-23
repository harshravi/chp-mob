import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { ParticipantDashboardService } from '../../../home/participant-dashboard/participant-dashboard.service';
import { CareTeamService } from '../../../home/care-team/care-team.service';
/** importing breadcrumb service to set breadcrumb */
import { BreadcrumbService } from '../../../../services';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-participant-care-team',
  templateUrl: './participant-care-team.component.html',
  styleUrls: ['./participant-care-team.component.scss'],
  providers: [ParticipantDashboardService, CareTeamService]
})
export class ParticipantCareTeamComponent implements OnInit {
  @ViewChild('myTable') table: DatatableComponent;
  @ViewChild('tableWrapper') tableWrapper;

  // care team members list.
  currentComponentWidth:any;
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
    private _storage: LocalStorageService,
    private _careTeamService: CareTeamService,
    private _breadcrumbService: BreadcrumbService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngAfterViewChecked() {
    // Check if the table size has changed,
    if (this.table && this.table.recalculate && (this.tableWrapper.nativeElement.clientWidth !== this.currentComponentWidth)) {
      this.currentComponentWidth = this.tableWrapper.nativeElement.clientWidth;
      this.table.recalculate();
      this.changeDetectorRef.detectChanges();
    }
  }
  ngOnInit() {
    let map = new Map<string, string>();
    map.set('participantName', String(this._storage.get('participantName')));
    map.set('id', String(this._storage.get('participantId')));
    this._breadcrumbService.setBreadcrumbs("Patient Care Team", map);
    this.getCareTeamMembers();
  }

  /** method to get care team members */
  getCareTeamMembers() {
    this.dataLoadingStarted();
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
    }, error => {
      this.dataLoadingCompleted();
    });
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
    this.table.offset = 0;
  }

  dataLoadingStarted(): void {
    this.isDataLoading = true;
  }

  dataLoadingCompleted(): void {
    this.isDataLoading = false;
  }

}

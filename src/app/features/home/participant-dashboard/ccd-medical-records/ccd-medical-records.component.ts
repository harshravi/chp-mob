import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { ParticipantDashboardService } from '../participant-dashboard.service';
import { ActivatedRoute } from '@angular/router';
/** importing breadcrumb service to set breadcrumb */
import { BreadcrumbService } from '../../../../services';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-ccd-medical-records',
  templateUrl: './ccd-medical-records.component.html',
  styleUrls: ['./ccd-medical-records.component.scss'],
  providers: [ParticipantDashboardService]
})
export class CcdMedicalRecordsComponent implements OnInit {
  currentComponentWidth: any;
  @ViewChild('myTable') table: DatatableComponent;
  @ViewChild('tableWrapper') tableWrapper;

  /** participant name getting from participant's header component */
  participantName;

  // Client Grid's title
  gridIBoxTitle = 'Medical Records';

  /** Variable to display all ccd names in dropdown */
  ccdList;
  // Variable to hide html before loading complete data
  ccdAllList = true;

  /** To get participant-id from URL */
  participantId;

  showDuplicates = false;
  rows: any[];
  columns;
  count = 0;
  offset = 0;
  limit = 10;
  externalPaging = true;

  /** Variable for selected ccd  from summery of Medical Records*/
  selectedCCD;
  showDuplicatesEnable;

  /** Variable to display visit information inside table(in ccd view all section) */
  visitInfo;

  isDataLoading: boolean;

  constructor(private route: ActivatedRoute,
    private _storage: LocalStorageService,
    private _participantDashboardService: ParticipantDashboardService,
    private _breadcrumbService: BreadcrumbService,
    private changeDetectorRef: ChangeDetectorRef ) {
    // this.selectedCCD = route.snapshot.params['selectedCCD'];
    /** This is for dropdown to CCD */
    this.ccdList = [
      { id: 'allergies', filterBy: 'Allergies' },
      { id: 'impairments', filterBy: 'Impairments' },
      { id: 'problems', filterBy: 'Problems' },
      { id: 'procedures', filterBy: 'Procedures' },
      { id: 'hospitalization_reason', filterBy: 'Hospitalizations' },
      { id: 'social_history', filterBy: 'Social History' },
      { id: 'visit_information', filterBy: 'Visit Information' },
    ];
  }
  ngAfterViewChecked() {
    // Check if the table size has changed,
    if (this.table && this.table.recalculate && (this.tableWrapper.nativeElement.clientWidth !== this.currentComponentWidth)) {
      this.currentComponentWidth = this.tableWrapper.nativeElement.clientWidth;
      this.table.recalculate();
      this.changeDetectorRef.detectChanges();
    }
  }

  ngOnInit() {
    this.selectedCCD = this.route.snapshot.params['selectedCCD'];
    this.participantName = this._storage.get('participantName');
    this.participantId = this._storage.get('participantId');
    let map = new Map<string, string>();
    map.set('participantName', this.participantName);
    map.set('id', this.participantId);
    this._breadcrumbService.setBreadcrumbs('Medical Record', map);
    this.getSelectedCCDInfo();
  }

  onCheckedOrUnchecked(event) {
     this.dataLoadingStarted();
    this.showDuplicatesEnable = event;
    if (event === true) {
      this._participantDashboardService.getCCDAllDetails(this.selectedCCD, this.participantId, 2).then(data => {
        this.rows = data;
        this.dataLoadingCompleted();
      }, error => {
      this.dataLoadingCompleted();
    });
    } else {
      this._participantDashboardService.getCCDAllDetails(this.selectedCCD, this.participantId, 0).then(data => {
        this.rows = data;
        this.dataLoadingCompleted();
      }, error => {
      this.dataLoadingCompleted();
    });
    }
  }
  /** on click of View All in CCD section ,this is calling to get all data on selected CCD */
  getSelectedCCDInfo() {
    this.dataLoadingStarted();
    this.ccdAllList = false;
    let status = 0;
    if (this.showDuplicatesEnable === true) {
      status = 2;
    }
    // this.getColumn();
    this._participantDashboardService.getCCDAllDetails(this.selectedCCD, this.participantId, status).then(data => {
      this.visitInfo = data;
      this.dataLoadingCompleted();
      if (this.selectedCCD === 'hospitalization_reason') {
        for (let i = 0; i < data.length; i++) {
          const num = data[i].reason.length;
          if (num <= 500) {
            data[i].changedReason = data[i].reason;
          } else {
            data[i].changedReason = data[i].reason.substring(0, 500);
          }
        }
        this.ccdAllList = true;
        this.rows = data;
        this.count = data.length;
      } else
        if (this.selectedCCD === 'visit_information') {
          this.ccdAllList = true;
          this.rows = data.careTeam_info;
          this.count = data.careTeam_info.length;
        } else {
          this.ccdAllList = true;
          this.rows = data;
          this.count = data.length;
        }
    }, error => {
      this.dataLoadingCompleted();
    });
  }

  inActiveCCD(input_data) {
    this._participantDashboardService.activeOrInactiveParticipantCCD(this.selectedCCD, this.participantId, input_data, 2).then(data => {
      if (this.showDuplicatesEnable === true) {
        this._participantDashboardService.getCCDAllDetails(this.selectedCCD, this.participantId, 2).then(ccdAllDetailsRes => {
          this.rows = ccdAllDetailsRes;
        });
      } else {
        this._participantDashboardService.getCCDAllDetails(this.selectedCCD, this.participantId, 0).then(ccdAllDetailsRes => {
          this.rows = ccdAllDetailsRes;
        });
      }

    });
  }
  activeCCD(input_data) {
    this._participantDashboardService.activeOrInactiveParticipantCCD(this.selectedCCD, this.participantId, input_data, 0).then(data => {
      this._participantDashboardService.getCCDAllDetails(this.selectedCCD, this.participantId, 2).then(ccdAllDetailsRes => {
        this.rows = ccdAllDetailsRes;
      });
    });
  }

  dataLoadingStarted(): void {
    this.isDataLoading = true;
  }

  dataLoadingCompleted(): void {
    this.isDataLoading = false;
  }
}

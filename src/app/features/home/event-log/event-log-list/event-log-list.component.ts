import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
/** Imports for the Modal to be involked on Button Click */
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { EventLogModalComponent, EventLogModalContext } from './../../global-modal';
import { EventLogService } from '../event-log.service';
import { LocalStorageService } from 'angular-2-local-storage';
/** importing breadcrumb service to set breadcrumb */
import { BreadcrumbService } from '../../../../services';
import { DateUtilityService } from '../../../../services';
import { GlobalEventEmitterService } from '../../../../services/EventEmitter/global-event-emitter.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as _ from 'lodash';
@Component({
  selector: 'app-event-log-list',
  templateUrl: './event-log-list.component.html',
  styleUrls: ['./event-log-list.component.scss'],
  providers: [EventLogService]
})
export class EventLogListComponent implements OnInit, AfterViewChecked {
  currentComponentWidth: any;
  @ViewChild('myTable') table: DatatableComponent;
  @ViewChild('tableWrapper') tableWrapper;
  // colective object for post request
  participantData;
  timeout: any;
  // colection of eventlog data to show in table row 
  rows = [];
  // Client Grid's title
  gridIBoxTitle = 'Event Log';
  // constant for no-padding style class for the box component
  noPadClassForComponent = 'no-padding';
  // event log details
  eventlogDetails;
  searchEventlogText: string;
  // Symptom modal taggle flag
  isOpenSymptomModalOpen = false;
  // search deatils from api response
  searchDetails: any;
  // making time period drop by default selected as "Last Two Days"
  selectedTimePeriod = 2;
  hidePrevBtn = true;
  offsetCount = 0;
  isDataLoading: boolean;
  constructor(private _modal: Modal, private _eventlogService: EventLogService,
    private _storage: LocalStorageService,
    private _breadcrumbService: BreadcrumbService,
    private _dateUtilityService: DateUtilityService,
    private _globalEventEmitterService: GlobalEventEmitterService,
    private changeDetectorRef: ChangeDetectorRef) {

    this.participantData = {
      'participant_id': this._storage.get('participantId'),
      'selected_time_period': 2,
      'search_value': null,
      'time_zone_offset': (new Date().getTimezoneOffset() * -1),
      'offset': 0
    };
    this._globalEventEmitterService.modalClosedObservable.subscribe(closed => {
      this.isOpenSymptomModalOpen = false;
    });
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
    // calling function to get evenlog data
    this.loadEventlogSnapshotData();
    let map = new Map<string, string>();
    map.set('participantName', String(this._storage.get('participantName')));
    map.set('id', String(this._storage.get('participantId')));
    this._breadcrumbService.setBreadcrumbs("Event Log", map);
  }
  // calling service to get evenlog data which we have to show in modal
  eventLogModal(id) {
    this._eventlogService.getEventlogDetails(id).then(data => {
      this.eventlogDetails = data;
      this.eventDetailsModal(id);
    });
  }
  // Calling service to get eventlog data
  loadEventlogSnapshotData() {
    this.dataLoadingStarted();
    this.rows = [];
    this._eventlogService.getEventlogTabular(this.participantData).then(data => {
      this.dataLoadingCompleted();
      /**
       * Checking for event type = 'seizure events'
       * IF found then put color code = 'grey'. Handling it in UI to show the color
       */
      _.each(data.event_data, (obj) => {
        if (obj.event_type === 'Seizure Events') {
          obj.color_code = 2;
        }
      });
      this.rows = data.event_data;
      this.searchDetails = data.search_details;
    }, error => {
      this.dataLoadingCompleted();
    });
  }
  // Function to open modal for showing event details
  eventDetailsModal(id) {
    if (this.isOpenSymptomModalOpen) {
      return;
    };

    this.isOpenSymptomModalOpen = true;

    let eventLogStatus = '';
    const eventLogFound = _.find(this.rows, { event_log_id: id });

    if (eventLogFound) {
      eventLogStatus = eventLogFound.status;
    }

    if (this.eventlogDetails) {
      this._modal.open(EventLogModalComponent,
        overlayConfigFactory({
          eventLogStatus: eventLogStatus,
          eventLogPlan: true, eventLogDetails: this.eventlogDetails, eventLogId: id
        }, EventLogModalContext));
    }
  }
  // filter event log list with time period
  timePeriodSelection(timePeriod) {
    this.searchEventlogText = '';
    this.hidePrevBtn = true;
    this.participantData.selected_time_period = timePeriod;
    this.participantData.search_value = '';
    this.participantData.offset = 0;
    this.loadEventlogSnapshotData();
  }
  // filter event log list with text
  searchWithText(event) {
    let val = event.target.value;
    val = val.toLowerCase();
    this.participantData.search_value = val;
    this.participantData.offset = 0;
    this.loadEventlogSnapshotData();
  }
  // Function for pagination
  onPage(event) {
    if (this.participantData) {
      this.participantData.offset = event.offset;
    }
    this.loadEventlogSnapshotData();
  }
  // call this method for responsive method
  updateTableNext(event) {
    this.offsetCount++;
    this.hidePrevBtn = false;
    this.participantData.offset = this.offsetCount;
    this.loadEventlogSnapshotData();
  }
  updateTablePrev(event) {
    this.offsetCount--;
    this.participantData.offset = this.offsetCount;
    if (this.offsetCount <= 0) {
      this.hidePrevBtn = true;
    }
    this.loadEventlogSnapshotData();
  }
  dataLoadingStarted(): void {
    this.isDataLoading = true;
  }

  dataLoadingCompleted(): void {
    this.isDataLoading = false;
  }
}

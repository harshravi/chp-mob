import { Component, OnInit } from '@angular/core';
import { EventLogModalContext } from './event-log-modal-context';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { LocalStorageService } from 'angular-2-local-storage';
import { EventLogService } from './event-log.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DateUtilityService } from '../../../../services';
import { GlobalEventEmitterService } from '../../../../services/EventEmitter/global-event-emitter.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-event-log-modal',
  templateUrl: './event-log-modal.component.html',
  styleUrls: ['./event-log-modal.component.scss'],
  providers: [EventLogService]
})
export class EventLogModalComponent implements OnInit, ModalComponent<EventLogModalContext> {
  context: EventLogModalContext;
  // eventlog deatils from service call
  eventLogDetails;
  // eventlog participant name
  participantName;
  // object for event log details
  eventLogData = {};
  // Modals heading text
  heading;
  // show eventlog date in modal
  eventDate;
  // Details for symptom assessment
  symptomAssessmentDetails;
  // Details for scheduled assessment
  scheduledAssessmentDetails
  // Details for intervention
  interventionDetails;
  scheduledAssessmentAnswer = false;
  reviewQuestionnaireAnswer = false;
  showAssessmentData = true;
  // showSymptomAssessment = false;
  // showScheduledAssessment =false;
  eventLogStatus: string;

  eventLogId;
  constructor(private _storage: LocalStorageService, private _eventlogService: EventLogService,
    public dialog: DialogRef<EventLogModalContext>, public router: Router, public route: ActivatedRoute,
    public _dateUtilityService: DateUtilityService, private _globalEventEmitterService: GlobalEventEmitterService) {
    this.context = dialog.context;
    this.participantName = this._storage.get('participantName');
    this.eventLogDetails = this.context.eventLogDetails;
    this.eventLogId = this.context.eventLogId;
    this.eventLogStatus = this.context.eventLogStatus;

    this.dialog.result.then(() => { }, () => {
      this._globalEventEmitterService.modalClosedEvent();
    });
  }

  ngOnInit() {
    // calling function to get eventlog Details
    this.getEventlogData();
  }
  // function is to call service to get event log details
  getEventlogData() {
    this.scheduledAssessmentDetails = [];
    this.symptomAssessmentDetails = [];

    if (this.eventLogDetails.data_type === 'VITAL') {
      this.eventLogData = this.eventLogDetails.vital_data;
      this.heading = this.eventLogData['heading'];
      this.eventDate = this.eventLogData['event_date'];
      if (this.eventLogData['vital_type'] === 'WHBMI') {
        this.eventLogData['trigerFormat'] = this.eventLogData['value'] + ' ' +
          this.eventLogData['unit'] + '/' + this.eventLogData['value_ext'];
      } else if (this.eventLogDetails.data_type === 'VITAL' && this.eventLogData['vital_type'] === 'BG') {
        this.eventLogData['trigerFormat'] = this.eventLogData['value'] + ' ' + this.eventLogData['unit'] + ' ' +
          this.eventLogData['value_ext'].charAt(0).toUpperCase() + this.eventLogData['value_ext'].slice(1) + ' ' + 'Meal';
      } else if (this.eventLogData['vital_type'] === 'BP') {
        this.eventLogData['trigerFormat'] = this.eventLogData['value'] + '/' + this.eventLogData['value_ext'] + ' ' + this.eventLogData['unit'];
      } else if (this.eventLogData['vital_type'] === 'O2S') {
        this.eventLogData['trigerFormat'] = this.eventLogData['value'] + this.eventLogData['unit'];
      } else {
        this.eventLogData['trigerFormat'] = this.eventLogData['value'] + ' ' + this.eventLogData['unit'];
      }
    } else if (this.eventLogDetails.data_type === 'ASY') {
      this.eventLogData = this.eventLogDetails.assessment_data;
      this.symptomAssessmentDetails = this.eventLogDetails.symptom_assessment_details;
      this.heading = this.eventLogData['heading'];
      this.eventDate = this.eventLogData['event_date'];
    } else if (this.eventLogDetails.data_type === 'ASC') {
      this.eventLogData = this.eventLogDetails.assessment_data;
      this.scheduledAssessmentDetails = this.eventLogDetails.scheduled_assessment_details;
      this.heading = this.eventLogData['heading'];
      this.eventDate = this.eventLogData['event_date'];
      if ((this.scheduledAssessmentDetails.expiry_status == 1 && this.scheduledAssessmentDetails.assessment_status == 0)
        || (this.scheduledAssessmentDetails.expiry_status == 0 && this.scheduledAssessmentDetails.assessment_status == 0)) {
        this.scheduledAssessmentAnswer = false;
      } else {
        this.scheduledAssessmentAnswer = true;
      }
    } else if (this.eventLogDetails.data_type === 'INTERVENTION') {
      this.eventLogData = this.eventLogDetails.eventlog_data;
      this.interventionDetails = this.eventLogDetails.intervention_details;
      this.heading = this.eventLogData['heading'];
      this.eventDate = this.eventLogData['event_date'];
    } else if (this.eventLogDetails.data_type === 'CARE_CMPL' || this.eventLogDetails.data_type === 'MED_CMPL') {
      this.eventLogData = this.eventLogDetails.compliance_data;
      this.heading = this.eventLogData['heading'];
      this.eventDate = this.eventLogData['event_date'];
    } else if (this.eventLogDetails.data_type === 'SIE') {
      this.eventLogData = this.eventLogDetails.seizure_incident_data;
      this.heading = this.eventLogData['heading'];
      this.eventDate = this.eventLogData['event_date'];
    } else if (this.eventLogDetails.data_type === 'SQ') {
      this.eventLogData = this.eventLogDetails.seizure_questionnair_data;
      this.heading = this.eventLogData['heading'];
      this.eventDate = this.eventLogData['event_date'];
    } else if (this.eventLogDetails.data_type === 'ARE') {

      this.eventLogData = this.eventLogDetails.review_questionnaire_data;

      if (this.eventLogDetails.review_questionnaire_data &&
        this.eventLogDetails.review_questionnaire_data.review_questions) {
        this.eventLogData = _.merge(this.eventLogData,
          this.eventLogDetails.review_questionnaire_data.review_questions);
      }

      this.heading = this.eventLogData['heading'];
      this.eventDate = this.eventLogData['event_date'];
      this.reviewQuestionnaireAnswer = true;
    }
  }

  closeSymptomModal() {
    var data = "true";
    this.dialog.close(data);
    this._globalEventEmitterService.modalClosedEvent();
  }
  // function to open new window to see answer of assessment in tab,***( but we have to check how we can redirect from html)***
  opentest() {
    var url = this.router.url + "/assessment" + '/' + this.eventLogId;
    window.open(url);
    // this.router.navigate(['../assessment', this.eventLogId], { relativeTo: this.route});
  }
}

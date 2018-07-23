import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';

import { EventLogService } from '../event-log/event-log.service';
import { EventLogTypeEnum, EventLogType } from '../../../models/common.model';

/** importing breadcrumb service to set breadcrumb */
import { BreadcrumbService } from '../../../services';
import * as _ from 'lodash';

@Component({
  selector: 'app-eventlog-assessment-details',
  templateUrl: './eventlog-assessment-details.component.html',
  styleUrls: ['./eventlog-assessment-details.component.scss'],
  providers: [EventLogService]
})
export class EventlogAssessmentDetailsComponent implements OnInit {
  // Id of assessment to call the service to get data regarding the answer of assessment
  assessmentId;
  // complete data from the service of eventlog of assessment
  eventLogDetails;
  // symptoms available in assessment
  symptomAssessment = [];
  // data of scheduled assessment
  scheduledAssessmentDetails;
  // data of symptom assessment
  seizureQuestionnaireDetails;
  symptomAssessmentDetails;
  isAnyUserAnswerWrong = false;
  isReviewQuestionnaire = false;

  routMap
  // Title of the page
  gridIBoxTitle = 'Questionnaire answers';
  constructor(private route: ActivatedRoute, private router: Router, private _eventlogService: EventLogService, private _breadcrumbService: BreadcrumbService, private _storage: LocalStorageService) {

  }

  ngOnInit() {
    this.assessmentId = this.route.snapshot.params['eventId'];
    this.assessmentDetails(this.assessmentId);
    let map = new Map<string, string>();
    map.set('participantName', String(this._storage.get('participantName')));
    this.routMap = map.set('id', String(this._storage.get('participantId')));
    this._breadcrumbService.setBreadcrumbs("Assessment Answer", map);
  }
  // calling service to get data for assessment
  assessmentDetails(assessmentId) {
    this._eventlogService.getEventlogDetails(assessmentId).then(data => {
      this.eventLogDetails = data;
      this.eventlogAssessment();
    });
  }

  // checking condition for assessment data type and fetching data according to that
  eventlogAssessment() {
    if (this.eventLogDetails.data_type === 'ASY') {
      // this.eventLogAssessmentData = this.eventLogDetails.assessment_data;
      this.symptomAssessmentDetails = this.eventLogDetails.symptom_assessment_details
      this.symptomAssessment = this.eventLogDetails.symptom_assessment_details.symptoms;
    } else if (this.eventLogDetails.data_type === 'ASC') {
      this.scheduledAssessmentDetails = this.eventLogDetails.scheduled_assessment_details;
      this.scheduledAssessmentDetails.assessment_questions.forEach(element => {
        element.scales.forEach(data => {
          if (element.answer === data.scale_id) {
            data.showCheckbox = true;
            data.fontStrong = 'font-bold';
          }
        });
      });
    } else if (this.eventLogDetails.data_type === 'SQ') {
      //ARE
      this._breadcrumbService.setBreadcrumbs("Seizure Questionnaire", this.routMap);
      this.gridIBoxTitle = 'Seizure Questionnaire';
      this.seizureQuestionnaireDetails = this.eventLogDetails.seizure_questionnair_data;

    } else if (this.eventLogDetails.data_type === 'ARE') {
      debugger;

      this.gridIBoxTitle = this.eventLogDetails.review_questionnaire_data.heading;

      this.scheduledAssessmentDetails = this.eventLogDetails.review_questionnaire_data;


      if (this.eventLogDetails.review_questionnaire_data.review_questions) {
        this.scheduledAssessmentDetails = _.merge(this.scheduledAssessmentDetails,
          this.eventLogDetails.review_questionnaire_data.review_questions);
      }

      // this.scheduledAssessmentDetails.assessment_name =
      //    &&
      //   this.eventLogDetails.review_questionnaire_data.review_questions.assessment_name;


      // this.scheduledAssessmentDetails.assessment_questions =
      //   this.eventLogDetails.review_questionnaire_data.review_questions &&
      //   this.eventLogDetails.review_questionnaire_data.review_questions.assessment_questions;

      // this.scheduledAssessmentDetails.assessment_status =
      //   this.eventLogDetails.review_questionnaire_data.review_questions &&
      //   this.eventLogDetails.review_questionnaire_data.review_questions.assessment_status;

      // this.scheduledAssessmentDetails.language =
      //   this.eventLogDetails.review_questionnaire_data.review_questions &&
      //   this.eventLogDetails.review_questionnaire_data.review_questions.language;

      this.scheduledAssessmentDetails.assessment_questions.forEach(quest => {
        quest.isUserAnswerCorrect = true;

        if (quest.answer_string !== quest.correct_answer) {
          quest.isUserAnswerCorrect = false;
          this.isAnyUserAnswerWrong = true;
        }

        quest.scales.forEach(data => {
          if (quest.answer === data.scale_id) {
            data.showCheckbox = true;
            data.fontStrong = 'font-bold';
          }
        });

      });
    }
  }
  // for color specification of ASY table
  getClass(status: EventLogTypeEnum) {
    switch (status) {
      case EventLogType.NONE: return 'border-status-green';
      case EventLogType.CLEAR: return 'border-status-green';
      case EventLogType.YELLOW: return 'border-status-green';
      case EventLogType.GREEN: return 'border-status-green';
      case EventLogType.FULL: return 'border-status-green';
      case EventLogType.MODERATE: return 'border-status-alert';
      case EventLogType.SOMEWHAT: return 'border-status-alert';
      case EventLogType.SEVERE: return 'border-status-danger';
      case EventLogType.NOT_AT_ALL: return 'border-status-danger';
      case EventLogType.YES: return 'border-status-danger';
      case EventLogType.RED: return 'border-status-danger';
      case EventLogType.NO: return 'border-status-green';
      case EventLogType.MODERATE: return 'border-status-green';
      case EventLogType.RED: return 'border-status-danger';
      case EventLogType.YELLOW: return 'border-status-green';
      case EventLogType.CLEAR: return 'border-status-green';
      case EventLogType.GREEN: return 'border-status-green';
    }
  }
}
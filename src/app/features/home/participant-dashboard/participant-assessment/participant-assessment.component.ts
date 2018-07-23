import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { ParticipantDashboardService } from '../participant-dashboard.service';
import { AssessmentDetailModalComponent, AssessmentDetailModalContext } from './../../global-modal';
import { DateUtilityService } from '../../../../services';

/** Imports for the Modal to be involked on Button Click */
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';

/** importing breadcrumb service to set breadcrumb */
import { BreadcrumbService } from '../../../../services';
import { ISeizureDetails, ISeizureDetail, IAssessmentModalData, ISeizureQuestionModel } from '../view-participant/model/seizureDetail.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-participant-assessment',
  templateUrl: './participant-assessment.component.html',
  styleUrls: ['./participant-assessment.component.scss'],
  providers: [ParticipantDashboardService]
})
export class ParticipantAssessmentComponent implements OnInit {
  currentComponentWidth: any;
  @ViewChild('myTable') table: DatatableComponent;
  @ViewChild('tableWrapper') tableWrapper;

  // Get assessment box title
  assessmentListIBoxTitle = ' Questionnaires ';

  // To get participant-id from URL
  participantId;

  // To get table property
  rows: any;
  columns;
  count = 0;
  offset = 0;
  limit = 10;
  externalPaging = true;
  isDataLoading: boolean;

  // To make table column align center
  textCenter = 'align-center';

  // Flag to disable the link, during modal opening to not allow multiple clicks.
  showOpenAssessment = false;
  seizureDetails: ISeizureDetail[];
  seizureQuestion: ISeizureQuestionModel;

  constructor(private _storage: LocalStorageService, private _participantDashboardService: ParticipantDashboardService,
    private _modal: Modal, private _dateUtilityService: DateUtilityService, private changeDetectorRef: ChangeDetectorRef,
    private _breadcrumbService: BreadcrumbService) {

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
    this.participantId = this._storage.get('participantId');
    let map = new Map<string, string>();
    map.set('participantName', String(this._storage.get('participantName')));
    map.set('id', String(this._storage.get('participantId')));
    this._breadcrumbService.setBreadcrumbs("Assessment", map);

    // Calling assessment list data function
    this.getAssessments();
  }

  /** method to get assessments */
  getAssessments() {
    this.dataLoadingStarted();

    // this._participantDashboardService.getAssessmentList(this.participantId).then(data => {
    //   this.rows = data;
    //   this.dataLoadingCompleted();
    // }, error => {
    //   this.dataLoadingCompleted();
    // });

    this.rows = [];

    // const pr = new Promise((res, rej) => {
    //   res([]);
    // });

    Promise.all([
      //pr,
      this._participantDashboardService.getAssessmentList(this.participantId),
      this._participantDashboardService.getSeizureAssessmentList(this.participantId),
      this._participantDashboardService.getIsEpilepsyUser(this.participantId),
      this._participantDashboardService.getSeizureAssessmentQuestionList(this.participantId)
    ]).then((values: any) => {

      // this.isDLQuestionnaires = false;
      this.dataLoadingCompleted();
      if (values[2].is_epilepsy) {

        this.seizureDetails = values[1];

        if (this.seizureDetails && this.seizureDetails.length) {
          //debugger;

          const seizureDetailsMax = _.maxBy(this.seizureDetails, val => val.updated_date);

          const firstRow = this.seizureDetails[0];
          const isPendingStatus = firstRow.seizureDate !== null;

          if (isPendingStatus) {
            _.forEach(this.seizureDetails, val => {
              val.assessment_date = val.seizureDate;
            });
          }


          this.rows.push({
            assessment_status: isPendingStatus ? 0 : 1,
            expiry_status: 0,
            assessment_name: 'Seizure Questionnaire',
            completed_date: firstRow.seizureDate ? firstRow.seizureDate :
              (seizureDetailsMax ? seizureDetailsMax.updated_date : null)
          });

        }

        this.seizureQuestion = values[3];

        if (this.seizureQuestion && this.seizureQuestion.is_review_questions) {

          let reviewQuestionnaireData = {
            assessment_status: this.seizureQuestion.assessment_status,
            expiry_status: 0,
            assessment_name: this.seizureQuestion.assessment_name,
            completed_date: null
          };

          this.rows.push(reviewQuestionnaireData);



          this._participantDashboardService.getReviewSeizureQuestionnaireData(this.participantId)
            .then(data => {
              
              reviewQuestionnaireData.completed_date = data.completed_date;


            }, err => {
              //debugger;
            });

        }

      }

      this.rows = this.rows.concat(values[0]);

    }, errs => {
      this.dataLoadingCompleted();
      this.rows = [];
    });
  }

  /** Method for question assessment */
  openQuestionsAssessmentModal(assessmentId, participantName, assessmentName) {
    if (!assessmentId) {
      const data: any[] = [];

      assessmentName = assessmentName || 'Seizure Questionnaire';

      data.push(<IAssessmentModalData>{
        seizureDetails: this.seizureDetails,
        isEpilepsy: true,
        assessment_name: assessmentName,
        participant_name: <string>this._storage.get('participantName'),
        seizureQuestion: this.seizureQuestion,
        participantId: this.participantId
      });

      this._modal.open(AssessmentDetailModalComponent,
        overlayConfigFactory({ edit: false, assessmentQuestionDetails: { data: data } }, AssessmentDetailModalContext));
      this.showOpenAssessment = false;

    } else {

      this.showOpenAssessment = true;
      this._participantDashboardService.getQuestionsOfAssessment(this.participantId, assessmentId).then(data => {

        data.assessmentId = assessmentId;
        data.participantId = this.participantId;
        data.participantName = participantName;
        this._modal.open(AssessmentDetailModalComponent,
          overlayConfigFactory({ edit: false, assessmentQuestionDetails: { data: data } }, AssessmentDetailModalContext));
        this.showOpenAssessment = false;
      }, error => {
        // If error occurs in opening modal. Making the flag enable again so that link is active again.
        this.showOpenAssessment = false;
      });
    }
  }

  dataLoadingStarted(): void {
    this.isDataLoading = true;
  }

  dataLoadingCompleted(): void {
    this.isDataLoading = false;
  }

}

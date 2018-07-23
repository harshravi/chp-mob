import { Component, OnInit } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { AssessmentDetailModalContext } from './assessment-detail-modal-context';
import { LocalStorageService } from 'angular-2-local-storage';
import { GlobalEventEmitterService } from '../../../../services/EventEmitter/global-event-emitter.service';
import { DateUtilityService } from '../../../../services';
import { ISeizureDetail, ISeizureQuestionModel } from '../../participant-dashboard/view-participant/model/seizureDetail.model';
import * as _ from 'lodash';
import { ParticipantDashboardService } from '../../participant-dashboard/participant-dashboard.service';
import {
  IFirstAssessmentDetail, IReviewQuestionnaireDetail, IAssessmentQuestionDetails,
  IReviewQuestionnaireQuestions
} from './model/assessment-detail.model';

@Component({
  selector: 'app-assessment-detail-modal',
  templateUrl: './assessment-detail-modal.component.html',
  styleUrls: ['./assessment-detail-modal.component.scss'],
  providers: [ParticipantDashboardService]
})
export class AssessmentDetailModalComponent implements OnInit, CloseGuard, ModalComponent<AssessmentDetailModalContext> {

  // Context here referres to the context of the Modal that is being opened.
  // This context carries data that can be seen in the Class Decleration.
  context: AssessmentDetailModalContext;

  // To get the question of the assessment
  assessmentQuestionDetails = [];
  participantId: string;
  isReviewQuestionnaireCompleted: boolean;

  // For show data according to click right and left arrow
  count = 0;

  isReviewQuestionnaire: boolean;
  isAnyUserAnswerWrong = false;

  reviewQuestionnaireDetails: IReviewQuestionnaireDetail = {
    participant_id: '',
    assessment_name: '',
    assessment_id: '',
    assessment_summary_id: 0,
    assessment_status: '',
    assessment_count: '',
    completed_date: null,
    assessment_date: '',
    assessment_msg_english: '',
    assessment_msg_spanish: '',
    language: '',
    assessment_questions: []
  };

  // To checking array length
  assessmentLength;

  // To disable/enable right and left arrow
  rightButtonDisable = false;
  leftButtonDisable = true;

  isDataLoading: boolean;
  isEpilepsy: boolean;
  seizureDetails: ISeizureDetail[];
  seizureDetailsOrg: ISeizureDetail[];
  seizureQuestion: ISeizureQuestionModel;
  selectedLang: string;
  seizureDetailsMax: ISeizureDetail[];
  firstAssessmentDetail: any;
  epilepsyHeaderDateDisp: number;
  firstEpilepsyDetail: ISeizureDetail;

  constructor(public dialog: DialogRef<AssessmentDetailModalContext>,
    private _storage: LocalStorageService,
    private _globalEventEmitterService: GlobalEventEmitterService,
    public _dateUtilityService: DateUtilityService,
    private _participantDashboardService: ParticipantDashboardService) {

    // Getting the context of the Modal from the DialogRef which is injected
    this.context = dialog.context;

    // This data assignment made from the context comes from the
    // Side-Nav component. This leads to the data prepopulation
    // before the form is loaded.

    this.assessmentQuestionDetails = this.context.assessmentQuestionDetails['data'];
    this.assessmentLength = this.assessmentQuestionDetails.length;

    this.firstAssessmentDetail = this.assessmentQuestionDetails && this.assessmentQuestionDetails[0];

    this.participantId = this.firstAssessmentDetail.participantId;

    this.seizureDetailsOrg = this.firstAssessmentDetail &&
      this.firstAssessmentDetail.seizureDetails;

    this.isReviewQuestionnaire = this.firstAssessmentDetail.assessment_name ===
      'Emergency Action plan review';

    //  &&
    // this.firstAssessmentDetail.seizureQuestion &&
    // this.firstAssessmentDetail.seizureQuestion.is_review_questions;

    this.isReviewQuestionnaireCompleted = this.firstAssessmentDetail.seizureQuestion &&
      this.firstAssessmentDetail.seizureQuestion.assessment_status === '1';

    // questions data for language translation
    this.seizureQuestion = this.firstAssessmentDetail &&
      this.firstAssessmentDetail.seizureQuestion
      && this.firstAssessmentDetail.seizureQuestion;

    this.selectedLang = this.seizureQuestion ?
      this.seizureQuestion.selected_language : 'english';
    this.seizureDetails = [];
    this.seizureDetailsMax = [];
    const seizureDetailA = _.find(this.seizureDetailsOrg, val => (val.type === 'Type A' || val.type === 'Letra A'));
    const seizureDetailB = _.find(this.seizureDetailsOrg, val => (val.type === 'Type B' || val.type === 'Letra B'));
    const seizureDetailC = _.find(this.seizureDetailsOrg, val => (val.type === 'Type C' || val.type === 'Letra C'));
    const seizureDetailD = _.find(this.seizureDetailsOrg, val => (val.type === 'Type D' || val.type === 'Letra D'));

   

    if (this.seizureDetailsOrg && this.seizureDetailsOrg.length) {
      this.firstEpilepsyDetail = this.seizureDetailsOrg[0];
      this.epilepsyHeaderDateDisp = this.firstEpilepsyDetail.assessment_date ||
        this.firstEpilepsyDetail.updated_date;
    }

    if (seizureDetailA) {
      this.seizureDetails.push(seizureDetailA);
    }

    if (seizureDetailB) {
      this.seizureDetails.push(seizureDetailB);
    }

    if (seizureDetailC) {
      this.seizureDetails.push(seizureDetailC);
    }

    if (seizureDetailD) {
      this.seizureDetails.push(seizureDetailD);
    }

    this.updateSeizureQuestions();
    this.isEpilepsy = this.assessmentQuestionDetails && this.assessmentQuestionDetails[0].isEpilepsy;
    /**
     * Taking out the seizure details with max date.
     * For showing the max date on the title of the seizure details modal.
     */
    if (this.isEpilepsy) {
      this.seizureDetailsMax.push(_.maxBy(this.seizureDetails, val => val.updated_date));
    }
  }

  ngOnInit() {

    // calling get assessment question function
    if (this.isEpilepsy) {
      this.isDataLoading = false;
      this.getReviewSeizureQuestionnaireData();
    } else {
      this.checkForQuestion();
    }
  }

  getReviewSeizureQuestionnaireData() {

    this._participantDashboardService.getReviewSeizureQuestionnaireData(this.participantId)
      .then(data => {

        this.reviewQuestionnaireDetails = data;
        this.reviewQuestionnaireDetails.language = ('' + this.reviewQuestionnaireDetails.language).toLowerCase();

        _.forEach(this.reviewQuestionnaireDetails.assessment_questions, quest => {
          let searchObj = {};

          quest.isUserAnswerCorrect = true;
          if (quest.answer_string !== quest.correct_answer) {
            quest.isUserAnswerCorrect = false;
            this.isAnyUserAnswerWrong = true;
          }

          let ansOpt = _.find(quest.scales, {
            ['scale_' + this.reviewQuestionnaireDetails.language]:
            quest['answer_text_' + this.reviewQuestionnaireDetails.language]
          });

          if (ansOpt) {
            ansOpt.showCheckbox = true;
          }
        });

      }, err => {
        //debugger;
      });
  }

  updateSeizureQuestions() {

    if (this.seizureDetails) {
      _.forEach(this.seizureDetails, (val, index) => {

        const question = this.seizureQuestion.seizure_types[index].questions;

        const seizureName = _.find(question, valQues => valQues.seizure_question_id === 'seizureName')
        ['seizure_question_' + this.selectedLang],

          seizureDescription = _.find(question, valQues => valQues.seizure_question_id === 'seizureDescription')
          ['seizure_question_' + this.selectedLang],

          occurrence = _.find(question, valQues => valQues.seizure_question_id === 'occurrence')
          ['seizure_question_' + this.selectedLang],

          occurrenceDetails = _.find(question, valQues => valQues.seizure_question_id === 'occurrenceDetails')
          ['seizure_question_' + this.selectedLang],

          reason = _.find(question, valQues => valQues.seizure_question_id === 'reason')
          ['seizure_question_' + this.selectedLang],

          solution = _.find(question, valQues => valQues.seizure_question_id === 'solution')
          ['seizure_question_' + this.selectedLang];


        val.question = {
          type: this.seizureQuestion.seizure_types[index]['type_' + this.selectedLang],
          seizure_name: seizureName,
          seizure_description: seizureDescription,
          occurrence: occurrence,
          occurrence_details: occurrenceDetails,
          reason: reason,
          solution: solution,
          updated_date: val.updated_date
        };
      });
    }
  }

  // To get assessment question with answer
  checkForQuestion() {
    this.dataLoadingStarted();
    this.assessmentQuestionDetails[this.count].assessment_questions.forEach(element => {
      this.dataLoadingCompleted();
      element.scales.forEach(data => {
        if (element.answer === data.scale_id) {
          data.showCheckbox = true;
          data.fontStrong = 'font-bold';
        }
      });
    });
  }

  // Method for get previous assessment data
  getPreviousData() {
    if ((this.count <= (this.assessmentLength - 1)) && this.count >= 1) {
      this.count--;
      this.checkForQuestion();
      this.rightButtonDisable = false;
      if (this.count === 0) {
        this.leftButtonDisable = true;
      }
    } else {
      this.leftButtonDisable = true;
      return true;
    }
  }

  // Method for get next assessment data
  getNextData() {
    if (this.count < (this.assessmentLength - 1)) {
      this.count++;
      this.checkForQuestion();
      this.leftButtonDisable = false;
      if (this.count >= (this.assessmentLength - 1)) {
        this.rightButtonDisable = true;
      }
    } else {
      this.rightButtonDisable = true;
      return true;
    }
  }

  // To close modal
  closeAssessmentDetailModal() {
    this.dialog.close(true);
    this._globalEventEmitterService.modalClosedEvent();
  }

  dataLoadingStarted(): void {
    this.isDataLoading = true;
  }

  dataLoadingCompleted(): void {
    this.isDataLoading = false;
  }
}

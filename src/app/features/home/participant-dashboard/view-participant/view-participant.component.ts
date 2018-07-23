import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantDashboardService } from '../participant-dashboard.service';
import { LocalStorageService } from 'angular-2-local-storage';

/** Imports for the Modal to be involked on Button Click */
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import {
  SymptomAssesmentModalContext, AddMedicationModalContext,
  SymptomAssesmentModalComponent, AddMedicationModalComponent,
  AssessmentDetailModalComponent, AssessmentDetailModalContext,
  EmergencyActionPlanModalComponent, EmergencyActionPlanModalContext
} from './../../global-modal';

import { GlobalEventEmitterService } from '../../../../services/EventEmitter/global-event-emitter.service';

/** Importing Participant Constants for Audit requirement */
import { Participant_Dashboard_Const } from '../../../../constants/audit-constants';

/** importin audit service to save audit logs */
import { AuditService } from '../../../../services';

/** importing breadcrumb service to set breadcrumb */
import { BreadcrumbService } from '../../../../services';

import * as _ from 'lodash';

import { ICustomDropdownOptions } from '../../../../components/core/dropdown/model/dropdown.model';
// ** importing common util file to use common util function */
import { CommonUtil } from '../../../../utils';

import { DateUtilityService } from '../../../../services';
import { Observable } from 'rxjs/Rx';
import { ISeizureDetail, ISeizureDetails, IAssessmentModalData, ISeizureQuestionModel } from './model/seizureDetail.model';

@Component({
  selector: 'app-view-participant',
  templateUrl: './view-participant.component.html',
  styleUrls: ['./view-participant.component.scss'],
  providers: [ParticipantDashboardService, AuditService]
})
export class ViewParticipantComponent implements OnInit {

  commonUtils = CommonUtil;
  // Client Grid's title
  gridIBoxTitle = 'Health Status';

  /** To get participant-id from URL */
  participantId;

  /** Variable for medication adherence */
  medicationAdherence;

  /** Variable for dropdown to select timeline */
  dayWiseFilter;

  /** Variable to display vital inside carousel */
  carouselData = [];
  tablularData = [];

  // Object holding all the values to be passed as tags
  listOfTags = [];
  /** For graph */
  graphData: Object;

  /** For tabular view */
  rows: Object;
  columns;
  count = 0;
  offset = 0;
  limit = 10;
  externalPaging = true;

  /** timeLine to get data according to dropdown */
  selectedTimeline = 'week';

  /** vital type to get data according to user selection  */
  currentVital;


  /** Variable to display all ccd names in dropdown */
  ccdList;

  /** Variable for selected ccd */
  selectedCCD = 'allergies';
  ccdForDetail;

  /** Variable to show latestccd-data */
  data = 44;
  latestCCDList = [];
  /** Variable to show medication Title */
  assessmentsBoxTitle = 'Assessments';
  /** Eventlog snapshot array of data */
  eventLogSnapshotDetails = [];
  /** Variable to show Event Log Title */
  eventLogBoxTitle = 'Event Log';
  /** Variable to show medication Title */
  medicationBoxTitle = 'Medication';
  /** Variable to show CCD Title */
  ccdBoxTitle = 'Medical Records';
  /** Default vital name */
  vitalName = 'Activity';
  /**care plan box title */
  carePlanBoxTitle = 'Care Plan(s)';
  // list of care plans
  listOfCarePlans: any;
  // Symptom modal taggle flag
  isOpenSymptomModalOpen = false;
  // assessment box title
  assessmentBoxTitle = 'Questionnaires';
  // var for assessment list
  assessmentList = [];
  actionPlanDetails = [];
  // constant for no-padding style class for the box component
  noPadClassForComponent = 'no-padding';

  // Code for the Demo for Progress Bar
  status: number;
  statusColor: string;
  value: number;
  progressBarTitle: string;
  proressTextColor: string;
  proressPerColor: string;
  // data regarding medication
  medicationDetails;
  // Constant text to be dispalyed as the headings of the Icontent boxes
  careTeamText = 'Care Team';
  // array to get active medication in view
  activeMedication = [];
  // care team members list.
  careTeamMembers = [];
  // Selected CCD name
  selectedCCDName: any = '';
  // Variable to hide html before loading complete data
  ccdAllList = false;

  // Variables for loader
  isDataLoading: boolean;
  isDLEventLog: boolean;
  isDLMedication: boolean;
  isDLCareTeam: boolean;
  isDLQuestionnaires: boolean;
  isDLCareplan: boolean;
  isDLHealthStatus: boolean;
  noVitalDataMessage: string;
  isEpilepsyCarePlanFlag = false;
  // selectedCCD options
  selectedCCDOption: ICustomDropdownOptions = {
    data: null,
    optionValueName: 'id',
    optionTextName: 'filterBy'
  };
  showOpenAssessment = false;
  seizureDetails: ISeizureDetail[];
  seizureQuestion: ISeizureQuestionModel;

  constructor(private route: ActivatedRoute,
    private router: Router, private _participantDashboardService: ParticipantDashboardService,
    private _storage: LocalStorageService, private _modal: Modal,
    private _globalEventEmitterService: GlobalEventEmitterService,
    private _auditService: AuditService, private _breadcrumbService: BreadcrumbService, private _dateUtilityService: DateUtilityService) {
    /** This list is for dropdown to select days */
    this.dayWiseFilter = [
      { id: 'week', filterBy: 'Weekly view' },
      { id: 'month', filterBy: 'Monthly view' },
      { id: 'quarter', filterBy: '3 months' }
    ];
    /** This is for dropdown to CCD */
    this.ccdList = [
      { id: 'allergies', filterBy: 'Allergies' },
      { id: 'impairments', filterBy: 'Impairments' },
      { id: 'problems', filterBy: 'Problems' },
      { id: 'procedures', filterBy: 'Procedures' },
      { id: 'hospitalization_reason', filterBy: 'Hospitalizations' },
      { id: 'social_history', filterBy: 'Social History' },
      { id: 'visit_information', filterBy: 'Visit Information' }
    ];

    this.selectedCCDOption.data = this.ccdList;
    this._globalEventEmitterService.modalClosedObservable.subscribe(closed => {
      this.isOpenSymptomModalOpen = false;
    });
    this._globalEventEmitterService.updateMedicationList.subscribe(closed => {
      this.loadActionPlan();
    });
    this.progressBarTitle = 'Overall Compliance';
    this.proressTextColor = '';
    this.proressPerColor = '';
    this.participantId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const pId = params['id'];
      this.participantId = pId;
      this.updateCurrentParticipantData();
    });
  }

  // Clear Vital details from session on rendering page
  clearCurrentUserVital() {
    const isValue = this._storage.get('currentUserVital');
    if (isValue) {
      this._storage.remove('currentUserVital');
    }
  }

  // To load data before rendering page
  loadCurrentUserVital() {
    this.isDLHealthStatus = true;
    // Vital Data for carousel
    this.carouselData = [];
    this._participantDashboardService.getVitals(this.participantId).then(data => {
      console.log(data);
      console.log(data.careplan_vital_message);
      this._storage.set('currentUserVital', data);
      this.isDLHealthStatus = false;
      if (data.careplan_vital_message === undefined) {
        for (const i in data) {
          if (data[i]) {
            if (data[i].vital_desc === 'Activity') {

            } else {
              this.carouselData.push(data[i]);
            }
          }
        }
      } else {
        console.log('no vital data present');
        this.noVitalDataMessage = data.careplan_vital_message;
      }
    }, error => {
      this.isDLHealthStatus = false;
    });
  }
  loadActionPlan() {
    this._participantDashboardService.getActionPlanDetails(this.participantId).then(data => {
      this.actionPlanDetails = data;
    }, error => {
      this.isDLMedication = false;
    });
  }
  editActionPlanDetails(actionPlanDetals) {
    let t;
    this._modal.open(EmergencyActionPlanModalComponent,
      overlayConfigFactory({ submitBtnText: 'Save', edit: true, EmergencyActionPlanData: actionPlanDetals, participantId: this.participantId }, EmergencyActionPlanModalContext)).then(d => {
        t = d.result.then(data => {
          this.loadActionPlan();
        });
      });
  }
  // To load Medication data before rendering page
  loadMedication() {
    this.isDLMedication = true;
    // Vital Data for carousel
    this._participantDashboardService.getMedicationDetails(this.participantId).then(data => {
      this.isDLMedication = false;
      this.medicationDetails = data;
      this.activeMedication = data.active_medication;
      this.activeMedication.splice(3, this.activeMedication.length);
      this.status = this.medicationDetails.overall_compliance;
      this.value = this.medicationDetails.overall_compliance;
      // if critical
      if (this.medicationDetails.overall_compliance <= 80) {
        this.statusColor = 'bg-danger';
        this.proressPerColor = 'text-danger';

      } else if (this.medicationDetails.overall_compliance > 80 && this.medicationDetails.overall_compliance < 90) { // if alert
        this.statusColor = 'bg-alert';
        this.proressPerColor = 'text-warning';
        this.medicationDetails.medStatus = 2;
      } else if (this.medicationDetails.overall_compliance >= 90) { // if normal
        this.statusColor = 'bg-success';
        this.proressPerColor = 'text-navy';
        this.medicationDetails.medStatus = 0;
      }
      this.activeMedication.forEach(element => {
        if (element.medication_taken_percentage <= 80) {
          element.medStatus = 1;
          element.medStatusColor = 'border-danger';
        } else if (element.medication_taken_percentage > 80 && element.medication_taken_percentage < 90) {
          element.medStatus = 1;
          element.medStatusColor = 'border-alert';
        }
        if (element.medication_taken_percentage >= 90) {
          element.medStatus = 0;
          element.medStatusColor = 'border-normal';
        }
      });
    }, error => {
      this.isDLMedication = false;
    });
  }
  // To load te eventlog snapshot data
  loadEventlogSnapShotData() {
    this.isDLEventLog = true;
    this._participantDashboardService.getEventLogSnapshotData(this.participantId).then(data => {
      this.isDLEventLog = false;
      this.eventLogSnapshotDetails = [];
      this.eventLogSnapshotDetails = data.slice(0, 5);
      this.eventLogSnapshotDetails.forEach(element => {
        const tempEventArry = [];
        /**
      * Checking for event type = 'seizure events'
      * IF found then put color code = 'grey'. Handling it in UI to show the color
      */
        if (element.event_type === 'Seizure Events') {
          element.color_code = 2;
        }
        if (element.trigger_type_desc.length > 0) {
          tempEventArry.push(element.trigger_type_desc);
          element.trigger_type_desc = tempEventArry;
        }
      });
    }, error => {
      this.isDLEventLog = false;
    });
  }

  /** method will call after selecting dropdown of daywisefilter */
  getUpdatedData() {
    this._storage.set('timeLine', this.selectedTimeline);
    this._storage.set('currentVital', this.currentVital);
  }

  /** carousel click on card this method will trigger to get Vital Information */
  getVitalData(vital) {
    this.vitalName = vital.vital_desc;
    this.currentVital = vital.vitalType;
    if (vital.vitalType) {
      this._storage.set('vitalType', vital.vitalType);
    } else {
      this._storage.set('vitalType', 'LUNG');
    }

  }

  onPage() {
    this.getSelectedCCDInfo();
  }
  /** on selection of ccd from dropdown ,this method to call particular ccd service */
  getSelectedCCDInfo() {
    this.dataLoadingStarted();
    this.ccdAllList = false;
    this.latestCCDList = [];
    this._participantDashboardService.getLatestCCDDetails(this.selectedCCD, this.participantId).then(data => {
      this.dataLoadingCompleted();
      this.ccdForDetail = this.selectedCCD;
      if (this.selectedCCD === 'hospitalization_reason') {
        for (let i = 0; i < data.length; i++) {
          const num = data[i].reason.length;
          if (num <= 500) {
            data[i].changedReason = data[i].reason;
          } else {
            data[i].changedReason = data[i].reason.substring(0, 500);
          }
          data[i].statusColor = this.getCCDInfoStatusColor(data[i].status);
        }
        this.ccdAllList = true;
        this.latestCCDList = data;
      } else if (this.selectedCCD === 'allergies') {
        _.each(data, (allergies) => {
          const tempAllergyType = [];
          tempAllergyType.push(allergies.allergy_type);
          allergies.allergy_type = tempAllergyType;
          allergies.statusColor = this.getCCDInfoStatusColor(allergies.status);
        });
        this.ccdAllList = true;
        this.latestCCDList = data;
      } else {
        if (data.length) {
          _.each(data, (selectedCCD) => {
            selectedCCD.statusColor = this.getCCDInfoStatusColor(selectedCCD.status);
          });
        }
        this.ccdAllList = true;
        this.latestCCDList = data;
      }

    }, error => {
      this.dataLoadingCompleted();
    });
  }
  /** based on the line item staus, this method assigns color for the result */
  getCCDInfoStatusColor(input_status: string): string {
    if (input_status === 'Active') {
      return 'green';
    } else {
      return 'grey';
    }
  }

  /** to open Symptom Assesment Modal */
  openSymptomModal(input_data) {
    if (this.isOpenSymptomModalOpen) {
      return;
    };

    this.isOpenSymptomModalOpen = true;
    const value = input_data.value;
    if (input_data.vitalType === 'whbmi') {
      this._participantDashboardService.getCurrentVitalSymptomAssessment(this.participantId, 'WHBMI', input_data.whbmi_id).then(data => {
        data.vitalName = this.vitalName;
        data.value = value;
        this._modal.open(SymptomAssesmentModalComponent,
          overlayConfigFactory({ edit: false, symptomAssesmentData: { data: data } }, SymptomAssesmentModalContext));
      });
    } else {
      this._participantDashboardService.getCurrentVitalSymptomAssessment(
        this.participantId, input_data.vitalType, input_data.vital_id).then(data => {
          data.vitalName = this.vitalName;
          data.value = value;
          this._modal.open(SymptomAssesmentModalComponent,
            overlayConfigFactory({ edit: false, symptomAssesmentData: { data: data } }, SymptomAssesmentModalContext));
        });
    }
  }

  openMedicationModal() {
    let t;
    this._modal.open(AddMedicationModalComponent,
      overlayConfigFactory({ addMedicationPlan: false, medicationAssesmentData: this.participantId },
        AddMedicationModalContext)).then(d => {
          t = d.result.then(data => {
            this.loadMedication();
          });
        });
    const audit_obj = this.getDataForAuditLogs('medication');
    this.logViewActions(audit_obj);
  }

  openAddMedicationModal() {
    let t;
    this._modal.open(AddMedicationModalComponent,
      overlayConfigFactory({ addMedicationPlan: true, medicationAssesmentData: this.participantId }, AddMedicationModalContext)).then(d => {
        t = d.result.then(data => {
          this.loadMedication();
        });
      });
  }

  openEmergencyActionPlanModal() {
    let t;
    this._modal.open(EmergencyActionPlanModalComponent,
      overlayConfigFactory({ submitBtnText: 'Submit', edit: false, emergencyActionPlanPlan: true, participantId: this.participantId }, EmergencyActionPlanModalContext)).then(d => {
        t = d.result.then(data => {
          this.loadMedication();
        });
      });
  }


  /* getCarePlan method to call carePlan for Card display. ***
  Give priority for Active Careplans then Completed Careplan and apply filter to display total 3 care plan */
  getCarePlanList() {
    this.isDLCareplan = true;
    this._participantDashboardService.getListOfCarePlans(this.participantId).then(data => {
      this.isDLCareplan = false;
      this.listOfCarePlans = data;
      if (this.listOfCarePlans.active.length >= 3) {
        this.listOfCarePlans.active.splice(3, this.listOfCarePlans.active.length);
      } else if (this.listOfCarePlans.active.length === 1) {
        this.listOfCarePlans.completed.splice(2, this.listOfCarePlans.completed.length);
      } else if (this.listOfCarePlans.active.length === 2) {
        this.listOfCarePlans.completed.splice(1, this.listOfCarePlans.completed.length);
      } else {
        this.listOfCarePlans.completed.splice(3, this.listOfCarePlans.completed.length);
      }
    }, error => {
      this.isDLCareplan = false;
    });
  }
  getClass(status) {
    switch (status) {
      case 0: return 'green';
      case 1: return 'text-orange';
      case 2: return 'text-danger';
      case -1: return 'text-dark-grey';
    }
  }

  /** method to get care team members */
  getCareTeamMembers() {
    this.isDLCareTeam = true;
    this._participantDashboardService.getListOfCareTeamMembers(this.participantId).then(data => {
      this.isDLCareTeam = false;
      this.careTeamMembers = data;
      this.careTeamMembers.sort(function (name1, name2) {
        if (name1.staff_name < name2.staff_name) {
          return -1;
        } else if (name1.staff_name > name2.staff_name) {
          return 1;
        } else {
          return 0;
        }
      });
      // limiting the number of care team members to be shown to three
      this.careTeamMembers.splice(3, this.careTeamMembers.length);
      // Adding a key and value for name initials of the care team members.
      for (const careTeam in this.careTeamMembers) {
        if (this.careTeamMembers[careTeam]) {
          this.careTeamMembers[careTeam].name = this.careTeamMembers[careTeam].first_name + ' ' + this.careTeamMembers[careTeam].last_name;
          this.careTeamMembers[careTeam].staff_name_initials =
            this.careTeamMembers[careTeam].first_name.charAt(0) + this.careTeamMembers[careTeam].last_name.charAt(0);
        }
      }
    }, error => {
      this.isDLCareTeam = false;
    });
  }

  getDataForAuditLogs(code) {
    switch (code) {
      case 'medication': const medication_obj = Participant_Dashboard_Const.Medication;
        medication_obj.participantId = this.participantId;
        return medication_obj;
      case 'medical_records': const medical_records_obj = Participant_Dashboard_Const.Medical_Records;
        this.ccdName();
        medical_records_obj.participantId = this.participantId;
        medical_records_obj.screenId = this.selectedCCDName;
        return medical_records_obj;
      case 'care_team': const care_team_obj = Participant_Dashboard_Const.Care_Team;
        care_team_obj.participantId = this.participantId;
        return care_team_obj;
      case 'care_plans': const obj = Participant_Dashboard_Const.Care_Plan;
        obj.participantId = this.participantId;
        return obj;
    }
  }

  logViewActions(data) {
    this._auditService.logViewActions(data).then(res => {
    });
  }

  savelog(code) {
    const obj = this.getDataForAuditLogs(code);
    this.logViewActions(obj);
  }
  ccdName() {
    for (const obj of this.ccdList) {
      if (this.selectedCCD === obj.id) {
        this.selectedCCDName = obj.filterBy;
      }
    }
  }

  /** method to get assessments */
  getAssessments() {
    this.assessmentList = [];
    this.isDLQuestionnaires = true;

    // let pr = new Promise(res => {
    //   res([]);
    // });

    // const pr = new Promise((res, rej) => {
    //   res([]);
    // });



    Promise.all([
      //pr,
      this._participantDashboardService.getAssessmentList(this.participantId),
      this._participantDashboardService.getSeizureAssessmentList(this.participantId),
      this._participantDashboardService.getIsEpilepsyUser(this.participantId),
      this._participantDashboardService.getSeizureAssessmentQuestionList(this.participantId)
    ])
      .then(values => {
        this.isDLQuestionnaires = false;

        if (values[2].is_epilepsy) {
          this.seizureDetails = values[1];
          this.isEpilepsyCarePlanFlag = true;

          // //needs to comment
          //this.seizureDetails = {
          //   questions: values[1],
          //   reviewQuestionnaire: {
          //     isAvailable: true,
          //     assessmentStatus: 1,
          //   //  assessmentName: ''
          //   }
          // };

          // if (this.seizureDetails && this.seizureDetails.questions
          //   && this.seizureDetails.questions.length) {

          //   if (this.seizureDetails.reviewQuestionnaire && this.seizureDetails.reviewQuestionnaire.isAvailable) {

          //   }


          if (this.seizureDetails && this.seizureDetails.length) {
            const firstRow = this.seizureDetails[0];
            const isPendingStatus = firstRow.seizureDate !== null;
            
            if (isPendingStatus) {
              _.forEach(this.seizureDetails, val => {
                val.assessment_date = val.seizureDate;
              });
            }

            this.assessmentList.push({
              assessment_status: isPendingStatus ? 0 : 1,
              expiry_status: 0,
              assessment_name: 'Seizure Questionnaire'
            });
          }

          this.seizureQuestion = values[3];

          if (this.seizureQuestion && this.seizureQuestion.is_review_questions) {
            this.assessmentList.push({
              assessment_status: this.seizureQuestion.assessment_status,
              expiry_status: 0,
              assessment_name: this.seizureQuestion.assessment_name
            });
          }

        }

        this.assessmentList = this.assessmentList.concat(values[0]);

      }, errs => {

        this.isDLQuestionnaires = false;
      });
  }

  /** Method for question assessment
   *  Open Modal from the dashboard
   */
  openQuestionsAssessmentModal(assessmentId, participantName, assessmentName: string) {
    this.showOpenAssessment = true;

    if (!assessmentId) {
      const data: any[] = [];

      assessmentName = assessmentName || 'Seizure Questionnaire';
      const seizureDetailsMax = _.maxBy(this.seizureDetails, val => val.updated_date);

      data.push(<IAssessmentModalData>{
        seizureDetails: this.seizureDetails,
        isEpilepsy: true,
        assessment_name: assessmentName,
        participant_name: this.route.snapshot.params['participantName'],
        seizureQuestion: this.seizureQuestion,
        participantId: this.participantId,
        completed_date: seizureDetailsMax ? seizureDetailsMax.updated_date : null
      });

      this._modal.open(AssessmentDetailModalComponent,
        overlayConfigFactory({ edit: false, assessmentQuestionDetails: { data: data } }, AssessmentDetailModalContext));
      this.showOpenAssessment = false;

    } else {

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

  /** Update Current Page Data */
  updateCurrentParticipantData() {
    // storing participant name to display in breadcrumb
    this._storage.set('participantName', this.route.snapshot.params['participantName']);
    this.participantId = this.route.snapshot.params['id'];
    this._storage.set('participantId', this.participantId);
    let map = new Map<string, string>();
    let pageName = this.route.snapshot.params['viewName'];
    var participantName = this._storage.get('participantName');
    var participantId = this._storage.get('participantId');



    map.set('participantName', this.route.snapshot.params['participantName']);
    map.set('participantId', this.participantId);
    this._breadcrumbService.setBreadcrumbs('View Participant Component', map);

    /** calling to get first vital data, onload of page(for carousel and tabular view) */
    this.clearCurrentUserVital();
    this.loadCurrentUserVital();
    /** calling to get allergies leatest data, onload of page */
    this.getSelectedCCDInfo();

    // Get the list of care plans for the participant
    this.getCarePlanList();

    // get the list of care team members of the participant
    this.getCareTeamMembers();

    // get the list of medication of the participant
    this.loadMedication();

    // get the list of assessment of the participant
    this.getAssessments();

    // get the Details of eventlog snapshot data
    this.loadEventlogSnapShotData();
    // get load action plan detals
    this.loadActionPlan();
  }
}

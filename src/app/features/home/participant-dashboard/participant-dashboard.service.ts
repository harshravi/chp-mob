import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { environment } from '../../../../environments/environment';
import { HttpInterceptor } from './../../../config/HTTP';
import { VITALS_CONSTANTS } from '../../../constants/url-constants';
import { HeadersService } from '../../../constants/url-constants';
import { CARE_PLAN_CONSTANT } from '../../../constants/url-constants';
import { LoadingBarService } from './../../../components/core/loading-bar';
import { CommonUtil, IHttpServiceResponse } from '../../../utils/common.util';

@Injectable()
export class ParticipantDashboardService {

  getParticipantListHttp: IHttpServiceResponse<any>;
  options: any;

  constructor(private _storage: LocalStorageService,
    private _http: HttpInterceptor, private _headers: HeadersService, private _loadingBarService: LoadingBarService) {
    this.options = this._headers.getHeaders();
    this.getParticipantListHttp = CommonUtil.httpService(_http, _loadingBarService);
  }

  /**
      * Get participants details for physician
      */
  participantDetails(participant_id) {
    this._loadingBarService.start();
    const url = environment.URL + '/staff' + VITALS_CONSTANTS.PATIENTS_DETAIL + '/' + participant_id + '/';
    const result = this._http.get(url, this.options)
      .map(res => res.json())
      .toPromise()
      .then((data) => {
        this._loadingBarService.complete();
        return data;
      });
    return result;
  }
  /**
  * GETS the patient BMI information for a patient for graph.
  */
  patientFluidTimeline(participant_id, timeline) {
    const url = environment.URL + '/staff/vitals/' + participant_id + '/' + VITALS_CONSTANTS.FLUID_FOR_GRAPH + '/' + timeline;
    const result = this._http.get(url, this.options)
      .map(res => res.json())
      .toPromise()
      .then((data) => {
        return data;
      });
  }
  /**
  * GETS the Medication Adherence for participant(participant profile section)
  */
  participantMedicationAdherence(participant_id) {
    const url = environment.URL + '/staff' + VITALS_CONSTANTS.MEDICATION_ADHERENCE + '/' + participant_id + '/';
    const result = this._http.get(url, this.options)
      .map(res => res.json())
      .toPromise()
      .then((data) => {
        return data;
      });
    return result;
  }
  /**
  * GETS the condtions for participant(participant profile section)
  */
  participantProfileCondition(participant_id) {
    this._loadingBarService.start();
    const url = environment.URL + '/staff' + VITALS_CONSTANTS.PATIENT_PROFILE_CONDITION + '/' + participant_id + '/';
    const result = this._http.get(url, this.options)
      .map(res => res.json())
      .toPromise()
      .then((data) => {
        this._loadingBarService.complete();
        return data;
      });
    return result;
  }

  deleteDiagnosis(data) {
    this._loadingBarService.start();
    const url = environment.URL + '/staff' + VITALS_CONSTANTS.DELETE_PATIENT_PROFILE_CONDITION + '/';
    const result = this._http.post(url, data, this.options)
      .map(res => res.json())
      .toPromise()
      .then((res) => {
        this._loadingBarService.complete();
        return res;
      });
    return result;

  }

  addDiagnosis(data) {
    this._loadingBarService.start();
    const url = environment.URL + '/staff' + VITALS_CONSTANTS.PATIENT_PROFILE_CONDITION + '/';
    const result = this._http.post(url, data, this.options)
      .map(res => res.json())
      .toPromise()
      .then((res) => {
        this._loadingBarService.complete();
        return res;
      });
    return result;

  }

  /**
   * Get Vitals
   */
  getVitals(participant_id) {
    const url = environment.URL + '/staff' + VITALS_CONSTANTS.PATIENTS_VITALS + '/' + participant_id + '/';
    const result = this._http.get(url, this.options)
      .map(res => res.json())
      .toPromise()
      .then((data) => {
        return data;
      });
    return result;
  }
  /**
   * Get Vitals
   */
  getMedicationDetails(participant_id) {
    const url = environment.URL + '/staff' + CARE_PLAN_CONSTANT.GET_MEDICATION_DETAILS + '/' + participant_id + '/';
    const result = this._http.get(url, this.options)
      .map(res => res.json())
      .toPromise()
      .then((data) => {
        return data;
      });
    return result;
  }
  /**
   * get data for tabular view
   */
  getDataForTabularView(participant_id, timeline, vital_name) {
    if (vital_name === 'ACTIVITY') {
      const url = environment.URL + '/staff' + VITALS_CONSTANTS.TABULAR_VIEW_FOR_ACTIVITY + '/' + participant_id + '/' + timeline;
      const result = this._http.get(url, this.options)
        .map(res => res.json())
        .toPromise()
        .then((data) => {
          return data;
        });
      return result;
    } else if (vital_name === 'FLUID') {
      const url = environment.URL + '/staff/fluids/' + participant_id + '/' + timeline;
      const result = this._http.get(url, this.options)
        .map(res => res.json())
        .toPromise()
        .then((data) => {
          return data;
        });
      return result;
    } else if (vital_name === 'WHBMI') {
      const url = environment.URL + '/staff/whbmi/' + participant_id + '/' + timeline;
      const result = this._http.get(url, this.options)
        .map(res => res.json())
        .toPromise()
        .then((data) => {
          return data;
        });
      return result;
    } else {
      const url = environment.URL + '/staff' + VITALS_CONSTANTS.PATIENTS_VITAL + '/' + participant_id + '/' + vital_name + '/' + timeline;
      const result = this._http.get(url, this.options)
        .map(res => res.json())
        .toPromise()
        .then((data) => {
          return data;
        });
      return result;
    }

  }
  /**
   * get data for tabular view of Lungs
   */
  getTabularViewOfLungs(participant_id: string, firstDate: IMoment, lastDate: IMoment) {

    firstDate = CommonUtil.stripTime(firstDate);
    lastDate = CommonUtil.stripTime(lastDate);

    const url = environment.URL + '/staff' + VITALS_CONSTANTS.TABULAR_VIEW_FOR_LUNGS + '/' + participant_id + '/' + firstDate.format('x') + '/' + lastDate.format('x');
    this.getParticipantListHttp.call({ callType: 'get', url: url, data: null, options: this.options });

    return this.getParticipantListHttp.httpResponse$;

  }
  /**
   * get data for tabular view of Lungs
   */
  getTabularViewOfDevelopment(participant_id, firstDate, lastDate) {
    firstDate = CommonUtil.stripTime(firstDate);
    lastDate = CommonUtil.stripTime(lastDate);

    const url = environment.URL + '/staff' + VITALS_CONSTANTS.TABULAR_VIEW_FOR_DEVELOPMENT + '/' + participant_id + '/' + firstDate.format('x') + '/' + lastDate.format('x');
    this.getParticipantListHttp.call({ callType: 'get', url: url, data: null, options: this.options });

    return this.getParticipantListHttp.httpResponse$;
  }

  /**
 * delete data of Lungs
 */
  deleteLungsDetails(data) {
    this._loadingBarService.start();
    const url = environment.URL + '/staff' + VITALS_CONSTANTS.DELETE_LUNG_DETAILS + '/';
    const result = this._http.post(url, data, this.options)
      .map(res => res.json())
      .toPromise()
      .then((res) => {
        this._loadingBarService.complete();
        return res;
      });
    return result;
  }
  /**
 * delete data of development
 */
  deleteDevelopmentDetails(data) {
    this._loadingBarService.start();
    const url = environment.URL + '/staff' + VITALS_CONSTANTS.DELETE_DEVELOPMENT_DETAILS;
    const result = this._http.post(url, data, this.options)
      .map(res => res.json())
      .toPromise()
      .then((res) => {
        this._loadingBarService.complete();
        return res;
      });
    return result;
  }
  // Get lungs graph data
  getLungsGraphData(vital_type: string, participant_id: string, firstDate: IMoment, lastDate: IMoment): any {

    firstDate = CommonUtil.stripTime(firstDate);
    lastDate = CommonUtil.stripTime(lastDate);

    const url = environment.URL + '/staff' +
      VITALS_CONSTANTS.LUNGS_GRAPH_DATA + '/' + participant_id +
      '/' + vital_type + '/' + firstDate.format('x') + '/' + lastDate.format('x');

    this.getParticipantListHttp.call({ callType: 'get', url: url, data: null, options: this.options });
    return this.getParticipantListHttp.httpResponse$;
  }

  // Get Development graph data
  getDevelopmentGraphData(vital_type: string, participant_id: string, firstDate: IMoment, lastDate: IMoment) {
    this._loadingBarService.start();
    firstDate = CommonUtil.stripTime(firstDate);
    lastDate = CommonUtil.stripTime(lastDate);

    const url = environment.URL + '/staff' +
      VITALS_CONSTANTS.DEVELOPMENT_GRAPH_DATA + '/' + participant_id +
      '/' + vital_type + '/' + firstDate.format('x') + '/' + lastDate.format('x');
    const result = this._http.get(url, this.options)
      .map(res => res.json())
      .toPromise()
      .then((data) => {
        this._loadingBarService.start();
        return data;
      });
    return result;
  }
  // service for Graph
  /**
   * get Fluid Intake data for graph
   */
  getPatientsFluidDataForGraphStaff(participant_id, timeline) {
    this._loadingBarService.start();
    const queryString = '?graph=true';
    const url = environment.URL + '/staff' + VITALS_CONSTANTS.FLUID_FOR_GRAPH + '/' + participant_id + '/' + timeline + queryString;
    const result = this._http.get(url, this.options)
      .map(res => res.json())
      .toPromise()
      .then((data) => {
        this._loadingBarService.start();
        return data;
      });
    return result;
  }

  /**
* GETS the patient OTHER VITALS information for graph.
*/
  patientOtherVitalDetailsForGraph(participant_id, timeline, vital_name) {
    this._loadingBarService.start();
    const url = environment.URL + '/staff' + VITALS_CONSTANTS.PATIENTS_VITAL + '/' + participant_id + '/' + vital_name + '/' + timeline;
    const result = this._http.get(url, this.options)
      .map(res => res.json())
      .toPromise()
      .then((data) => {
        this._loadingBarService.start();
        return data;
      });
    return result;
  }
  /** method is to get latest ccd data  */
  getLatestCCDDetails(ccdName, participant_id) {
    this._loadingBarService.start();
    switch (ccdName) {
      case 'allergies': const allergy_url = environment.URL + '/staff' + VITALS_CONSTANTS.LATEST_ALLERGIES + '/' + participant_id;
        const allergy_result = this._http.get(allergy_url, this.options)
          .map(res => res.json())
          .toPromise()
          .then((data) => {
            this._loadingBarService.complete();
            return data;
          });
        return allergy_result;
      case 'visit_information': const visit_info_url =
        environment.URL + '/staff' + VITALS_CONSTANTS.LATEST_VISIT_INFO + '/' + participant_id;
        const visit_info_result = this._http.get(visit_info_url, this.options)
          .map(res => res.json())
          .toPromise()
          .then((data) => {
            this._loadingBarService.complete();
            return data;
          });
        return visit_info_result;
      case 'social_history': const social_history_url =
        environment.URL + '/staff' + VITALS_CONSTANTS.LATEST_SOCIAL_HISTORY + '/' + participant_id;
        const social_history_result = this._http.get(social_history_url, this.options)
          .map(res => res.json())
          .toPromise()
          .then((data) => {
            this._loadingBarService.complete();
            return data;
          });
        return social_history_result;
      case 'impairments': const impairment_url = environment.URL + '/staff' + VITALS_CONSTANTS.LATEST_IMPAIRMENTS + '/' + participant_id;
        const impairment_result = this._http.get(impairment_url, this.options)
          .map(res => res.json())
          .toPromise()
          .then((data) => {
            this._loadingBarService.complete();
            return data;
          });
        return impairment_result;
      case 'hospitalization_reason': const hospitalization_reason_url =
        environment.URL + '/staff' + VITALS_CONSTANTS.LETEST_HOSPITALIZATION_REASON + '/' + participant_id;
        const hospitalization_reason_result = this._http.get(hospitalization_reason_url, this.options)
          .map(res => res.json())
          .toPromise()
          .then((data) => {
            this._loadingBarService.complete();
            return data;
          });
        return hospitalization_reason_result;
      case 'procedures': const procedures_url = environment.URL + '/staff' + VITALS_CONSTANTS.LATEST_PROCEDURES + '/' + participant_id;
        const procedures_result = this._http.get(procedures_url, this.options)
          .map(res => res.json())
          .toPromise()
          .then((data) => {
            this._loadingBarService.complete();
            return data;
          });
        return procedures_result;
      case 'problems': const url = environment.URL + '/staff' + VITALS_CONSTANTS.LATEST_PROBLEMS + '/' + participant_id;
        const result = this._http.get(url, this.options)
          .map(res => res.json())
          .toPromise()
          .then((data) => {
            this._loadingBarService.complete();
            return data;
          });
        return result;
    }
  }
  /** method is to get latest ccd data  */
  getCCDAllDetails(ccdName, participant_id, status) {
    this._loadingBarService.start();
    switch (ccdName) {
      case 'allergies': const allergies_url =
        environment.URL + '/staff' + VITALS_CONSTANTS.ALL_ALLERGIES + '/' + participant_id + '/' + status;
        const allergies_result = this._http.get(allergies_url, this.options)
          .map(res => res.json())
          .toPromise()
          .then((data) => {
            this._loadingBarService.complete();
            return data;
          });
        return allergies_result;
      case 'visit_information': const visit_information_url =
        environment.URL + '/staff' + VITALS_CONSTANTS.ALL_VISIT_INFO + '/' + participant_id;
        const visit_information_result = this._http.get(visit_information_url, this.options)
          .map(res => res.json())
          .toPromise()
          .then((data) => {
            this._loadingBarService.complete();
            return data;
          });
        return visit_information_result;
      case 'social_history': const social_history_url =
        environment.URL + '/staff' + VITALS_CONSTANTS.ALL_SOCIAL_HISTORY_OF_PARTICIPANT + '/' + participant_id + '/' + status;
        const social_history_result = this._http.get(social_history_url, this.options)
          .map(res => res.json())
          .toPromise()
          .then((data) => {
            this._loadingBarService.complete();
            return data;
          });
        return social_history_result;
      case 'impairments': const impairments_url =
        environment.URL + '/staff' + VITALS_CONSTANTS.ALL_PARTICIPANTS_IMPAIRMENTS + '/' + participant_id + '/' + status;
        const impairments_result = this._http.get(impairments_url, this.options)
          .map(res => res.json())
          .toPromise()
          .then((data) => {
            this._loadingBarService.complete();
            return data;
          });
        return impairments_result;
      case 'hospitalization_reason': const hospitalization_reason_url =
        environment.URL + '/staff' + VITALS_CONSTANTS.ALL_HOSPITALIZATION_REASON + '/' + participant_id + '/' + status;
        const hospitalization_reason_result = this._http.get(hospitalization_reason_url, this.options)
          .map(res => res.json())
          .toPromise()
          .then((data) => {
            this._loadingBarService.complete();
            return data;
          });
        return hospitalization_reason_result;
      case 'procedures': const procedures_url =
        environment.URL + '/staff' + VITALS_CONSTANTS.ALL_PROCEDURE + '/' + participant_id + '/' + status;
        const procedures_result = this._http.get(procedures_url, this.options)
          .map(res => res.json())
          .toPromise()
          .then((data) => {
            this._loadingBarService.complete();
            return data;
          });
        return procedures_result;
      case 'problems': const url = environment.URL + '/staff' + VITALS_CONSTANTS.ALL_PROBLEMS + '/' + participant_id + '/' + status;
        const result = this._http.get(url, this.options)
          .map(res => res.json())
          .toPromise()
          .then((data) => {
            this._loadingBarService.complete();
            return data;
          });
        return result;
    }
  }

  // active or inactive ccd,onclick show duplicates
  activeOrInactiveParticipantCCD(ccdName, participant_id, data, status) {
    switch (ccdName) {
      case 'allergies': const allergies_url = environment.URL + '/staff' +
        VITALS_CONSTANTS.ACTIVE_OR_INACTIVE_ALLERGY + '/' + participant_id + '/' + data.allergyId + '/' + status;
        const allergies_result = this._http.post(allergies_url, {}, this.options)
          .map(res => res.json())
          .toPromise()
          .then((res) => {
            return res;
          });
        return allergies_result;
      case 'social_history': const social_history_url = environment.URL + '/staff' +
        VITALS_CONSTANTS.ACTIVE_OR_INACTIVE_SOCIAL_HISTORY + '/' + participant_id + '/' + data.socialhistoryId + '/' + status;
        const social_history_result = this._http.post(social_history_url, {}, this.options)
          .map(res => res.json())
          .toPromise()
          .then((res) => {
            return res;
          });
        return social_history_result;
      case 'impairments': const impairments_url = environment.URL + '/staff' +
        VITALS_CONSTANTS.ACTIVE_OR_INACTIVE_IMPAIRMENTS + '/' + participant_id + '/' + data.impairmentId + '/' + status;
        const impairments_result = this._http.post(impairments_url, {}, this.options)
          .map(res => res.json())
          .toPromise()
          .then((res) => {
            return res;
          });
        return impairments_result;
      case 'hospitalization_reason': const hospitalization_reason_url =
        environment.URL + '/staff' + VITALS_CONSTANTS.ALL_HOSPITALIZATION_REASON + '/' + participant_id + '/' + status;
        const hospitalization_reason_result = this._http.post(hospitalization_reason_url, {}, this.options)
          .map(res => res.json())
          .toPromise()
          .then((res) => {
            return res;
          });
        return hospitalization_reason_result;
      case 'procedures': const procedures_url =
        environment.URL + '/staff' + VITALS_CONSTANTS.ALL_PROCEDURE + '/' + participant_id + '/' + status;
        const procedures_result = this._http.post(procedures_url, {}, this.options)
          .map(res => res.json())
          .toPromise()
          .then((res) => {
            return res;
          });
        return procedures_result;
      case 'problems': const problems_url = environment.URL + '/staff' +
        VITALS_CONSTANTS.ACTIVE_OR_INACTIVE_PROBLEM + '/' + participant_id + '/' + data.problemId + '/' + status;
        const problems_result = this._http.post(problems_url, {}, this.options)
          .map(res => res.json())
          .toPromise()
          .then((res) => {
            return res;
          });
        return problems_result;
    }
  }

  /** Get Symptom Assesment data to show on modal */
  getCurrentVitalSymptomAssessment(participant_id, vitalType, id) {
    const url = environment.URL + '/staff' + VITALS_CONSTANTS.CURRENT_VITAL_ASSESSMENT + '/' + participant_id + '/' + vitalType + '/' + id;
    const result = this._http.get(url, this.options)
      .map(res => res.json())
      .toPromise()
      .then((data) => {
        return data;
      });
    return result;
  }

  // Get the list of careplans associated with a participant
  getListOfCarePlans(participantId) {
    const result = this._http.get(environment.URL + VITALS_CONSTANTS.GET_LIST_OF_CAREPLANS + '/' + participantId, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        return data;
      });
    return result;
  }

  getListOfCareTeamMembers(participantId) {
    const result = this._http.get(environment.URL + VITALS_CONSTANTS.GET_LIST_OF_CARETEAMMEMBERS + '/' + participantId, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        return data;
      });
    return result;
  }

  getParticipantCareplanCompliance(participantId) {
    const result = this._http.get(environment.URL +
      VITALS_CONSTANTS.GET_PARTICIPANT_CAREPLAN_COMPLIANCE + '/' + participantId, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        return data;
      });
    return result;
  }

  getCarePlanOfParticipant(participantId) {
    this._loadingBarService.start();
    const result = this._http.get(environment.URL +
      VITALS_CONSTANTS.GET_LIST_OF_CAREPLANS_OF_PARTICIPANT + '/' + participantId, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
    return result;
  }

  // get assessment list
  getAssessmentList(participantId) {
    this._loadingBarService.start();
    const result = this._http.get(environment.URL +
      VITALS_CONSTANTS.GET_LIST_OF_ASSESSMENT + '/' + participantId, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
    return result;
  }

  // get assessment list
  getSeizureAssessmentList(participantId) {
    this._loadingBarService.start();
    const result = this._http.get(environment.URL +
      VITALS_CONSTANTS.GET_LIST_OF_SEIZURE_ASSESSMENT + '/' + participantId, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
    return result;
  }

  getReviewSeizureQuestionnaireData(participantId: string) {
    this._loadingBarService.start();
    const result = this._http.get(environment.URL +
      VITALS_CONSTANTS.GET_REVIEW_SEIZURE_QUESTIONNAIRE_DATA + '/' + participantId, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
    return result;
  }

  getSeizureAssessmentQuestionList(participantId: string) {
    this._loadingBarService.start();
    const result = this._http.get(environment.URL +
      VITALS_CONSTANTS.GET_LIST_OF_SEIZURE_ASSESSMENT_QUESTION + '/' + participantId, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
    return result;
  }

  getIsEpilepsyUser(participantId) {
    this._loadingBarService.start();
    const result = this._http.get(environment.URL +
      VITALS_CONSTANTS.GET_IS_EPILEPSY_USER + '/' + participantId, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
    return result;
  }

  /** Get event log sanpshot details */
  getEventLogSnapshotData(participantId) {
    const result = this._http.get(environment.URL +
      VITALS_CONSTANTS.GET_EVENT_LOG_SNAPSHOT + '/' + participantId, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        return data;
      });
    return result;
  }

  // get questions of assessment
  getQuestionsOfAssessment(participantId, assessmentId) {
    this._loadingBarService.start();
    const result = this._http.get(environment.URL +
      VITALS_CONSTANTS.GET_QUESTIONS_OF_ASSESSMENT + '/' + participantId + '/' + assessmentId, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
    return result;
  }
  // get action plan details
  getActionPlanDetails(participantId) {
    this._loadingBarService.start();
    const result = this._http.get(environment.URL +
      VITALS_CONSTANTS.VIEW_ACTION_PLAN_DETAILS + '/' + participantId, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
    return result;
  }
  // get Participants Unread Task Count
  getParticipantUnreadTaskCount(participantId) {
    this._loadingBarService.start();
    const result = this._http.get(environment.URL +
      VITALS_CONSTANTS.GET_PARTICIPANT_UNREAD_TASK + '/' + participantId, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
    return result;
  }
}

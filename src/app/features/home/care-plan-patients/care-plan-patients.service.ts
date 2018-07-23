import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/Rx';
import { LoadingBarService } from './../../../components/core/loading-bar';

import { environment as ENV } from '../../../../environments/environment';
import { CARE_PLAN_CONSTANT } from '../../../constants/url-constants';
import { HeadersService } from '../../../constants/url-constants';

@Injectable()
export class CarePlanPatientsService {

  options: any;

  constructor(private _http: Http, private _headers: HeadersService, private _loadingBarService: LoadingBarService) {
    this.options = this._headers.getHeaders();
  }
  // calling service for list of patients
  getCarePlanPatientsDetails(programId) {
    return this._http.get(ENV.URL + CARE_PLAN_CONSTANT.PATIENT_BUCKETS_DETAILS + '/' + programId, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        return data;
      });
  }
  // calling service for list of patients based on selected filter
  patientsDetailsWithFilter(programId, enrollStatus, riskStatus) {
    return this._http.get(ENV.URL + CARE_PLAN_CONSTANT.PATIENT_BUCKETS_DETAILS + '/' + programId + '?enrollStatus=' +
      enrollStatus + '&' + 'criticalityStatus=' + riskStatus, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        return data;
      });
  };
  // calling service for enroll patients to careplan
  enrolledParticipant(data) {
    this._loadingBarService.start();
    const result = this._http.post(ENV.URL + CARE_PLAN_CONSTANT.ENROLLED_PARTICIPANT, data, this.options)
      .map(res => res.json())
      .toPromise()
      .then(res => {
        this._loadingBarService.complete();
        return res;
      });
    return result;
  };

  // To get invited patient patientsDetailsWithFilter
  getInvitedPatientDetails(emailId, programId_ref_num) {
    this._loadingBarService.start();
    const result = this._http.get(ENV.URL + CARE_PLAN_CONSTANT.GET_INVITED_PATIENT_DETAILS + '/' + emailId +
      '/' + programId_ref_num, this.options)
      .map(res => res.json())
      .toPromise()
      .then(res => {
        this._loadingBarService.complete();
        return res;
      });
    return result;
  }
}

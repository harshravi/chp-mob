import { Injectable } from '@angular/core';
import { HeadersService } from '../../../../constants/url-constants';
import { HttpInterceptor } from '../../../../config/HTTP';
import { DASHBOARD_CONSTANT } from '../../../../constants/url-constants';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class InterventionService {

  options: object;
  constructor(private _http: HttpInterceptor, private _headers: HeadersService) {
    this.options = this._headers.getHeaders();
  }

  // Get Vital task based on participant id
  getVitalTasks(participant_id) {
    const url = environment.URL + DASHBOARD_CONSTANT.GET_VITAL_TASKS + '/' + participant_id;
    const result = this._http.get(url, this.options)
      .map(res => res.json())
      .toPromise()
      .then((data) => {
        return data;
      });
    return result;
  }

  /** Get Intervention List for Dropdown */
  getInterventionList(data) {
    const url = environment.URL + DASHBOARD_CONSTANT.GET_INTERVENTION_LIST + '/vital';
    const result = this._http.post(url, data, this.options)
      .map(res => res.json())
      .toPromise()
      .then(res => {
        return res;
      });
    return result;
  }

  getInterventionListForSiezure(data){
     const url = environment.URL + DASHBOARD_CONSTANT.GET_INTERVENTION_LIST + '/seizure';
    const result = this._http.post(url, data, this.options)
      .map(res => res.json())
      .toPromise()
      .then(res => {
        return res;
      });
    return result;
  }

  /** Get Compliance List for dropdown */
  getInterventionLisForCompliance(data) {
    const url = environment.URL + DASHBOARD_CONSTANT.GET_INTERVENTION_LIST + '/compliance';
    const result = this._http.post(url, data, this.options)
      .map(res => res.json())
      .toPromise()
      .then(res => {
        return res;
      });
    return result;
  }

  /** Save Log Intervention for vitals */
  saveInterventionLogDetails(data) {
    const url = environment.URL + DASHBOARD_CONSTANT.SAVE_INTERVENTION_LOG_DETAILS;
    const result = this._http.post(url, data, this.options)
      .map(res => res.json())
      .toPromise()
      .then(res => {
        return res;
      });
    return result;
  }

  updateReadFlagForTasks(participant_id) {
    const url = environment.URL + DASHBOARD_CONSTANT.UPDATE_READ_TASK_FLAG + '/' + participant_id;
    const result = this._http.post(url, {}, this.options)
      .map(res => res.json())
      .toPromise()
      .then(res => {
        return res;
      });
    return result;
  }

}

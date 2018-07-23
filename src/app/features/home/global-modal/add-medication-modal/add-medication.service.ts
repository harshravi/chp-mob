import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/Rx';

import { environment as ENV } from '../../../../../environments/environment';
import { CARE_PLAN_CONSTANT } from '../../../../constants/url-constants';
import { HeadersService } from '../../../../constants/url-constants';
import { HttpInterceptor } from './../../../../config/HTTP';
import { LoadingBarService } from './../../../../components/core/loading-bar';


@Injectable()
export class AddMedicationService {

  options: any;

  constructor(private _http: HttpInterceptor,private _headers: HeadersService, private _loadingBarService: LoadingBarService) { 
    this.options = this._headers.getHeaders();
  }
  /** Get the values for the Global Settings from the Backend */
  getActivePastMedication(participantId) {
    // Let options = new RequestOptions({ withCredentials: true });
    this._loadingBarService.start();
    return this._http.get(ENV.URL +  CARE_PLAN_CONSTANT.GET_ACTIVE_PAST_MEDICATION_DETAILS + '/' + participantId + '/', this.options)
    // let options = new RequestOptions({ withCredentials: true });

      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
  }

  /** Get the values for the seached drug */
  getSearchedDrug(drugName) {
    this._loadingBarService.start();
    return this._http.get(ENV.URL +  CARE_PLAN_CONSTANT.GET_SEARCHED_MEDICATION + '?'+'drug_name=' + drugName , this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
  }
  // To add new medication
  addMedication(addMedicationData: Object) {
    const options = new RequestOptions({ withCredentials: true });
    this._loadingBarService.start();
    return this._http.post(ENV.URL + CARE_PLAN_CONSTANT.ADD_MEDICATION, addMedicationData, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      }, error => {
        this._loadingBarService.complete();
        return JSON.parse(error._body);
      });
  }
  // To edit medication details
  editMedication(editMedicationData: Object) {
    const options = new RequestOptions({ withCredentials: true });
    this._loadingBarService.start();
    return this._http.post(ENV.URL + CARE_PLAN_CONSTANT.EDIT_MEDICATION, editMedicationData, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      }, error => {
        this._loadingBarService.complete();
        return JSON.parse(error._body);
      });
  }

}

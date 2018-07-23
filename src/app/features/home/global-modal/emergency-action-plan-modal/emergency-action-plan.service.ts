import { Injectable } from '@angular/core';
import { HeadersService } from '../../../../constants/url-constants';
import { LoadingBarService } from './../../../../components/core/loading-bar';
import { environment } from '../../../../../environments/environment';
import { HttpInterceptor } from '../../../../config/HTTP';
import { VITALS_CONSTANTS } from '../../../../constants/url-constants';

@Injectable()
export class EmergencyActionPlanService {

    options: any;

    constructor(private _http: HttpInterceptor, private _headers: HeadersService, private _loadingBarService: LoadingBarService) {
        this.options = this._headers.getHeaders();
    }
    
    // to get details for the form dropdown in emergency action plan modal
    getActionPlanFormData() {
        const url = environment.URL + VITALS_CONSTANTS.ACTION_PLAN_FORM;
        this._loadingBarService.start();

        return this._http.get(url, this.options)
            .map(res => res.json())
            .toPromise()
            .then((data) => {
                this._loadingBarService.complete();
                return data;
            }, error => {
                this._loadingBarService.complete();
                return JSON.parse(error._body);
            });
    }

    // to get all the drug name with search
    getActionPlanDrugNameData(drugName) {
        const url = environment.URL + VITALS_CONSTANTS.ACTION_PLAN_DRUG_NAME + '?'+'drug_name=' + drugName;
        this._loadingBarService.start();

        return this._http.get(url, this.options)
            .map(res => res.json())
            .toPromise()
            .then((data) => {
                this._loadingBarService.complete();
                return data;
            }, error => {
                this._loadingBarService.complete();
                return JSON.parse(error._body);
            });
    }    
    // to add action plan
  addActionPlan(actionPlanData: object) {
    const url = environment.URL + VITALS_CONSTANTS.ADD_ACTION_PLAN;
    this._loadingBarService.start();
    return this._http.post(url, actionPlanData, this.options)
      .map(res => res.json())
      .toPromise()
      .then((data) => {
        this._loadingBarService.complete();
        return data;
      }, error => {
        this._loadingBarService.complete();
        return JSON.parse(error._body);
      });
  }   
  // to edit action plan
  updateActionPlan(actionPlanData: object) {
    const url = environment.URL + VITALS_CONSTANTS.UPDATE_ACTION_PLAN;
    this._loadingBarService.start();
    return this._http.post(url, actionPlanData, this.options)
      .map(res => res.json())
      .toPromise()
      .then((data) => {
        this._loadingBarService.complete();
        return data;
      }, error => {
        this._loadingBarService.complete();
        return JSON.parse(error._body);
      });
  }   
}  
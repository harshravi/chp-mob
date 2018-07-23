import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { DASHBOARD_CONSTANT } from '../../constants/url-constants/dashboard-url-constants';
import { HeadersService } from '../../constants/url-constants/http-headers-constants';
import { environment } from '../../../environments/environment';
import { HttpInterceptor } from './../../config/HTTP';

@Injectable()
export class HeaderTaskService {
  options: any;

  constructor(private _http: HttpInterceptor, private _headers: HeadersService) {
    this.options = this._headers.getHeaders();
  }

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

}

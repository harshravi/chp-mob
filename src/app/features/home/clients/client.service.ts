import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/Rx';

import { environment as ENV } from '../../../../environments/environment';
import { CLIENT_CONSTANT } from '../../../constants/url-constants';
import { HttpInterceptor } from './../../../config/HTTP';
import { LoadingBarService } from './../../../components/core/loading-bar';

@Injectable()
export class ClientService {

  constructor(private _http: HttpInterceptor, private _loadingBarService: LoadingBarService) { }

  genericGet(params) {
    const options = new RequestOptions({ withCredentials: true });
    this._loadingBarService.start();
    return this._http.get(ENV.URL + CLIENT_CONSTANT.GET_ALL_FACILITY_DETAILS + params, options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
  }

  getClientList(params: number) {
    return this.genericGet(params);
  }

  getInactiveClients(params: number) {
    return this.genericGet(params);
  }

  getModuleData() {
    const options = new RequestOptions({ withCredentials: true });

    return this._http.get(ENV.URL + CLIENT_CONSTANT.GET_MODULE_LIST, options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        return data;
      });
  }

  /** Method to create Clients */
  createClient(ClientObj: Object) {
    const options = new RequestOptions({ withCredentials: true });
    return this._http.post(ENV.URL + CLIENT_CONSTANT.CREATE_FACILITY, ClientObj, options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        return data;
      });
  }

  updateClient(ClientObj: Object) {
    const options = new RequestOptions({ withCredentials: true });
    return this._http.post(ENV.URL + CLIENT_CONSTANT.EDIT_FACILITY, ClientObj, options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        return data;
      });
  }

  /** Get Client Details */
  getClientDetails(facilityId: string) {
    const options = new RequestOptions({ withCredentials: true });

    return this._http.get(ENV.URL + CLIENT_CONSTANT.GET_FACILITY_DETAILS + facilityId, options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        return data;
      });
  }

  /** Approve or Reject or Enable or Disable */
  setOrChangeStatus(data) {
    const url = this.getUrlForStatus(data.status);
    const options = new RequestOptions({ withCredentials: true });
    const obj = { facility_id: data.facility_id };
    return this._http.post(url, obj, options)
      .map(res => res.json())
      .toPromise()
      .then(res => {
        return res;
      });
  }

  /** Get Url for Approve / Reject / Enable / Disable */
  getUrlForStatus(data) {
    switch (data) {
      case 'Approve': return ENV.URL + CLIENT_CONSTANT.APPROVE_CLIENT;
      case 'Reject': return ENV.URL + CLIENT_CONSTANT.REJECT_CLIENT;
      case 'Enable': return ENV.URL + CLIENT_CONSTANT.ENABLE_CLIENT;
      case 'Disable': return ENV.URL + CLIENT_CONSTANT.DISABLE_CLIENT;
    }
  }
}

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/Rx';

import { environment as ENV } from '../../../../environments/environment';
import { ACCESS_MANAGEMENT } from '../../../constants/url-constants';
import { HeadersService } from '../../../constants/url-constants';
import { HttpInterceptor } from './../../../config/HTTP';
import { LoadingBarService } from './../../../components/core/loading-bar';

@Injectable()
export class AccessManagementService {

  options: any;

  constructor(private _http: HttpInterceptor, private _headers: HeadersService, private _loadingBarService: LoadingBarService) {
    this.options = this._headers.getHeaders();
  }

  getRoleListData() {
    // let options = new RequestOptions({ withCredentials: true });
    this._loadingBarService.start();

    return this._http.get(ENV.URL + ACCESS_MANAGEMENT.LIST_ROLES, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
  }

  getRolePrivilegeMapping(param) {
    // let options = new RequestOptions({ withCredentials: true });
    this._loadingBarService.start();
    return this._http.get(ENV.URL + ACCESS_MANAGEMENT.GET_ROLE_PRIVILEGES + param, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
  }

  saveRolePrvilegesMapping(listOfRolePrivileges) {
    // let options = new RequestOptions({ withCredentials: true });
    this._loadingBarService.start();
    return this._http.post(ENV.URL + ACCESS_MANAGEMENT.SAVE_ROLE_PRIVILEGES, listOfRolePrivileges, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      }, error => {
        error = JSON.parse(error._body);
        this._loadingBarService.complete();
        return error;
      });
  }

}

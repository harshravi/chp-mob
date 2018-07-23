import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/Rx';

import { environment as ENV } from '../../../../../environments/environment';
import { ADD_ROLE_CONSTANT } from '../../../../constants/url-constants';
import { HeadersService } from '../../../../constants/url-constants';
import { HttpInterceptor } from './../../../../config/HTTP';
import { LoadingBarService } from './../../../../components/core/loading-bar';

@Injectable()
export class AddRoleService {

  options: any;

  constructor(private _http: HttpInterceptor, private _headers: HeadersService, private _loadingBarService: LoadingBarService) {
    this.options = this._headers.getHeaders();
  }

  /** Get the values for the Global Settings from the Backend */
  getRoleList() {
    // let options = new RequestOptions({ withCredentials: true });
    this._loadingBarService.start();
    return this._http.get(ENV.URL + ADD_ROLE_CONSTANT.LIST_ROLE, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
  }

  saveRoleAndDescription(roleData: Object) {
    // let options = new RequestOptions({ withCredentials: true });
    this._loadingBarService.start();
    return this._http.post(ENV.URL + ADD_ROLE_CONSTANT.ADD_ROLE, roleData, this.options)
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

  // editing a role.
  editRoleAndDescription(roleData: Object) {
    // let options = new RequestOptions({ withCredentials: true });
    this._loadingBarService.start();
    return this._http.post(ENV.URL + ADD_ROLE_CONSTANT.EDIT_ROLE, roleData, this.options)
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

  // deleting a role
  deleteRoleAndDescription(roleData: Object) {

    //  let options = new RequestOptions({ withCredentials: true });
    this._loadingBarService.start();
    return this._http.post(ENV.URL + ADD_ROLE_CONSTANT.DELETE_ROLE, roleData, this.options)
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

  // Role replacement to confirm deletion of a role.
  // Role replacement happens for the users associted to the deleted role
  confirmDeletionAndRoleReplacement(replacementData: Object) {
    //  let options = new RequestOptions({ withCredentials: true });
    this._loadingBarService.start();
    return this._http.post(ENV.URL + ADD_ROLE_CONSTANT.REPLACE_ROLE, replacementData, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
  }

  /** Get the values for the Global Settings from the Backend */
  getListOfRoleTypes() {
    // let options = new RequestOptions({ withCredentials: true });
    this._loadingBarService.start();
    return this._http.get(ENV.URL + ADD_ROLE_CONSTANT.LIST_TYPE_OF_ROLES, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
  }

}

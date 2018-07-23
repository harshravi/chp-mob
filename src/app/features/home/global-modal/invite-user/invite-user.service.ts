import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/Rx';

import { environment as ENV } from '../../../../../environments/environment';
import { INVITE_USER_CONSTANT } from '../../../../constants/url-constants';
import { HeadersService } from '../../../../constants/url-constants';
import { HttpInterceptor } from './../../../../config/HTTP';
import { LoadingBarService } from './../../../../components/core/loading-bar';
import { IRoleListType } from './model/role-list.model';
import { IInvitationUser } from './model/invitation-user.model';

@Injectable()
export class InviteUserService {

  options: any;

  constructor(private _http: HttpInterceptor, private _headers: HeadersService, private _loadingBarService: LoadingBarService) {
    this.options = this._headers.getHeaders();
  }

  /** Get the values for the Global Settings from the Backend */
  getRoleList(): Promise<IRoleListType> {
    // let options = new RequestOptions({ withCredentials: true });
    this._loadingBarService.start();
    return this._http.get(ENV.URL + INVITE_USER_CONSTANT.LIST_ROLE, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
  }

  sendInvitationToUser(invitationData: IInvitationUser[]) {
    // let options = new RequestOptions({ withCredentials: true });
    this._loadingBarService.start();
    return this._http.post(ENV.URL + INVITE_USER_CONSTANT.INVITE_USER, invitationData, this.options)
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

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/Rx';

import { environment as ENV } from '../../../../environments/environment';
import { CARE_PLAN_CONSTANT } from '../../../constants/url-constants';
import { HeadersService } from '../../../constants/url-constants';
import { HttpInterceptor } from './../../../config/HTTP';
import { LoadingBarService } from './../../../components/core/loading-bar';

@Injectable()
export class CarePlanDetailsService {

  options: any;

  constructor(private _http: HttpInterceptor, private _headers: HeadersService, private _loadingBarService: LoadingBarService) {
    this.options = this._headers.getHeaders();
  }

  // fetch the details of a particular care plan.
  getCarePlanDetails(programId) {
    this._loadingBarService.start();
    return this._http.get(ENV.URL + CARE_PLAN_CONSTANT.CARE_PLAN_DETAILS + '/' + programId, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
   }

   // send invitations to the users for a specific careplan.
   // bulk invites can be send.
   sendCarePlanInvites(inviteObj: Object) {
     this._loadingBarService.start();
     return this._http.post(ENV.URL + CARE_PLAN_CONSTANT.SEND_CARE_PLAN_INVITES, inviteObj, this.options)
     .map(res => res.json())
     .toPromise()
     .then(data => {
       this._loadingBarService.complete();
       return data;
     });
   }

   updateCarePlanInvites(inviteObj: Object) {
     this._loadingBarService.start();
     return this._http.post(ENV.URL + CARE_PLAN_CONSTANT.UPDATE_CAREPLAN_INVITE, inviteObj, this.options)
     .map(res => res.json())
     .toPromise()
     .then(data => {
       this._loadingBarService.complete();
       return data;
     });
   }
}

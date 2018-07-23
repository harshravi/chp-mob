import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/Rx';

import { environment as ENV } from '../../../../environments/environment';
import { CARE_PLAN_CONSTANT } from '../../../constants/url-constants';
import { HeadersService } from '../../../constants/url-constants';
import { HttpInterceptor } from './../../../config/HTTP';
import { LoadingBarService } from './../../../components/core/loading-bar';

@Injectable()
export class CarePlanService {

  options: any;

  constructor(private _http: HttpInterceptor, private _headers: HeadersService, private _loadingBarService: LoadingBarService) {
    this.options = this._headers.getHeaders();
  }
  // service to fetch the list of all the care plans.
  getCarePlans() {
    this._loadingBarService.start();
    return this._http.get(ENV.URL + CARE_PLAN_CONSTANT.VIEW_CARE_PLANS, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
  }
}

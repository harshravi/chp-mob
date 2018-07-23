import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpInterceptor } from './../../config/HTTP';
import { LoadingBarService } from './../../components/core/loading-bar';
import { HeadersService } from '../../constants/url-constants';
import { AUDIT_CONSTANT } from '../../constants/url-constants';
import { environment } from '../../../environments/environment';


@Injectable()
export class AuditService {
  options: any;

  constructor(private _loadingBarService: LoadingBarService, private _http: HttpInterceptor, private _headers: HeadersService) {
    this.options = this._headers.getHeaders();
  }

  logViewActions(data) {
    const url = environment.URL + AUDIT_CONSTANT.LOG_VIEW_ACTIONS;
    const result = this._http.post(url, data, this.options)
      .toPromise()
      .then(res => {
        return res;
      }, (res_error) => {
        const error = res_error.json();
        return error;
      });
    return result;
  }

}

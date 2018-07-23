import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/Rx';

import { environment as ENV } from '../../../../../environments/environment';
import { VITALS_CONSTANTS } from '../../../../constants/url-constants';
import { HeadersService } from '../../../../constants/url-constants';
import { HttpInterceptor } from './../../../../config/HTTP';
import { LoadingBarService } from './../../../../components/core/loading-bar';

@Injectable()
export class EventLogService {

  options: any;

  constructor(private _http: HttpInterceptor, private _headers: HeadersService, private _loadingBarService: LoadingBarService) {
    this.options = this._headers.getHeaders();
   }
}

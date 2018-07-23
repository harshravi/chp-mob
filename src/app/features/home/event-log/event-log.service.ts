import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { environment } from '../../../../environments/environment';
import { HttpInterceptor } from './../../../config/HTTP';
import { VITALS_CONSTANTS } from '../../../constants/url-constants';
import { HeadersService } from '../../../constants/url-constants';
import { LoadingBarService } from './../../../components/core/loading-bar';

@Injectable()
export class EventLogService {

  options: any;
  constructor(private _headers: HeadersService, private _http: HttpInterceptor, private _loadingBarService: LoadingBarService) {
    this.options = this._headers.getHeaders();
  }
  // service to get eventlog data in the table
  getEventlogTabular(participantDetails: Object) {
    this._loadingBarService.start();
    const result = this._http.post(environment.URL + VITALS_CONSTANTS.GET_EVENT_LOG_TABULAR, participantDetails, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
    return result;
  }
  /** Get the Details of the selected event-log */
  getEventlogDetails(eventLogId) {
    // let options = new RequestOptions({ withCredentials: true });
    this._loadingBarService.start();
    return this._http.get(environment.URL + VITALS_CONSTANTS.GET_EVENT_LOG_DETAILS + '/' + eventLogId, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
  }  
}

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/Rx';

import { environment as ENV } from '../../../../../environments/environment';
import { GLOBAL_SETTINGS } from '../../../../constants/url-constants';
import { HeadersService } from '../../../../constants/url-constants';
import { HttpInterceptor } from './../../../../config/HTTP';
import { LoadingBarService } from './../../../../components/core/loading-bar';

@Injectable()
export class GlobalSettingsService {

  options: any;

  constructor(private _http: HttpInterceptor, private _headers: HeadersService, private _loadingBarService: LoadingBarService) {
    this.options = this._headers.getHeaders();
  }

  /** Making Model to be sent to the backend for storing data */
  getGlobalSettingsPostModel(data: Object) {
    return [{
      settings_type: 'MOBILE_AUTO_LOCK',
      settings_value: data['dropdown0'] === 'Custom' ? data['sendReqTime0'] : data['dropdown0']
    }, {
      settings_type: 'WEB_AUTO_LOGOFF',
      settings_value: data['dropdown1'] === 'Custom' ? data['sendReqTime1'] : data['dropdown1']
    }, {
      settings_type: 'MEDICATION_REMINDER',
      settings_value: data['dropdown2'] === 'Custom' ? data['sendReqTime2'] : data['dropdown2']
    }];
  }

  /** Get the values for the Global Settings from the Backend */
  getGlobalSettings() {
    // let options = new RequestOptions({ withCredentials: true });
    this._loadingBarService.start();
    return this._http.get(ENV.URL + GLOBAL_SETTINGS.VIEW_SETTINGS, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
  }

  /**
   * Save or update the Global Settings
   */
  saveGlobalSettings(globalSettingsData: Object) {
    // let options = new RequestOptions({ withCredentials: true });
    this._loadingBarService.start();
    return this._http.post(ENV.URL + GLOBAL_SETTINGS.UPDATE_SETTINGS, globalSettingsData, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
  }
}

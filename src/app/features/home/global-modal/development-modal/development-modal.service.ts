import { Injectable } from '@angular/core';
import { HeadersService } from '../../../../constants/url-constants';
import { HttpInterceptor } from '../../../../config/HTTP';
import { DASHBOARD_CONSTANT } from '../../../../constants/url-constants';
import { environment } from '../../../../../environments/environment';
import { LoadingBarService } from './../../../../components/core/loading-bar';

@Injectable()
export class DevelopmentModalService {

  options: any;

  constructor(private _http: HttpInterceptor, private _headers: HeadersService, private _loadingBarService: LoadingBarService) {
    this.options = this._headers.getHeaders();
  }

  addDevelopmentData(addDevelopData: object) {
    // const url = environment.URL + DASHBOARD_CONSTANT.ADD_LUNGS;ADD_DEVELOPMENT
    const url = environment.URL + DASHBOARD_CONSTANT.ADD_DEVELOPMENT;
    this._loadingBarService.start();
    return this._http.post(url, addDevelopData, this.options)
      .map(res => res.json())
      .toPromise()
      .then((data) => {
        this._loadingBarService.complete();
        return data;
      }, error => {
        this._loadingBarService.complete();
        return JSON.parse(error._body);
      });
  }
  updateDevelopment(developmentData: object) {
    const url = environment.URL + DASHBOARD_CONSTANT.UPDATE_DEVELOPMENT;
    this._loadingBarService.start();
    return this._http.post(url, developmentData, this.options)
      .map(res => res.json())
      .toPromise()
      .then((data) => {
        this._loadingBarService.complete();
        return data;
      }, error => {
        this._loadingBarService.complete();
        return JSON.parse(error._body);
      });
  }

}

import { Injectable } from '@angular/core';
import { HeadersService } from '../../../../constants/url-constants';
import { HttpInterceptor } from '../../../../config/HTTP';
import { DASHBOARD_CONSTANT } from '../../../../constants/url-constants';
import { environment } from '../../../../../environments/environment';
import { LoadingBarService } from './../../../../components/core/loading-bar';
import { ILungDataStatus } from './model/lungs.model';

@Injectable()
export class LungsService {

  options: object;
  constructor(private _http: HttpInterceptor, private _headers: HeadersService, private _loadingBarService: LoadingBarService) {
    this.options = this._headers.getHeaders();
  }

  // add lungs
  addLungs(lungsData: object) {
    const url = environment.URL + DASHBOARD_CONSTANT.ADD_LUNGS;
    this._loadingBarService.start();
    return this._http.post(url, lungsData, this.options)
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

  updateLungs(lungsData: object) {
    const url = environment.URL + DASHBOARD_CONSTANT.UPDATE_LUNGS;
    this._loadingBarService.start();
    return this._http.post(url, lungsData, this.options)
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

  getLungDataStatus(partipantId: string): Promise<ILungDataStatus> {
    const url = environment.URL + DASHBOARD_CONSTANT.GET_LUNG_DATA_STATUS + partipantId;
    this._loadingBarService.start();

    return this._http.get(url, this.options)
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

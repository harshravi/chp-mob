import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { environment } from '../../../../environments/environment';
import { HttpInterceptor } from './../../../config/HTTP';
import { VITALS_CONSTANTS } from '../../../constants/url-constants';
import { HeadersService } from '../../../constants/url-constants';
import { LoadingBarService } from './../../../components/core/loading-bar';

@Injectable()
export class CareTeamService {

  options: any;
  constructor(private _headers: HeadersService, private _http: HttpInterceptor, private _loadingBarService: LoadingBarService) {
    this.options = this._headers.getHeaders();
  }

  getListOfCareTeamMembersOfCarePlan(ref_id) {
    this._loadingBarService.start();
    const result = this._http.get(environment.URL + VITALS_CONSTANTS.GET_LIST_OF_CARETEAMMEMBERS_OF_CAREPLAN + '/' + ref_id, this.options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
    return result;
  }
}

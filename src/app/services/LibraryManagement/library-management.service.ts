import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';

import { HttpInterceptor } from './../../config/HTTP';
import { environment } from '../../../environments/environment';
import { LIBRARY_MANAGEMENT } from '../../constants/url-constants';

@Injectable()
export class LibraryManagementService {

  constructor(private _storage: LocalStorageService, private _http: HttpInterceptor) { }

  /**
   * Get the list of drugs that are there in the library. This Service will
   * get the list of all possible drugs that are available in the listing.
   * This also takes three parameters which are namely offset and limit through
   * which the pagination is being done.
   */
  getDrugsList(offset, limit) {
    const options = new RequestOptions({ withCredentials: true });
    return this._http.get(environment.URL + LIBRARY_MANAGEMENT.GET_DRUGS + '/' + offset + '/' + limit, options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        return data;
      });
  }

}

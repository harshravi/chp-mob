import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { environment } from '../../../environments/environment';
import { CLIENT_CONSTANT } from '../../constants/url-constants';
import { HeadersService } from '../../constants/url-constants';
import { HttpInterceptor } from './../../config/HTTP';
import { LoadingBarService } from './../../components/core/loading-bar';
import { Observable } from 'rxjs/Observable';
import { CommonUtil, IHttpServiceResponse } from '../../utils/common.util';

@Injectable()
export class ClientAdminUserManagementService {

    options: any;
    getParticipantListHttp: IHttpServiceResponse<any>;

    constructor(private _storage: LocalStorageService, private _loadingBarService: LoadingBarService,
        private _http: HttpInterceptor, private _headers: HeadersService) {
        this.options = this._headers.getHeaders();
    }

    /** Get user Details */
    getUserList(obj) {
        const url = environment.URL + CLIENT_CONSTANT.VIEW_USER_DETAILS;

        this._loadingBarService.start();

        const result = this._http.post(url, obj, this.options)
            .map(res => res.json())
            .toPromise()
            .then((data) => {
                this._loadingBarService.complete();
                return data;
            });
        return result;
    }

    /** Change Role of the user */
    changeUserRole(obj) {
        const url = environment.URL + CLIENT_CONSTANT.CHANGE_ROLE;

        this._loadingBarService.start();

        const result = this._http.post(url, obj, this.options)
            .map(res => res.json())
            .toPromise()
            .then((data) => {
                this._loadingBarService.complete();
                return data;
            });
        return result;
    }

    /** Enable User */
    enableUser(id) {
        const url = environment.URL + CLIENT_CONSTANT.ENABLE_USER + '/' + id;

        this._loadingBarService.start();

        const result = this._http.post(url, {}, this.options)
            .map(res => res.json())
            .toPromise()
            .then((data) => {
                this._loadingBarService.complete();
                return data;
            });
        return result;
    }

    /** Disable User */
    disableUser(id) {
        const url = environment.URL + CLIENT_CONSTANT.DISABLE_USER + '/' + id;

        this._loadingBarService.start();

        const result = this._http.post(url, {}, this.options)
            .map(res => res.json())
            .toPromise()
            .then((data) => {
                this._loadingBarService.complete();
                return data;
            });
        return result;
    }
}

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { environment } from '../../../environments/environment';
import { DASHBOARD_CONSTANT } from '../../constants/url-constants';
import { HeadersService } from '../../constants/url-constants';
import { HttpInterceptor } from './../../config/HTTP';
import { LoadingBarService } from './../../components/core/loading-bar';
import { Observable } from 'rxjs/Observable';
import { CommonUtil, IHttpServiceResponse } from '../../utils/common.util';

@Injectable()
export class UserManagementService {

    options: any;
    getParticipantListHttp: IHttpServiceResponse<any>;

    constructor(private _storage: LocalStorageService, private _loadingBarService: LoadingBarService,
        private _http: HttpInterceptor, private _headers: HeadersService) {
        this.options = this._headers.getHeaders();

        this.getParticipantListHttp = CommonUtil.httpService(_http, _loadingBarService);
    }

    /** Get user Details */
    getUserDetails() {
        return this._storage.get('userdetails');
    }

    /** Get User Role */
    getRole() {

    }

    getParticipantList(data): Observable<any> {
        const url = environment.URL + DASHBOARD_CONSTANT.GET_PARTICIPANTS_FOR_STAFF;

        this._loadingBarService.start();

        this.getParticipantListHttp.call({ callType: 'post', url: url, data: data, options: this.options });
        return this.getParticipantListHttp.httpResponse$;
    }

    getParticipantData() {
        const url = environment.URL + DASHBOARD_CONSTANT.GET_PARTICIPANTS_DATA;

        this._loadingBarService.start();

        this.getParticipantListHttp.call({ callType: 'get', url: url, options: this.options });
        return this.getParticipantListHttp.httpResponse$;
    }

    getMyCarePlans() {
        const url = environment.URL + DASHBOARD_CONSTANT.GET_CURRENT_STAFF_PROGRAMS;

        this._loadingBarService.start();

        const result = this._http.get(url, this.options)
            .map(res => res.json())
            .toPromise()
            .then((data) => {
                this._loadingBarService.complete();
                return data;
            });
        return result;
    }

    getAllCarePlans() {
        const url = environment.URL + DASHBOARD_CONSTANT.GET_ALL_STAFF_PROGRAMS;

        this._loadingBarService.start();
        const result = this._http.get(url, this.options)
            .map(res => res.json())
            .toPromise()
            .then((data) => {
                this._loadingBarService.complete();
                return data;
            });
        return result;
    }

    getTasks() {

        // Loading bar is not required in this service because its a repetitive call.
        const url = environment.URL + DASHBOARD_CONSTANT.GET_TASKS;
        const result = this._http.get(url, this.options)
            .map(res => res.json())
            .toPromise()
            .then(data => {
                return data;
            });

        // let result = new Promise((res) => {
        //     // res
        // });

        return result;
    }

    getSearchedParticipant(participantId,participantName) {
        const url = environment.URL + DASHBOARD_CONSTANT.GET_ALL_SEARCHED_PARTICIPANT + participantId +'/'+'searchStaff?staff_name='+ participantName;

        this._loadingBarService.start();
        const result = this._http.get(url, this.options)
            .map(res => res.json())
            .toPromise()
            .then((data) => {
                this._loadingBarService.complete();
                return data;
            });
        return result;
    }

    reassignActionPlan(obj) {
        const url = environment.URL + DASHBOARD_CONSTANT.REASSIGN_ACTION_PLAN_TASK

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

    getAlerts() {

        // Loading bar is not required in this service because its a repetitive call.
        const url = environment.URL + DASHBOARD_CONSTANT.GET_ALERTS;
        const result = this._http.get(url, this.options)
            .map(res => res.json())
            .toPromise()
            .then(data => {
                return data;
            });

        // let result = new Promise((res) => {
        //     // res
        // });

        return result;
    }

}

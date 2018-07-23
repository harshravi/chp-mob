import { Observable } from 'rxjs/Observable';
import { CommonUtil, IHttpServiceResponse } from '../../../../../utils/common.util';
import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { HttpInterceptor } from './../../../../../config/HTTP';
import { HeadersService } from '../../../../../constants/url-constants';
import { LoadingBarService } from './../../../../../components/core/loading-bar';
import { environment } from '../../../../../../environments/environment';
import { DASHBOARD_CONSTANT } from '../../../../../constants/url-constants';
import { IResponseObj } from '../../../../../models';

@Injectable()
export class SetMedicationInactive {

    options: RequestOptions;
    setMedicationInactiveHttp: IHttpServiceResponse<any>;

    constructor(private _storage: LocalStorageService, private _loadingBarService: LoadingBarService,
        private _http: HttpInterceptor, private _headers: HeadersService) {
        this.options = this._headers.getHeaders();

        this.setMedicationInactiveHttp = CommonUtil.httpService(_http, _loadingBarService);
    }

    setInactive(participantId: string, medicationId: string): Observable<any> {
        let url = environment.URL + DASHBOARD_CONSTANT.POST_SET_INACTIVE_MEDICATION;
        url += participantId + '/' + medicationId;

        this._loadingBarService.start();

        this.setMedicationInactiveHttp.call({ callType: 'post', url: url, data: {}, options: this.options });
        return this.setMedicationInactiveHttp.httpResponse$;
    }
}


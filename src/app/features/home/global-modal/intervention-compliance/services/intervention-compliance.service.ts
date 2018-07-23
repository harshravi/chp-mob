import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { environment } from '../../../../../../environments/environment';
import { DASHBOARD_CONSTANT } from '../../../../../constants/url-constants';
import { HeadersService } from '../../../../../constants/url-constants';
import { HttpInterceptor } from './../../../../../config/HTTP';
import { LoadingBarService } from './../../../../../components/core/loading-bar';
import { InterventionComplianceModel, MedicationCMPLDetails, CareplanCMPLDetail } from '../model/intervention-compliance.model';

@Injectable()
export class InterventionComplianceService {

    options: RequestOptions;

    constructor(private _storage: LocalStorageService,
        private _loadingBarService: LoadingBarService,
        private _http: HttpInterceptor,
        private _headers: HeadersService) {

        this.options = this._headers.getHeaders();
    }

    getInterventionCompliance(participantId?: string): Promise<InterventionComplianceModel> {
        const url = environment.URL + DASHBOARD_CONSTANT.GET_INTERVENTION_COMPLIANCE_LIST + '/' + participantId;

        this._loadingBarService.start();

        const result: Promise<InterventionComplianceModel> = this._http.get(url, this.options)
            .map(res => res.json())
            .toPromise()
            .then((res) => {
                this._loadingBarService.complete();
                return res;
            }, err => {
                return [];
            });
        return result;
    }

}
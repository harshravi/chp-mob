import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserManagementService } from '../../../services/UserManagement';
import { LocalStorageService } from 'angular-2-local-storage';

/** importing breadcrumb service to set breadcrumb */
import { BreadcrumbService } from '../../../services';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as _ from 'lodash';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    providers: [UserManagementService]
})
export class DashboardComponent implements OnInit, OnDestroy {
    bannerCard = 'Banner Card';
    bannerCard1 = 'Banner Card 1';
    bannerCard2 = 'Banner Card 2';

    Data = 'Helloo How are you';
    Data1 = 'Banner Card';
    Data2 = 'Banner Card';

    participantData: Object;
    isChecked = true;
    allParticipantData: Object;
    myCarePlan: Object;
    allCarePlan: Object;
    gridObj: Object;
    gridAllObj: Object;
    userObject: any;
    subScriptions: Subscription[] = [];
    isDataLoading: boolean;

    constructor(private UserManagementService: UserManagementService,
        private _storage: LocalStorageService, private _breadcrumbService: BreadcrumbService) {
    }

    // get my Participants List
    getMyParticipantList(gridObj) {
        this.dataLoadingStarted();
        this.unSubscribe();
        const subc = this.UserManagementService.getParticipantList(gridObj)
            .subscribe(data => {
                this.participantData = data.json();
                this.dataLoadingCompleted();
            }, error => {
                this.dataLoadingCompleted();
            });

        this.subScriptions.push(subc);
    }

    // get All Participants List
    getAllparticipantsList(gridObj) {
        this.dataLoadingStarted();
        this.unSubscribe();
        const subc = this.UserManagementService.getParticipantList(gridObj)
            .subscribe(data => {
                this.dataLoadingCompleted();
                this.allParticipantData = data.json();
            }, error => {
                this.dataLoadingCompleted();
            });

        this.subScriptions.push(subc);
    }

    onSelection(data) {
        // var pgmNumbers = (data.data.length == 0) ? null : data.data;
        // var risk_status = (data.risk_status.length == 0) ? null : data.risk_status;
        let pgmNumbers;
        let risk_status;
        if (data.data) {
            pgmNumbers = (data.data.length === 0) ? null : data.data;
        }
        if (data.risk_status) {
            risk_status = (data.risk_status.length === 0) ? null : data.risk_status;
        }

        const obj = {
            my_patients: data.checked,
            program_nums: pgmNumbers,
            risk_status: risk_status,
            offset: 0,
            search_params: ''
        };

        if (obj.my_patients) {
            this.getMyParticipantList(obj);
        } else {
            this.getAllparticipantsList(obj);
        }
    }

    ngOnInit() {

        this._breadcrumbService.setBreadcrumbs('Home', null);
        // Assinging the userObject to hided the details as per the roles.
        this.userObject = this._storage.get('userdetails');
        // object for get my participantData
        this.gridObj = {
            'my_patients': true,
            'program_nums': null,
            'risk_status': null
        };
        // object for get allParticipantData
        this.gridAllObj = {
            'my_patients': false,
            'program_nums': null,
            'risk_status': null
        };

    }

    updateTableData(event) {
        if (event === 'checked') {
            this.getMyParticipantList(this.gridObj);
        } else {
            this.getAllparticipantsList(this.gridAllObj);
        }
    }

    unSubscribe() {
        _.forEach(this.subScriptions, (sub) => {
            if (sub) {
                sub.unsubscribe();
            }
        });
    }

    ngOnDestroy() {
        this.unSubscribe();
    }

    dataLoadingStarted(): void {
        this.isDataLoading = true;
    }

    dataLoadingCompleted(): void {
        this.isDataLoading = false;
    }
}

import {
    Component, OnInit, ViewEncapsulation, ChangeDetectorRef,
    AfterViewChecked, Input, ViewChild, Output, EventEmitter, OnChanges,
    SimpleChange, Pipe, PipeTransform, OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { CheckBoxService } from '../../../../../services';
import { DATATABLE_EXCEPTIONS } from '../../../../../constants/exception-messges';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ClientAdminUserManagementService } from '../../../../../services/UserManagement';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { CustomInviteUserModalContext, InviteUserModalComponent } from '../../../global-modal/invite-user';
import { IUserListForClient, IColumns, IUsers, IgriObject } from './model/user-listing.model';
import * as _ from 'lodash';

@Component({
    selector: 'app-client-data-table',
    templateUrl: './client-data-table.component.html',
    styleUrls: ['./client-data-table.component.scss'],
    providers: [CheckBoxService, ClientAdminUserManagementService],
    encapsulation: ViewEncapsulation.None
})

export class ClientDataTableComponent implements AfterViewChecked {
    private currentComponentWidth;
    @ViewChild('tableWrapper') tableWrapper;
    @ViewChild('myTable') table: DatatableComponent;

    columns: IColumns[] = [
        { prop: 'user_name', name: 'Name' },
        { prop: 'email_id', name: 'Email' },
        { prop: 'role_name', name: 'Role' },
        { prop: 'access', name: 'Access' },
        { prop: 'status', name: 'Status' }
    ];

    invited = false;
    disabled = false;
    gridData: IUserListForClient;
    temp: IUsers[] = [];
    multiselectTwo = 'two';
    loadingIndicator = true;
    isDataLoading: boolean;

    griObject: IgriObject = {
        invited: false,
        disabled: false,
        role_name_search: ''
    };

    searchParticipant = '';
    selectRoleListVar = 'Role';

    constructor(private changeDetectorRef: ChangeDetectorRef, private _clientAdminService: ClientAdminUserManagementService,
        private _modal: Modal) {
        this.updateGridData();
    }

    ngAfterViewChecked() {
        // Check if the table size has changed,
        if (this.table && this.table.recalculate && (this.tableWrapper.nativeElement.clientWidth !== this.currentComponentWidth)) {
            this.currentComponentWidth = this.tableWrapper.nativeElement.clientWidth;
            this.table.recalculate();
            this.changeDetectorRef.detectChanges();
        }
    }

    updateGridData() {
        this.dataLoadingStarted();
        this._clientAdminService.getUserList(this.griObject).then((data: IUserListForClient) => {
            this.gridData = data;
            this.loadingIndicator = false;
            this.dataLoadingCompleted();
            this.temp = data.care_team_user_list;
            if (this.searchParticipant !== '') {
                this.updateFilter(this.searchParticipant);
            }
        });
    }

    updateFilter(data: string) {

        let val = data;
        val = val.toLowerCase();
        // filter our data
        const temp = this.temp.filter((d) => {
            return d.user_name.toLowerCase().indexOf(val) !== -1 || !val;
        });
        // update the rows
        this.gridData.care_team_user_list = temp;
        this.table.offset = 0;
    }

    /** Update the data as per filter */
    showParticipantChange() {
        this.updateGridData();
    }

    /** Select option from right side dropdown */
    selectedOption(event: string, row: IUsers) {
        row.editable_flag = true;
        if (event === 'Edit') {
            row.options.filter((d, index) => {
                if (d === 'Edit') {
                    row.editable_flag = true;
                    row.options[index] = 'Save';
                }
            });

        } else if (event === 'Save') {
            const editObj = {
                'user_id': row.user_id,
                'role_id': row.role_name
            };
            this.editRole(editObj);
        } else if (event === 'Disable') {
            this.disableUser(row.user_id);
        } else if (event === 'Enable') {
            this.enableUser(row.user_id);
        }
    }

    /** Edit Role of user */
    editRole(editObj) {
        this._clientAdminService.changeUserRole(editObj).then(data => {
            this.updateGridData();
        });
    }

    /** Disable User */
    disableUser(id) {
        this._clientAdminService.disableUser(id).then(data => {
            this.updateGridData();
        });
    }

    /** enable User */
    enableUser(id) {
        this._clientAdminService.enableUser(id).then(data => {
            this.updateGridData();
        });
    }

    /** Opem Invite User Modal */
    openInviteUserModal() {
        this._modal.open(InviteUserModalComponent, overlayConfigFactory({ edit: false }, CustomInviteUserModalContext));
    }

    dataLoadingStarted(): void {
        this.isDataLoading = true;
    }

    dataLoadingCompleted(): void {
        this.isDataLoading = false;
    }
}

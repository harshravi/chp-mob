
import { LocalStorageService } from 'angular-2-local-storage';
import { IUserDetail } from '../../models';
import { Injectable } from '@angular/core';
import { AclService } from './ACL.service';

@Injectable()
export class AppACLService {


    constructor(private _storage: LocalStorageService,
        private _aclService: AclService) {

        this._storage.setItems$.subscribe(val => {
            if (val.key === 'userdetails') {
                this.createPrivileges(val.newvalue);
            }
        });

        this.createPrivileges(<IUserDetail>this._storage.get('userdetails'));

    }

    createPrivileges(userDetails: IUserDetail) {

        if (userDetails) {
            const ability: { [key: string]: string[] } = {
                [userDetails.roleType]: userDetails.previleges
            };

            this._aclService.setAbilities(ability);
            this._aclService.attachRole(userDetails.roleType);
        }

    }


}


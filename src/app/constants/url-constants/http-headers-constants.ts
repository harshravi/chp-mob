import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class HeadersService {

    constructor(private _storage: LocalStorageService) { }
    /* Get Headers */
    getloginHeaders() {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers, withCredentials: true });
        return options;
    }

    getHeaders(): RequestOptions {
        const headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json', 'X-CSRF-TOKEN': this._storage.get('xcsrftoken')
        });
        const options = new RequestOptions({ headers: headers, withCredentials: true });
        return options;
    }
}

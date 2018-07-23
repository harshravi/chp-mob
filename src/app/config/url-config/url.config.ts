import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';

@Injectable()
export class ChpConstants {

    /* Get Headers */
    getloginHeaders(){
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers, withCredentials: true });
        return options;
    }

    getHeaders(){
        let headers = new Headers({'Accept':'application/json','Content-Type': 'application/json', 'X-CSRF-TOKEN': window.localStorage.getItem('xcsrftoken') });
        let options = new RequestOptions({ headers: headers, withCredentials: true });
        return options;
    }
}
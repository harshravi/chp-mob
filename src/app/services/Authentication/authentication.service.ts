import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { LocalStorageService } from 'angular-2-local-storage';
import 'rxjs/add/operator/map';

import { environment } from '../../../environments/environment';
import { AUTH_CONSTANT } from '../../constants/url-constants';
import { HttpInterceptor } from './../../config/HTTP';
import { HeadersService } from '../../constants/url-constants';
import { LoadingBarService } from './../../components/core/loading-bar';

@Injectable()
export class AuthenticationService {

  constructor(private _http: HttpInterceptor, private _storage: LocalStorageService,
    private _router: Router, private _headers: HeadersService,
    private _loadingBarService: LoadingBarService) { }

  /** Login the User into the System */
  login(authObject) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers, withCredentials: true });

    return this._http.post(environment.URL + AUTH_CONSTANT.LOGIN, authObject, options)
      .toPromise()
      .then(data => {
        this._storage.set('xcsrftoken', data.headers.get('X-CSRF-TOKEN'));
        const res = data.json();
        if (res) {
          // this.isLoggedIn = true;
          this._storage.set('IS_LOGGED_IN', true);
          this._storage.set('userdetails', res);
          //this._appACLService.createPrivileges(res);
          // service call to get the secure chat credentials
          // this.getSecureChatLoginDetails();
          /** Navigating user to another page if login is successful. */
          if (res.new_user === true) {
            this._router.navigate(['./register-mch']);
          } else {
            this._router.navigate(['./home']);
          }
        }
      }, (res_error) => {
        const error = res_error.json();
        this._storage.set('IS_LOGGED_IN', false);
        return error;
      });
  }

  /** Logout the user out of the system */
  logout() {
    const options = this._headers.getHeaders();
    return this._http.post(environment.URL + AUTH_CONSTANT.LOGOUT, {}, options)
      .subscribe(res => {

        // Checking whether the status code is for Success or not
        if (res.status === 200) {

          // clear the all loaclstorage value
          this._storage.clearAll();

          // Storing the Logout In Users data into the localStorage & making isLoggedIn false
          this._storage.set('IS_LOGGED_IN', false);
          // Navigate the page to the home page
          this._router.navigate(['./']);
        }
      });
  }

  /** Returns a boolean variable stating whether a user is logged in or not */
  isLoggedIn(): boolean {

    // Defines the initial status of a user
    let loginStatus = false;

    // If the status of the user is true then the status becomes true else false is returned
    if (this._storage.get('IS_LOGGED_IN')) {
      loginStatus = true;
    }

    return loginStatus;
  }

  /**Get the tigerText credentials for the user logging into the application*/
  getSecureChatLoginDetails() {
    this._loadingBarService.start();
    const options = this._headers.getHeaders();
    const result = this._http.get(environment.URL + AUTH_CONSTANT.SECURE_CHAT_CREDENTIALS, options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._storage.set('userchatdetails', data);
        this._loadingBarService.complete();
        return data;
      });
    return result;
  }

  getListOfContactsForChat() {
    this._loadingBarService.start();
    const options = this._headers.getHeaders();
    const result = this._http.get(environment.URL + AUTH_CONSTANT.CHAT_USER_LIST_OF_CONTACTS, options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
    return result;
  }
  
  // Get access_token for the twilio for a logged in user.
  getAccessTokenForChat() {
    this._loadingBarService.start();
    const options = this._headers.getHeaders();
    const result = this._http.get(environment.URL + AUTH_CONSTANT.GET_ACCESS_TOKEN, options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        return data;
      });
      return result;
  }

  mchRegistration(mchCradencials) {
    this._loadingBarService.start()
    const options = this._headers.getHeaders();
    return this._http.post(environment.URL + AUTH_CONSTANT.mchRegistration, mchCradencials, options)
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        this._router.navigate(['./home']);
        return data;
      }, (res_error) => {
        const error = res_error.json();
        return error;
      });
  }

  getRegister(data) {
    this._loadingBarService.start();
    // const result = this._http.get(environment.URL + AUTH_CONSTANT.REGISTER_PHYSICIAN)
    const url = environment.URL + AUTH_CONSTANT.REGISTER_PHYSICIAN;
    const result = this._http.post(url, data)
      .map(res => res.json())
      .toPromise()
      .then((res) => {
        this._loadingBarService.complete();
        return res;
      });
    return result;

  }

  submitPasscode(data) {
    this._loadingBarService.start();
    // const result = this._http.get(environment.URL + AUTH_CONSTANT.REGISTER_PHYSICIAN)
    const url = environment.URL + AUTH_CONSTANT.PASSCODE;
    const result = this._http.post(url, data)
      .map(res => res.json())
      .toPromise()
      .then((res) => {
        this._loadingBarService.complete();
        return res;
      });
    return result;

  }

  getInvitationDetail(invitationCode: number) {
    this._loadingBarService.start();
    const options = this._headers.getHeaders();
    const result = this._http.get(environment.URL + AUTH_CONSTANT.USER_INVITATION + invitationCode, options)
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this._loadingBarService.complete();
        return data;
      });
    return result;
  }
}

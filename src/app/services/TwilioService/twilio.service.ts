import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AuthenticationService } from '../Authentication';
import { Component } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { HeadersService, AUTH_CONSTANT } from '../../constants/url-constants';
import { environment as ENV } from '../../../environments/environment';
declare var Twilio: any;
// declare var AccessManager: any;

@Injectable()
export class TwilioService {
  TwilioChatClient: any = undefined;
  TwilioAccessManager: any = undefined;
  constructor(private http: Http, private _auth: AuthenticationService,
  private _localStorage: LocalStorageService, private _headers: HeadersService) {
  }
  public initChatClient(): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      this.getAccessToken().subscribe(data => {
       // console.log('creating the client now');
        this.createChatClient(data); // uncoment when wants to create channel
        resolve();
      });
    });
    return promise;
  }
  public createChannel(channelUniqueName: string, friendlyName: string): Promise<any> {
    return this.TwilioChatClient.createChannel({
      uniqueName: channelUniqueName,
      friendlyName: friendlyName,
      isPrivate: true
    });
  }

  public getUserInfo() {
    return this.TwilioChatClient.user;
  }

  public getSubscribedChannels(): Promise<any> {
    return this.TwilioChatClient.getSubscribedChannels();
  }

  public getChannelByUniqueName(uniqueName: string) {
    return this.TwilioChatClient.getChannelByUniqueName(uniqueName);
  }

  public getTwilioClient() {
    if (typeof this.TwilioChatClient !== 'undefined') {
      return this.TwilioChatClient;
    }
  }

  public getTwilioAccessManager() {
    if (typeof this.TwilioAccessManager !== 'undefined') {
      return this.TwilioAccessManager;
    }
  }

  /**
   * This method helps in order to create a TwilioChatClient.
   * It first checks whether you already have a client initialized,
   * if not it goes ahead creating one else leaves you with the
   * same chat client.
   * @param data AccessToken to be Injected
   */
  public createChatClient(data: any) {
    if (typeof this.TwilioChatClient === 'undefined') {
      this.TwilioChatClient = new Twilio.Chat.Client(data.access_token);
      this.TwilioAccessManager = new Twilio.AccessManager(data.access_token);
    }else {
     // console.log('already created...........')
    }
  }

  /**
   * Get Access token for the user Currently Logged In
   */
  public getAccessToken(): Observable<any> {
    const options = this._headers.getHeaders();
     return this.http.get(ENV.URL + AUTH_CONSTANT.GET_ACCESS_TOKEN, options).map(res => res.json());
  }

  public getUserChannelDescriptors(): Promise<any> {
    this.TwilioChatClient.getUserChannelDescriptors().then((paginator) => {
      for (let i = 0; i < paginator.items.length; i++) {
        const channel = paginator.items[i];
        // console.log('Channel: ' + channel.friendlyName);
      }
    });
    return this.TwilioChatClient.getUserChannelDescriptors();
  }

  // closing the client instance connection gracefully.
  // To be called at the time of logout.
  public shutdownClientInstance() {
    if (this.TwilioChatClient) {
      this.TwilioChatClient.shutdown().then((data) => {
      // console.log('shutting down instance ...');
    });
    }
    return 0;
  }
}

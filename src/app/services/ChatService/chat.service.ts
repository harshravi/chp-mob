import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { AUTH_CONSTANT } from '../../constants/url-constants';
import { HttpInterceptor } from './../../config/HTTP';
import { HeadersService } from '../../constants/url-constants';
import { environment } from '../../../environments/environment';
import { LoadingBarService } from './../../components/core/loading-bar';
// import { PubSubService } from '../PubSubService';
declare var TigerConnect: any;
@Injectable()
export class ChatService {
 // declare = 'tigerconnect';
  options = {
    autoAck: true,
    isTyping: true,
    multiOrg: false,
    noOfflineMessages: false, // make this true if previous messages should be disregarded
    autoDeliver: false,
    hidden: false,
    closeAfterMessages: false
  };
  constructor(private _http: HttpInterceptor, private _headers: HeadersService, private _loadingBarService: LoadingBarService) {
    // this._pubSub = new PubSubService();
   }
  // Get the tiger text client. This Client is then used for logging in to the tiger text.
  getTigerTextClient() {
        // var TigerConnect = require('tigerconnect');
        const Client = new TigerConnect.Client({
            apiEnv: 'uat',
            defaultOrganizationId: 'oyLRiA6fbk9SVgytGcJDxg2l',
            // use the default org to send all messages in a specific organization unless specified otherwise
            // prod: 'fDHTkzKRMJlPKr0MX1jKn3Th', 'oyLRiA6fbk9SVgytGcJDxg2l','UpM28mnfW65vJkbqEATtKvxm',
            events: {
                autoAck: this.options.autoAck,
                isTyping: this.options.isTyping,
                multiOrg: this.options.multiOrg,
                noOfflineMessages: this.options.noOfflineMessages, // make this true if previous messages should be disregarded
                autoDeliver: this.options.autoDeliver,
                hidden: this.options.hidden,
                closeAfterMessages: this.options.closeAfterMessages
            },
            logLevel: 'error', // debug/info/warn/error/fatal
        });
        return Client;
    }

    // Archive all the messages which are sent by the logged in user.
    // These messages can be loaded later on. Once TT server expires the message
    messageArchival(message) {
    const options = this._headers.getHeaders();
    const result =  this._http.post(environment.URL + AUTH_CONSTANT.MESSAGE_ARCHIVAL, message, options)
    .map(res => res.json())
    .toPromise()
    .then(data => {
      return data;
    });
    return result;
}

/**
 * Load Archived Messages when clicked on Load More Button
 * Loads messages based upon the date. Messages older than 30 days will be loaded
 */
 loadArchivedMessages(loadMsgObj) {
    this._loadingBarService.start();
    const options = this._headers.getHeaders();
    const result =  this._http.post(environment.URL + AUTH_CONSTANT.LOAD_ARCHIVED_MESSAGES, loadMsgObj, options)
    .map(res => res.json())
    .toPromise()
    .then(data => {
        this._loadingBarService.complete();
      return data;
    });
    return result;
 }

/**
 * Method for push notification
 */
sendPushNotificationForMessages(pushObj) {
    const options = this._headers.getHeaders();
    const result =  this._http.post(environment.URL + AUTH_CONSTANT.SEND_PUSH_NOTIFICATION, pushObj, options)
    .map(res => res.json())
    .toPromise()
    .then(data => {
      return data;
    });
    return result;
  }

  // Encrypt messages before sending it to the tiwilio
  messageEncryptionForTwilio(encryptionObj) {
    const options = this._headers.getHeaders();
    const result =  this._http.post(environment.URL + AUTH_CONSTANT.MESSAGE_ENCRYPTION, encryptionObj, options)
    .map(res => res.json())
    .toPromise()
    .then(data => {
      return data;
    });
    return result;
  }

  // Decrypt the messages which is received from Twilio
  messageDecryptionForTwilio(decryptionObj) {
    const options = this._headers.getHeaders();
    const result =  this._http.post(environment.URL + AUTH_CONSTANT.MESSAGE_DECRYPTION, decryptionObj, options)
    .map(res => res.json())
    .toPromise()
    .then(data => {
      return data;
    });
    return result;
  }
}

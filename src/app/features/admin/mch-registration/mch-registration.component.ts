import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../../services';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ChatService, PubSubService, MessagingDataService } from '../../../services';
import { ValidationService } from '../../../components/core/error-messages';
import { Expressions } from '../../../constants/other-constants/expressions-constants';
import { LocalStorageService } from 'angular-2-local-storage';
import { IContact } from './model/mch-registration.model';
import { TextMaskModule } from 'angular2-text-mask';
import { IUserDetail } from './../../../models';
import * as _ from 'lodash';

@Component({
  selector: 'app-mch-registration',
  templateUrl: './mch-registration.component.html',
  styleUrls: ['./mch-registration.component.scss'],
  providers: [
    AuthenticationService,
    ChatService
  ]
})
export class MchRegistrationComponent implements OnInit {

  listOfAllContacts: IContact;
  idOfMessage: string;
  userDetailObj: IUserDetail;
  public phoneMask = Expressions.phoneMask;
  // FormGroup Name is loginForm
  mchForm: FormGroup;
  constructor(private _fb: FormBuilder, private _auth: AuthenticationService,
    private _chatService: ChatService, private _storage: LocalStorageService,
    private _msgDataService: MessagingDataService, private _pubSub: PubSubService) {

  }

  ngOnInit() {
    this.userDetailObj = <IUserDetail>this._storage.get('userdetails');
    this.mchForm = this._fb.group({
      mobile_number: ['', [ValidationService.userNameLogin]],
    });
    this.mchForm.patchValue({
      mobile_number: this.userDetailObj.mobile_number
    });
  }

  onSubmit() {
    this.userDetailObj.mobile_number = this.mchForm.value.mobile_number;
    this._auth.mchRegistration(this.userDetailObj).then(data => {
      
      const res = data.json();
      const userdetails = this._storage.get('userdetails');
      userdetails['roleType'] = res.roleType;

      this._storage.set('email', this.userDetailObj.user_name);
      this._storage.set('userdetails', res);
      this.userDetailObj = <IUserDetail>this._storage.get('userdetails')

      // setting the variable to check chat is open or not
      this._storage.set('chatOpen', true);

      // Calling the service to fetch secure chat login credentials.
      // In the service itself setting the value in session storage.
      if (res.roleType !== 'ADMIN') {
        this._auth.getSecureChatLoginDetails().then(res => {
          // Fetching the list of contacts for the secure chat.
          this.getListOfContactsForChat();
          // this._pubSub.Stream.emit(Client);
        });
      }
    });
  }


  getListOfContactsForChat() {
    this._auth.getListOfContactsForChat().then(data => {
      _.each(data.active_chat_user, (singleUser) => {
        singleUser.lastMessage = '';
        singleUser.messages = [];
        singleUser.unread = 0;
        singleUser.isTyping = '';
        singleUser.presence = 'UNAVAILABLE';
        singleUser.name_initials = singleUser.firstName.charAt(0) + singleUser.lastName.charAt(0);
        singleUser.active_user = '';
        singleUser.displayName = singleUser.firstName + ' ' + singleUser.lastName;
      });
      _.each(data.all_chat_user, (singleUser) => {
        singleUser.lastMessage = '';
        singleUser.messages = [];
        singleUser.unread = 0;
        singleUser.isTyping = '';
        singleUser.presence = 'UNAVAILABLE';
        singleUser.name_initials = singleUser.firstName.charAt(0) + singleUser.lastName.charAt(0);
        singleUser.active_user = '';
        singleUser.displayName = singleUser.firstName + ' ' + singleUser.lastName;
      });
      this.listOfAllContacts = data;
      // sorting the list of users based upon the last message received or send date.
      this.listOfAllContacts.active_chat_user = _.sortBy(this.listOfAllContacts.active_chat_user, 'updatedDate').reverse();
      // Calling the tigerText after fetching the list of users.
      const Client = this._chatService.getTigerTextClient();
      this._msgDataService.setTigerTextClient(Client);
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../../services';
import { ValidationService } from '../../../components/core/error-messages';
import { LocalStorageService } from 'angular-2-local-storage';
import { ChatService, PubSubService, MessagingDataService, TwilioService } from '../../../services';
import { APPLICATION_EXCEPTIONS_MESSAGES } from './../../../constants/exception-messges';
import { TIMEOUT } from './../../../config/timeouts';
import * as _ from 'lodash';
import { IChatUser } from '../../home/chat/model/chat.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [
    AuthenticationService,
    ChatService,
    TwilioService
  ]
})
export class LoginComponent implements OnInit {

  errorMessage: string;
  error_message: any;
  subscription: any;
  listOfAllContacts: any;

  // FormGroup Name is loginForm
  loginForm: FormGroup;
  idOfMessage: any;
  // Creating an instance of FormBuilder
  constructor(private _fb: FormBuilder, private _auth: AuthenticationService, private _storage: LocalStorageService,
    private _chatService: ChatService, private _pubSub: PubSubService, private _msgDataService: MessagingDataService,
    private _twilio: TwilioService) { }

  ngOnInit() {

    /** Check the status whether the user has been kicked out due to concurrent login */
    if (window.localStorage.getItem('concurrentSession')) {
      this.errorMessage = APPLICATION_EXCEPTIONS_MESSAGES.AUTH_MODULE.CONCURRENT_USER;
      setTimeout(() => {
        this.errorMessage = '';
        window.localStorage.clear();
      }, TIMEOUT.CONCURRENT);
    }

    if (window.localStorage.getItem('accessDenied')) {
      this.errorMessage = APPLICATION_EXCEPTIONS_MESSAGES.AUTH_MODULE.ACCESS_DENIED;
      setTimeout(() => {
        this.errorMessage = '';
        window.localStorage.clear();
      }, TIMEOUT.CONCURRENT);
    }

    /** Initialization of the loginForm with the validators and default values */
    this.loginForm = this._fb.group({
      'username': ['', [ValidationService.userNameLogin]],
      'password': ['', ValidationService.passwordLogin]
    });

    // patch user login id
    const userId = this._storage.get('email_id');
    this.loginForm.controls['username'].patchValue(userId);
  }

  /** onSubmit for calling in the Login Feature */
  onSubmit() {
    // this._chatService.getTigerTextClient();
    this.loginForm.value.login_type = 3;
    this._auth.login(this.loginForm.value).then(data => {
      this._storage.set('email', this.loginForm.value.username);
      // Calling the service to fetch secure chat login credentials.
      // In the service itself setting the value in session storage.
      if (data !== undefined) {
        if (data.error_message) {
          this.errorMessage = data.error_message;
        }
      } else {
        let userDetailObj: any;
        userDetailObj = this._storage.get('userdetails');
        if (userDetailObj.roleType !== 'ADMIN') {
          // setting the variable to check chat is open or not
          this._storage.set('chatOpen', true);
          this._auth.getSecureChatLoginDetails().then(res => {
            // Fetching the list of contacts for the secure chat.
            this.getListOfContactsForChat();
            // this._pubSub.Stream.emit(Client);
          });

        }
      }
    });
  }

  // Get the contact list for the secure chat.Once a user has logged in.
  getListOfContactsForChat() {
    this._auth.getListOfContactsForChat().then(data => {
      _.each(data.active_chat_user, (singleUser: IChatUser) => {
        singleUser.lastMessage = '';
        singleUser.messages = [];
        singleUser.unread = 0;
        singleUser.isTyping = '';
        singleUser.presence = 'UNAVAILABLE';
        singleUser.name_initials = singleUser.firstName.charAt(0) + singleUser.lastName.charAt(0);
        singleUser.active_user = '';
        singleUser.displayName = singleUser.firstName + ' ' + singleUser.lastName;
      });
      _.each(data.all_chat_user, (singleUser: IChatUser) => {
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

      // Calling the service to fetch the acces token TWILIO
      this._auth.getAccessTokenForChat().then(data => {
        // console.log('acces token');
        // console.log(data);
        let userChatObj: any;
        userChatObj = this._storage.get('userchatdetails');
        userChatObj.access_token = data.access_token;
        this._storage.set('userchatdetails', userChatObj);
        // calling the signIn method for twilio.
        this.signIntoTwilioChatClient(data);
      });

    });
  }
  // method for signing into the twilio chat client.
  signIntoTwilioChatClient(access_token_data: any): void {
    // intializing the chat client for the logged in user
    // by using the unique id and the access_token.
    let userChatObj: any;
    userChatObj = this._storage.get('userchatdetails');
    if (access_token_data.access_token !== null) {
      this._twilio.createChatClient(access_token_data);
      this._twilio.getTwilioClient().getSubscribedChannels().then((paginator) => {
        for (let i = 0; i < paginator.items.length; i++) {
          const channel = paginator.items[i];
          const splitChannelName = channel.uniqueName.split('_');
          let userNameOfContactInList;
          // console.log(splitChannelName);
          for (let j = 0; j < splitChannelName.length; j++) {
            if (splitChannelName[j] !== userChatObj.chatUserName) {
              userNameOfContactInList = splitChannelName[j];
            }
          }
          channel.getUnconsumedMessagesCount().then((data) => {
            _.forEach(this.listOfAllContacts.active_chat_user, (chatUser) => {
              if (chatUser.chatUserName === userNameOfContactInList) {
                chatUser.unread = data;
                var unreadCount = data;
                // console.log('chat user with unread....');
                //  console.log(chatUser);
                //  console.log(unreadCount);
                this._pubSub.Stream.emit(unreadCount);
              }
            });
          });
          this._msgDataService.setListOfData(this.listOfAllContacts);
        }
      });
      this._twilio.getTwilioClient().on('messageAdded', (message) => {
         this._storage.set('unreadCount', true);

      });
    }
  }

}

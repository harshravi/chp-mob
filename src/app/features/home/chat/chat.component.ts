import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import {
  PubSubService, MessagingDataService, ChatService, AuthenticationService, MessageEncodeUtilityService,
  DateUtilityService, TwilioService
} from '../../../services';
import { LocalStorageService } from 'angular-2-local-storage';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import * as _ from 'lodash';
import { ValidationService } from '../../../components/core/error-messages';
/** importing breadcrumb service to set breadcrumb */
import { BreadcrumbService } from '../../../services';
import { IChatUser, IEncryptionObj, IDecryptionObj, IPushNotificationObj, IMessageObj } from './model/chat.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [ChatService, AuthenticationService, LocalStorageService, MessageEncodeUtilityService, TwilioService]
})

export class ChatComponent implements OnInit, OnDestroy {

  // Refers to a formGroup and is being Declared as a FormGroup.
  form: FormGroup;
  chatBoxTitle = 'Messaging';
  subscription: any;
  noPadClassForComponent = 'no-padding';
  listOfContactsForChat: any;
  selectedUser: any;
  selectedUserMessages: any;
  messageInput = '';
  // tigerTextClient: any;
  tempListForSearch: any;
  listChatUsers: any = [];
  idOfMessage = '';
  userDetails: any;
  disableLoadMore = true;
  userChatObj: any;
  listOfAllContactsWithNoChat: any;
  search: any;
  highlightedPerson: number;
  openResponsiveUserList: boolean = false;
  isChatWindowOpenFlag = false;
  isDataLoading: boolean;
  // twilio related variables
  currentChannel: any;
  messages: any;
  listOfSubscribedChannels: any;
  messageAddedCallback: (msg: IMessageObj) => void;

  constructor(private _pubSub: PubSubService, private _msgDataService: MessagingDataService, private _dateTime: DateUtilityService,
    private _chatService: ChatService, private _auth: AuthenticationService, private _toasterService: ToasterService,
    private _storage: LocalStorageService, private _fb: FormBuilder, private _msgEncodeUtil: MessageEncodeUtilityService,
    private _breadcrumbService: BreadcrumbService, private _twilio: TwilioService) {

    this._twilio.initChatClient().then(() => {
      // console.log('Login Successful');
      // Get the List of Currently Subscribed Channels
      //console.log(data);
      this.getListOfSubscribedChannels();
      this.callMessagingEventHandlers();
      // Client method call for message being added to some other channel
      this.onMessageAddedClientMethod(this._twilio.getTwilioClient());
      let am = this._twilio.getTwilioAccessManager();
      am.on('tokenExpiring', () => {
        // console.log('should be called on token expiry');
        this._twilio.getAccessToken().subscribe(data => {
          // console.log('creating the client now');
          //  console.log(data);
          am.updateToken(data.access_token);
        });
      });
    }).catch(() => {
      // console.log('Login Unsuccessful. Please check if the server is running.')
    });
  }

  showUserList() {
    if (!this.openResponsiveUserList) {
      this.openResponsiveUserList = true;
    } else {
      this.openResponsiveUserList = false;
    }
  }

  ngOnInit() {
    this._breadcrumbService.setBreadcrumbs('Chat', null);
    this.userChatObj = this._storage.get('userchatdetails');
    this._storage.set('chatOpen', false);
    this._pubSub.Stream.emit(this.isChatWindowOpenFlag);
    this.form = this._fb.group({
      'message_input': ['', [ValidationService.userNameLogin]],
    });
    this._pubSub.Stream.subscribe(message => {
      this.scrollToBottom();
    });
    // check whether client exists or not.
    if (!this._msgDataService.getTigerTextClient()) {
      // Calling in all the services to fetch the details related to tigerText.
      // It executes in the condition when application is refreshed. SO as to load the messages again.
      // this.tigerTextClient = this._chatService.getTigerTextClient();
      this.getTheListOfContacts();

    } else {
      this.listOfContactsForChat = this._msgDataService.getListOfData();
      // this.tempListForSearch = this.listOfContactsForChat;
      this.tempListForSearch = Object.assign({}, this.listOfContactsForChat);
      this.listChatUsers = this.listOfContactsForChat;
    }
  }

  // search the list of contacts.
  updateFilter(event) {
    let val = null;
    val = event.target.value.toLowerCase();
    // Filter our data with respect to the search type
    if (this.listOfContactsForChat) {
      const active_chat_user = this.tempListForSearch.active_chat_user;
      const all_chat_user = this.tempListForSearch.all_chat_user;
      const data = active_chat_user.filter(function (d) {
        if (d.displayName) {
          return d.displayName.toLowerCase().indexOf(val) !== -1 || !val;
        }
      });
      const dataForAll = all_chat_user.filter(function (d) {
        if (d.displayName) {
          return d.displayName.toLowerCase().indexOf(val) !== -1 || !val;
        }
      });
      if (data.length === 0) {
        // do nothing
        // this.listChatUsers.active_chat_user = this.tempListForSearch.active_chat_user;
        if (val !== '') {
          this.listChatUsers.active_chat_user = data;
        }
      } else {
        _.each(data, (item) => {
          if (item.active_user === 'tempActive') {
            item.active_user = '';
          } else {
            item.active_user = 'tempActive';
          }
        });
        this.listChatUsers.active_chat_user = data;
      }
      if (dataForAll.length === 0) {
        this.listOfAllContactsWithNoChat = dataForAll;
      } else if (dataForAll.length === this.tempListForSearch.all_chat_user.length) {
        this.listOfAllContactsWithNoChat = undefined;
      } else {
        this.listOfAllContactsWithNoChat = dataForAll;
      }
    }
  }
  // get the list of contacts with whom a physician can chat
  getTheListOfContacts() {
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
        singleUser.isChatOpen = false;
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
        singleUser.isChatOpen = false;
      });

      this.listOfContactsForChat = data;
      // sorting the list of users based upon the last message received or send date.
      this.listOfContactsForChat.active_chat_user = _.sortBy(this.listOfContactsForChat.active_chat_user, 'updatedDate').reverse();
      // this.tempListForSearch = this.listOfContactsForChat;
      this.tempListForSearch = Object.assign({}, this.listOfContactsForChat);
      this.listChatUsers = this.listOfContactsForChat;
    });
  }

  /**
   * to send message when user hits enter from keyboard.
   * shift + enter for new line character.
   */
  onKeyUpForChat(event) {
    // const tempMessage;
    if (event.keyCode === 13 && !event.shiftKey) {
      const temp = {
        message_input: event.target.value
      };
      this.sendMessageTwilio(temp);
    } else if (event.keyCode === 13 && event.shiftKey) {
      // event.target.value += "<br/>";
    }
    // if(event.keyCode == 13 && !event.shiftKey)
  }

  /**
   * highlights the row which is having unread messages
   */
  getSelectedClass(unread) {
    if (unread > 0) {
      return 'active';
    } else {
      return '';
    }
  }

  /**
   * method to scroll to bottom of the chat window.
   * using timeout and javascript to move scroll down to bottom
   * We might change it once plugin is used for scrolling
   */
  scrollToBottom() {
    // console.log('calling the scroll');
    setTimeout(() => {
      const chatD = document.getElementById('chatBox');
      //console.log(document.getElementById('chatBox').scrollHeight) ;
      if (chatD) {
        // document.getElementById('chatBox').style.background ="red";
        const r = document.getElementById('chatBox');
        // r.scrollTop = 5300;
        r.scrollTop = r.scrollHeight;

      }
    }, 1000);
  }

  ngOnDestroy() {
    // When user moves out from chat then clearing the chat token stored in the local storage.
    this._storage.set('selectedChatUser', null);
    this._storage.set('chatOpen', true);
    this.isChatWindowOpenFlag = true;
    var tempUnread = false;
    // marking the values of isChatOpen again to false
    if (this.listOfContactsForChat) {
      _.each(this.listOfContactsForChat.active_chat_user, (item) => {
        if (item.isChatOpen) {
          item.isChatOpen = false;
        } else if (item.unread > 0) {
          tempUnread = true;
        }
      });
    }
    if (tempUnread) {
      this._storage.set('unreadCount', true);
    } else {
      this._storage.set('unreadCount', false);
    }

   // this._pubSub.Stream.emit(this.isChatWindowOpenFlag);
  }

  toggleHighlight(newValue: number) {
    this.highlightedPerson = newValue;

  }

  // Create a channel if clicked on for the first time to initailize chat.
  // If chat has already been present then just load that particular channel and its messages

  createOrJoinChatChannel(userObj) {
    /* Get a unique channel name. This name might be existing 
     * and can be already there in place or this might not be
     * existant and one needs to create this out. So anyways
     * you need this channel. */

    // Remove the already created listeners if any.
    // Stops duplicating of messages
    if (this.currentChannel) {
      this.currentChannel.removeListener('messageAdded', this.messageAddedCallback);
    }
    // to open the mobile view for the responsive chat user list
    if (this.openResponsiveUserList) {
      this.openResponsiveUserList = false;
    }
    if (userObj.chatUserName == null) {
      this._toasterService.pop('error', 'Error', 'User not registered cannot initiate chat');
    } else {
      this.moveNewUserToActiveChatList(userObj);
      // setting the load more flag to true.
      this.disableLoadMore = true;
      // setting the name of the selected user in Messaging Title
      this.chatBoxTitle = userObj.displayName;
      var uniqueName = userObj.chatUserName;
      var friendlyName = userObj.displayName;
      let channelUniqueName = this.getUniqueChannelName(uniqueName, this._twilio.getUserInfo().identity);
      /**
       * Assinging the messages after apply date wise sorting.
       */
      this.selectedUserMessages = _.find(this.listOfContactsForChat.active_chat_user, { chatUserName: uniqueName });
      this._twilio.getSubscribedChannels()
        .then(this._twilio.getChannelByUniqueName(channelUniqueName)
          .then(channel => {
            // console.log(channel);
            // If the channel Already Exists Please Join the Channel
            this.joinChannel(channel);
          })
          .catch(err => {
            //  console.log('Channel Does not exist Creating one');
            /**
             * If the Channel does not Exist then Create one and then Join it out.
             */
            // Create a new Channel for the 
            this._twilio.createChannel(channelUniqueName, friendlyName)
              .then(channel => {
                //  console.log('Channel ' + channel.uniqueName + ' ' + channel.friendlyName + ' created Successfully');
                this.joinChannel(channel);

                // Lets invite the other party to join the channel
                //  console.log('inviting user');
                this.inviteToChannel(channel, uniqueName);
              })
              .catch(err => {
                //   console.log('Error in new channel creation' + err);
              });
          }))
        .catch(err => {
          //  console.log('Error in Subscribed List')
        });
    }

  }

  /**
   * This method helps to generate the channel name that is being used in order
   * to make a conversation. This will be unique in the entire system. We can
   * also replace this with some unique ID if required.
   * 
   * @param uniqueName uniqueIdentity of the User with whome you want to chat
   * @param currentUserUniqueIdentity uniqueIdentity of the User who is logged in/current user
   */
  getUniqueChannelName(uniqueName: string, currentUserUniqueIdentity: string): string {
    return [uniqueName, currentUserUniqueIdentity].sort().join('_');
  }

  /**
  * Join a Specific Channel. This is refactored Code.
  * @param channel channel Object
  */
  joinChannel(channel: any): void {
    channel.join().then((channel) => {
      this.setCurrentChannel(channel);
      //  console.log('Joined Channel' + channel.uniqueName + ' ' + channel.friendlyName + ' Successfully');
      this.selectedUserMessages.channelUniqueName = channel.uniqueName;
      // Start the Event Listener in this Channel
      this.onMessageAddedToChannel(channel);
      // Get the most Recent Messages on Joining the Channel
      this.getMostRecentMessage();
    }).catch();
  }

  joinChannelAfterLogin(channel: any): void {
    channel.join().then((channel) => {
      // this.setCurrentChannel(channel);
      //  console.log('Joined Channel' + channel.uniqueName + ' ' + channel.friendlyName + ' Successfully');
      // this.selectedUserMessages.channelUniqueName = channel.uniqueName;
      // Start the Event Listener in this Channel
      // this.onMessageAddedToChannel(channel);
      this.messageAddedCallback = (msg) => {
        // console.log(msg);
        //this.listenForMemberUpdateEvents();
        var decrypObj: IDecryptionObj = {
          message_sender_id: '',
          message_sender_full_name: '',
          channel_name: '',
          message_sent_date: '',
          message_receiver_id: '',
          message_receiver_full_name: '',
          message_content: '',
          message_ref_ids: [msg.body]
        }
        // decryption of messages.
        this._chatService.messageDecryptionForTwilio(decrypObj).then(data => {
          // putting the incoming messages into partcular user.
          // console.log(msg.channel.uniqueName);
          _.each(data, (item) => {
            msg.decryptedBody = item.message_content;
            // if (item.message_sender_id === userChatObj.chatUserName) {
            //   msg.direction = 'OUTGOING';
            //   msg.recipientStatus = 'DELIVERED';
            // } else {
            //   msg.direction = 'INCOMING';
            // }
          })
          // console.log(msg);
        })

      }
      channel.on('messageAdded', this.messageAddedCallback);
    })
  }

  onMessageAddedToChannel(client): void {
    let userChatObj: any;
    userChatObj = this._storage.get('userchatdetails');
    // console.log('listener added')
    this.messageAddedCallback = (msg) => {
      //console.log(msg);
      this.listenForMemberUpdateEvents();
      var decrypObj: IDecryptionObj = {
        message_sender_id: '',
        message_sender_full_name: '',
        channel_name: '',
        message_sent_date: '',
        message_receiver_id: '',
        message_receiver_full_name: '',
        message_content: '',
        message_ref_ids: [msg.body]
      }
      // decryption of messages.
      this._chatService.messageDecryptionForTwilio(decrypObj).then(data => {
        // putting the incoming messages into partcular user.
        // console.log(msg.channel.uniqueName);
        _.each(data, (item) => {
          msg.decryptedBody = item.message_content;
          if (item.message_sender_id === userChatObj.chatUserName) {
            msg.direction = 'OUTGOING';
            msg.recipientStatus = 'DELIVERED';
            // while sent messages are received there marking all as read for the user.
            // settingt the count to zero.
            this.currentChannel.setAllMessagesConsumed();
            this.selectedUserMessages.unread = 0;
          } else {
            msg.direction = 'INCOMING';
          }
          if (this.selectedUserMessages.messages.length !== 0) {
            if (this.selectedUserMessages.messages[this.selectedUserMessages.messages.length - 1].createdDate != null &&
              this.selectedUserMessages.messages[this.selectedUserMessages.messages.length - 1].createdDate
              !== moment(new Date()).format('MM/DD/YYYY')) {
              msg.createdDate = moment(msg.timestamp).format('MM/DD/YYYY');
            } else {
              for (let i = this.selectedUserMessages.messages.length - 1; i > 0; i--) {
                if (this.selectedUserMessages.messages[i].createdDate == null) {
                  // console.log('do not anything value is already null');
                  /**
                   * Empty if as we are just looping through the messages to take out the value which is not null.
                   */
                } else {
                  msg.createdDate = null;
                }
              }
            }
          } else {
            // there are no messages in the chat.
            // to show the date as label when a message is send
            msg.createdDate = moment(new Date()).format('MM/DD/YYYY');
          }
          if (msg.channel.uniqueName.includes(this.selectedUserMessages.chatUserName)) {
            //  console.log('msg fr the current channel');
            this.selectedUserMessages.messages.push(msg);
            // putting the message received/send as the last message in the conversation.
            this.selectedUserMessages.messageContent = msg.decryptedBody;
            this.selectedUserMessages.updatedDate = msg.timestamp;
          } else {
            //  console.log('msg for different channel');
            _.forEach(this.listChatUsers.active_chat_user, (user) => {
              if (msg.channel.uniqueName.includes(user.chatUserName)) {
                user.messageContent = msg.decryptedBody;
                user.updatedDate = msg.timestamp;
                user.unread = 1; // making it as 1 to show the row highlighted. It can be any non-zero value
                user.messageContent = msg.decryptedBody;
              }
            });
          }
          // calling the method to sort the list of users.
          this.sortingTheContactListOnMessageReceived();
          /**
           * timeout for moving the scroll once all the mesages are loaded on the screen
           */
          this.scrollToBottom();
          this.listenForMemberUpdateEvents();
        });
      });
    }
    client.on('messageAdded', this.messageAddedCallback);
  }
  getMostRecentMessage(): void {
    this.selectedUserMessages.messages = []; // clearing the list of selected user. To clear of the previous data
    let userChatObj: any;
    userChatObj = this._storage.get('userchatdetails');
    this.dataLoadingStarted();
    this.currentChannel.getMessages(20).then((messages) => {
      var totalMessages = messages.items.length;
      var uIdForDecryption = [];
      for (let i = 0; i < totalMessages; i++) {
        var message = messages.items[i]
        uIdForDecryption.push(message.body);
      }
      var decrypObj: IDecryptionObj = {
        message_sender_id: '',
        message_sender_full_name: '',
        channel_name: '',
        message_sent_date: '',
        message_receiver_id: '',
        message_receiver_full_name: '',
        message_content: '',
        message_ref_ids: uIdForDecryption
      }
      this.dataLoadingCompleted();
      // decryption of messages.
      let tempArrForDecryptedMsgs = [];
      if (totalMessages > 0) {
        this._chatService.messageDecryptionForTwilio(decrypObj).then(data => {
          // console.log(data.message_content);
          // putting the incoming messages into partcular user.
          this.dataLoadingCompleted();
          _.each(data, (item) => {
            //  console.log(item);
            tempArrForDecryptedMsgs.push(item);
          });
          for (let i = 0; i < totalMessages; i++) {
            var message = messages.items[i];
            for (let j = 0; j < tempArrForDecryptedMsgs.length; j++) {
              if (message.body === tempArrForDecryptedMsgs[j].message_ref_id) {
                message.decryptedBody = tempArrForDecryptedMsgs[j].message_content;
              }
            }
            //  console.log(message);
            // console.log('Author:' + message.author + ' ------------- ' + message.body);
            // putting the direction of messages.
            message.createdDate = moment(message.timestamp).format('MM/DD/YYYY');
            if (message.author === userChatObj.chatUserName) {
              message.direction = 'OUTGOING';
              message.recipientStatus = 'READ';
            } else {
              message.direction = 'INCOMING';
            }
            if (message.direction === 'INCOMING' && message.createdDate === moment(new Date()).format('MM/DD/YYYY')) {
              // console.log('coming in type incoming date same as todays date')
              message.createdDate = null;
            }
            this.selectedUserMessages.messages.push(message);
          }
          // console.log('Total Messages:' + totalMessages);
          // calling the method to put the date label to group the messages date wise accordingly
          this.putDateLabelForLoadedConversation();
          /***
           * For marking all the messages read Once the channel is loaded.
           *In Twilio
           */
          // console.log('marking all read in twilio');
          this.currentChannel.setAllMessagesConsumed();
          this.selectedUserMessages.unread = 0;
          // console.log(this.selectedUserMessages);
          /**
            * timeout for moving the scroll once all the mesages are loaded on the screen
            */
          this.scrollToBottom();
        }, (error) => {
          this.dataLoadingCompleted();
        });
      }
    });
  }

  /**
   * This function helps in order to invite a user to a channel.
   * Since in our case all the users are already prelisted this will
   * help to invite each other and start a conversation.
   * @param channel Channel Object used to invite a user.
   */
  inviteToChannel(channel: any, uniqueName: string): void {
    channel.invite(uniqueName).then(function () {
      // console.log('Your friend ' + uniqueName + ' has been invited!');
    });
  }

  sendMessageTwilio(messageBody): void {
    // debugger;
    this.form.reset();
    var userDetailObj: any;
    userDetailObj = this._storage.get('userdetails');
    var encrypObj: IEncryptionObj = {
      message_sender_id: this.userChatObj.chatUserName,
      message_sender_full_name: userDetailObj.first_name + ' ' + userDetailObj.last_name,
      channel_name: this.selectedUserMessages.channelUniqueName,
      message_sent_date: new Date(),
      message_receiver_id: this.selectedUserMessages.chatUserName,
      message_receiver_full_name: this.selectedUserMessages.displayName,
      message_content: messageBody.message_input
    };
    // console.log(encrypObj);
    this._chatService.messageEncryptionForTwilio(encrypObj).then(data => {
      //  console.log(data);
      this.currentChannel.sendMessage(data.message_ref_id).then(msg => {
        //    console.log(msg + ' --> SENT SUCCESSFULLY');
      });
    });
    // Send push notifications whenever a message is being sent.
    this.sendPushNotification(userDetailObj);
  }
  /**
   * All the different event Handlers can be a part of this function.
   * Rather keep this function at the bottom of the page so that one can 
   * Easily manipulate this section and see the changes that are made to
   * this particular section.
   * 
   * NOTE All the utilities that belong to these Event Listeners should be a part
   * of the block mentioned below.
   */
  callMessagingEventHandlers(): void {

    // ONLY FOR DEV
    // This is called whenever a new channel is added.
    // This is for the Development purpose only
    this._twilio.getTwilioClient().on('channelAdded', (channel) => {
      this.getListOfSubscribedChannels();
    });

    // In order to make the logged in use to Join the Private Channels
    // that he is being invited to
    this._twilio.getTwilioClient().on('channelInvited', (channel) => {
      channel.join().then(channel => {
        // console.log("I have joined the channel " + channel.friendlyName);
        // Since this is automated Join We must update Current Channel
        this.setCurrentChannel(channel);
        // Call the message Listeners to this channel
        this.onMessageAddedToChannel(channel);
      }).catch(err => console.log(err));
    })
    this._twilio.getTwilioClient().getSubscribedChannels().then((paginator) => {
      for (let i = 0; i < paginator.items.length; i++) {
        const channel = paginator.items[i];
        // console.log('Channel: ' + channel.friendlyName);
        //  console.log(channel.uniqueName);
        const splitChannelName = channel.uniqueName.split('_');
        let userNameOfContactInList;
        //   console.log(splitChannelName);
        for (let j = 0; j < splitChannelName.length; j++) {
          if (splitChannelName[j] !== this.userChatObj.chatUserName) {
            userNameOfContactInList = splitChannelName[j];
          }
        }
        channel.getUnconsumedMessagesCount().then((data) => {
          //   console.log(data + "******************************");
          _.forEach(this.listChatUsers.active_chat_user, (chatUser) => {
            if (chatUser.chatUserName === userNameOfContactInList) {
              chatUser.unread = data;
            }
          });
        });

        // console.log(this.listChatUsers);
      }
    });
    // currently active channel in the UI
    // this.currentChannel.on('memberUpdated', (member) => {
    //   // note this method would use the provided information
    //   // to render this to the user in some way        
    //  // console.log('member updated.......... event handler');
    //   // console.log(member.identity + member.lastConsumedMessageIndex + member.lastConsumptionTimestamp);
    //   // console.log(this.selectedUserMessages);
    //   // console.log('calling status update from member updated');
    //   this.updateMessageReadStatus(member.identity, member.lastConsumedMessageIndex, member.lastConsumptionTimestamp);
    // });

    this._twilio.getTwilioClient().on('channelUpdated', (data) => {
      // console.log('channel updateddddddddd')
      // console.log(data);
    });
  }

  /**
   * Helps you to get the list of the Subscribed Channels by the User
   */
  getListOfSubscribedChannels(): void {
    this._twilio.getSubscribedChannels().then((paginator) => {
      this.listOfSubscribedChannels = paginator.items;
      //console.log(paginator.items)
      //  for (var i=0; i< paginator.items.length; i++) {
      //    console.log(paginator.items[i].friendlyName);
      //    var channel = paginator.items[i];
      //    //this.joinChannelAfterLogin(channel);
      //  }
    }).catch((err) => {
      console.log(err);
    });
    // console.log(this.listOfSubscribedChannels);
  }
  setCurrentChannel(channel: any): void {
    this.currentChannel = channel;
    this.listenForMemberUpdateEvents();
  }

  putDateLabelForLoadedConversation(): void {
    if (this.selectedUserMessages.messages.length !== 0) {
      let firstMsgCreatedDate = this.selectedUserMessages.messages[0].createdDate;
      for (let i = 1; i < this.selectedUserMessages.messages.length; i++) {
        if (this.selectedUserMessages.messages[i].createdDate === firstMsgCreatedDate) {
          this.selectedUserMessages.messages[i].createdDate = null;
        } // else if (this.selectedUserMessages.messages[i].direction === 'INCOMING' &&
        //   this.selectedUserMessages.messages[i].createdDate === null) {
        //   // go here and do nothing
        //   // this.selectedUserMessages.messages[i].createdDate = firstMsgCreatedDate;
        // }
        else {
          firstMsgCreatedDate = this.selectedUserMessages.messages[i].createdDate;
        }
      }
    }
    // console.log(this.selectedUserMessages);
  }
  listenForMemberUpdateEvents(): void {
    // console.log('listen for member updates called ....');
    // retrieve the list of members for the active channel
    if (this.currentChannel) {
      var members = this.currentChannel.getMembers();
      //determine the newest message index
      var newestMessageIndex;
      if (this.selectedUserMessages.messages.length > 0) {
        //  console.log('finding newest message index');
        newestMessageIndex = this.selectedUserMessages.messages[this.selectedUserMessages.messages.length - 1].index;
        //  console.log(newestMessageIndex);
      } else {
        newestMessageIndex = 0; // review this code , cant put it as zero
      }
      // console.log('newestMessageIndex' + newestMessageIndex);
      //  console.log('lastconsumedmssage' + this.currentChannel.lastConsumedMessageIndex);
      //check if we we need to set the consumption horizon
      if (this.currentChannel.lastConsumedMessageIndex !== newestMessageIndex) {
        //  console.log('updating the last consumed message index');
        // console.log('updating status...')
        this.currentChannel.updateLastConsumedMessageIndex(newestMessageIndex);
      }
      // for each member, set up a listener for when the member is updated
      members.then((currentMembers) => {
        currentMembers.forEach((member) => {
          // handle the read status information for this member
          // note this method would use the provided information 
          // to render this to the user in some way
          // console.log(member.identity + member.lastConsumedMessageIndex + member.lastConsumptionTimestamp);
          // console.log('calling status update from currentMembers');
          this.updateMessageReadStatus(member.identity, member.lastConsumedMessageIndex, member.lastConsumptionTimestamp);
        });
      });

      // this code assumes you have a variable names activeChannel for the
      // currently active channel in the UI
      this.currentChannel.on('memberUpdated', (member) => {
        //  console.log('member udpated ....');
        // note this method would use the provided information
        // to render this to the user in some way        
        // console.log('member updated..........');
        // console.log(member.identity + member.lastConsumedMessageIndex + member.lastConsumptionTimestamp);
        // console.log(this.selectedUserMessages);
        // console.log('calling status update from member updated');
        this.updateMessageReadStatus(member.identity, member.lastConsumedMessageIndex, member.lastConsumptionTimestamp);
      });
    }

  }

  updateMessageReadStatus(identity, lastConsumedMessageIndex, lastConsumptionTimestamp): void {
    if (identity === this.selectedUserMessages.chatUserName) {
      // console.log('status updated for this user messags only');
      _.each(this.selectedUserMessages.messages, (message) => {
        if (message.index <= lastConsumedMessageIndex && message.recipientStatus === 'DELIVERED') {
          //   console.log('making it as read');
          message.recipientStatus = 'READ';
        }
      });
    }
  }
  /**
   * MASTER DELETE
   */
  deleteAll(): void {
    this._twilio.getSubscribedChannels().then(paginator => {
      // console.log('INTO MASTER DELETE ------------------')
      for (let i = 0; i < paginator.items.length; i++) {
        paginator.items[i].delete()
          .then(console.log('Channel: ' + paginator.items[i].friendlyName))
          .catch(err => console.log(err))

      }
    });
  }

  // Send Push notifications for the every sent message.
  sendPushNotification(userDetails): void {
    // Push notifaction service
    const obj = {
      reference_id: this.selectedUserMessages.id,
      ref_type: '2',
      title: 'New Message',
      body: 'New message from ' + userDetails.first_name + ' ' + userDetails.last_name,
      param1: 'TigerTextNotification'
    };
    this._chatService.sendPushNotificationForMessages(obj).then(res => {

    });
  }

  /**
   * Search a new user and click on it. So at that point the user should be
   *  moved to active chat user list.
   * Active chat user list is the list of users visible in the UI.
   * */
  moveNewUserToActiveChatList(userObj): void {
    let flagForMovingContactToActive = true;
    // check whether the selected user exsists on the acitve chat user list
    _.each(this.listChatUsers.active_chat_user, (data) => {
      if (data.chatUserName === userObj.chatUserName) {
        flagForMovingContactToActive = false;
        data.isChatOpen = true; // marking the chat open flag to true for the selected user and rest to be set as false;
      } else {
        data.isChatOpen = false;
      }
    });
    // that means the user has no previous text messages.
    // he was not available in the active user list.
    // move the user in the active chat users list.
    if (flagForMovingContactToActive) {
      this.listChatUsers.active_chat_user.push(userObj);
      this.tempListForSearch.active_chat_user.push(userObj);
      // setting the user in the main active chat users list
      this._msgDataService.setListOfData(this.listChatUsers);
      this.listOfAllContactsWithNoChat = undefined;
      // this.search = "";
    }
  }

  /**
   * Algo for sorting the contact list. will change in future
   */
  sortingTheContactListOnMessageReceived(): void {
    let clonedCopyOfList = [];
    clonedCopyOfList = this.listChatUsers.active_chat_user;
    const sortedArry = [];
    if (typeof _.find(this.listChatUsers.active_chat_user, ['isChatOpen', true]) !== 'undefined') {
      sortedArry.push(_.find(this.listChatUsers.active_chat_user, ['isChatOpen', true]));
    }
    // pushing the users having some unread count
    _.each(clonedCopyOfList, (item) => {
      if (item.isChatOpen) {
        // do nothing
        // there will be no unread messages as the users chat is already open
      } else if (item.unread > 0) {
        sortedArry.push(item);
      }
    });
    // pushing the users at the last of the list as they dont have any unread;
    _.each(clonedCopyOfList, (item) => {
      if (item.isChatOpen) {
        // do nothing
        // there will be no unread messages as the users chat is already open
      } else if (item.unread == 0) {
        sortedArry.push(item);
      }
    });
    const listOfRestUsers = _.differenceBy(clonedCopyOfList, sortedArry, 'token');
    this.listChatUsers.active_chat_user = sortedArry.concat(listOfRestUsers);
  }

  // load older messages from twilio. Not using the archived services.

  loadOlderMessages(): void {
    let userChatObj: any;
    //this.disableLoadMore = true;
    userChatObj = this._storage.get('userchatdetails');
    // get the old height of the chatscreen for scrolling down.
    const oldHeight = document.getElementById('chatBox').scrollHeight;
    // index value of the first message received from twilio.
    const index = this.selectedUserMessages.messages[0].index;
    const uIdForDecryption = [];
    let totalMessages = 0;
    this.currentChannel.getMessages(10, index - 1).then((messagesPage) => {
      totalMessages = messagesPage.items.length;
      messagesPage.items.forEach(message => {
        uIdForDecryption.push(message.body);
      });
      const decrypObj: IDecryptionObj = {
        message_sender_id: '',
        message_sender_full_name: '',
        channel_name: '',
        message_sent_date: '',
        message_receiver_id: '',
        message_receiver_full_name: '',
        message_content: '',
        message_ref_ids: uIdForDecryption
      };
      // decryption of messages.
      const tempArrForDecryptedMsgs = [];
      if (totalMessages > 0) {
        this._chatService.messageDecryptionForTwilio(decrypObj).then(data => {
          // console.log(data.message_content);
          // putting the incoming messages into partcular user.
          _.each(data, (item) => {
            //console.log(item);
            tempArrForDecryptedMsgs.push(item);
          });
          for (let i = 0; i < totalMessages; i++) {
            var message = messagesPage.items[i];
            for (let j = 0; j < tempArrForDecryptedMsgs.length; j++) {
              if (message.body === tempArrForDecryptedMsgs[j].message_ref_id) {
                message.decryptedBody = tempArrForDecryptedMsgs[j].message_content;
              }
            }
            // adding a temp variable in message for sorting purposes.
            // to sort the loaded message as per the timestamp.
            message.timeStampForSorting = message.timestamp;
            //console.log('Author:' + message.author + ' ------------- ' + message.body);
            // putting the direction of messages.
            message.createdDate = moment(message.timestamp).format('MM/DD/YYYY');
            if (message.author === userChatObj.chatUserName) {
              message.direction = 'OUTGOING';
              message.recipientStatus = 'READ';
            } else {
              message.direction = 'INCOMING';
            }
            if (message.direction === 'INCOMING' && message.createdDate === moment(new Date()).format('MM/DD/YYYY')) {
              // console.log('coming in type incoming date same as todays date')
              message.createdDate = null;
            }
            this.selectedUserMessages.messages.push(message);
          }
          // applying sorting of all the messages after loading the messages.
          this.selectedUserMessages.messages = _.sortBy(this.selectedUserMessages.messages, 'timeStampForSorting');
          // putting the date labels on the messages loaded.
          this.putDateLabelForLoadedConversation();
          setTimeout(() => {
            const newHeight = document.getElementById('chatBox').scrollHeight;
            const resultHeight = newHeight - oldHeight;
            document.getElementById('chatBox').scrollTop = resultHeight;

          }, 1000);
        });
      } else {
        // console.log('no more messages to be loaded');
        this.disableLoadMore = false;
      }
    });
  }

  dataLoadingStarted(): void {
    this.isDataLoading = true;
  }

  dataLoadingCompleted(): void {
    this.isDataLoading = false;
  }

  // Event listener to be called when a message is added to some other channel.
  // Other Channel specifies the channels apart from the current channel.
  onMessageAddedClientMethod(client) {
    // console.log('the client method for message being added');
    client.on('messageAdded', (message) => {
      //  console.log('there is a message in some other channel');
      // console.log(message.channel.uniqueName);
      const decrypObj: IDecryptionObj = {
        message_sender_id: '',
        message_sender_full_name: '',
        channel_name: '',
        message_sent_date: '',
        message_receiver_id: '',
        message_receiver_full_name: '',
        message_content: '',
        message_ref_ids: [message.body]
      };
      _.forEach(this.listChatUsers.active_chat_user, (user) => {
        //console.log(user);
        if (message.channel.uniqueName.includes(user.chatUserName)) {
          // console.log('message came for' + user.displayName);
          this._chatService.messageDecryptionForTwilio(decrypObj).then(data => {
            // console.log(data.message_content);
            // putting the incoming messages into partcular user.
            _.each(data, (item) => {
              user.messageContent = item.message_content;
              user.unread = 1;
            });
          });
        }
      });
    });
  }

}

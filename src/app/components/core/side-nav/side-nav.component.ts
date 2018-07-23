
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChange, AfterViewChecked, DoCheck } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { GlobalSettingsModalContext, GlobalSettingsComponent } from '../../../features/home/global-modal/global-settings';
import { CustomModalContext, AddAccountModalComponent } from '../../../features/home/global-modal/add-account';
import { CustomAddRoleModalContext, AddRoleModalComponent } from '../../../features/home/global-modal/add-role';
import { CustomInviteUserModalContext, InviteUserModalComponent } from '../../../features/home/global-modal/invite-user';
import { GlobalSettingsService } from '../../../features/home/global-modal/global-settings/global-settings.service';
import { AuthenticationService } from '../../../services/Authentication/authentication.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { PubSubService } from '../../../services/PubSubService/pub-sub.service';
import { MessagingDataService } from '../../../services/MessagingDataService/messaging-data.service';

declare var jQuery: any;
import * as _ from 'lodash';
@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  providers: [GlobalSettingsService, AuthenticationService]
})

export class SideNavComponent implements OnInit, AfterViewInit, OnChanges, AfterViewChecked, DoCheck {
  @ViewChild('sideMenu')
  private sideMenu: ElementRef;

  userObject: any;
  showUnreadMsgIndicator = false;
  // Flag to disable the link, during modal opening to not allow multiple clicks.
  disableViewSettingsLink = false;
  tempListOfConversation: any;
  countOfUnreadMessages = 0;
  chatWindowOpenFlag: Boolean;

  // To match url to make active home in side nav
  currentUrl = false;
  constructor(private _modal: Modal, private _globalSettingService: GlobalSettingsService,
    private _auth: AuthenticationService, private _storage: LocalStorageService, private _pubSub: PubSubService,
    private _msgDataService: MessagingDataService, private _router: Router) {
    this._router.events.subscribe(event => {
      const url = event['url'];
      const componentName = url.split('/');
      if (componentName[2] === 'participant-dashboard') {
        this.currentUrl = true;
      } else {
        this.currentUrl = false;
      }
    });
  }
  ngOnInit() {
    this.userObject = this._storage.get('userdetails');
    this.chatWindowOpenFlag = <Boolean>this._storage.get('chatOpen');
    this._pubSub.Stream.subscribe(isChatWindowOpenFlag => {
      this.chatWindowOpenFlag = <Boolean>this._storage.get('chatOpen');
    });
    let tempFlag = false;
    this._pubSub.Stream.subscribe(unreadCount => {
     // console.log('coming in pub sub for twilioo');
     // console.log(unreadCount);
      if (unreadCount > 0) {
        this.showUnreadMsgIndicator = true;
        tempFlag = true;
        return;
      } else {
        if (!tempFlag) {
          this.showUnreadMsgIndicator = false;
        }
      }
    });
  }

  ngAfterViewInit() {
    jQuery(this.sideMenu.nativeElement).metisMenu();
  }

  ngAfterViewChecked() {
    const ele = jQuery(this.sideMenu.nativeElement);
    ele.metisMenu();
  }

  /** Open the New Account Addition Modal */
  openGlobalSettingsModal() {
    this.disableViewSettingsLink = true;
    /** Get the global Settings data to prepopulate the options */
    this._globalSettingService.getGlobalSettings().then(data => {
      this._modal.open(GlobalSettingsComponent, overlayConfigFactory({
        edit: false, globalSettingsData:
        { data: data }
      }, GlobalSettingsModalContext));
      this.disableViewSettingsLink = false;
    }, error => {
      // If error occurs in opening modal. Making the flag enable again so that link is active again.
      this.disableViewSettingsLink = false;
    });
  }

  openClientAddModle() {
    this._modal.open(AddAccountModalComponent, overlayConfigFactory({ edit: false }, CustomModalContext));
  }

  /** onClick for calling in the Logout Feature */
  onLogout() {
    this._auth.logout();
  }

  openAddRoleModal() {
    this._modal.open(AddRoleModalComponent, overlayConfigFactory({ edit: false }, CustomAddRoleModalContext));
  }

  openInviteUserModal() {
    this._modal.open(InviteUserModalComponent, overlayConfigFactory({ edit: false }, CustomInviteUserModalContext));
  }
  goTohome() {
    this._router.navigate(['/home']);
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
  }

  ngDoCheck() {
    this.chatWindowOpenFlag = <Boolean>this._storage.get('chatOpen');
    this.showUnreadMsgIndicator = <boolean>this._storage.get('unreadCount');
  }
}

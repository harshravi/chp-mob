import { Component, OnInit } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { PrivacyPolicyModalContext } from './privacy-policy-context';
import { LocalStorageService } from 'angular-2-local-storage';
import { GlobalEventEmitterService } from '../../../../services/EventEmitter/global-event-emitter.service';
import { EventLogTypeEnum, EventLogType } from '../../../../models/common.model';
import { DateUtilityService } from '../../../../services';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit, CloseGuard, ModalComponent<PrivacyPolicyModalContext>{
  context: PrivacyPolicyModalContext;

  privacyPolicySettingsData: string;

  constructor(public dialog: DialogRef<PrivacyPolicyModalContext>, private _storage: LocalStorageService,
    private _globalEventEmitterService: GlobalEventEmitterService, public _dateUtilityService: DateUtilityService) {

    // Getting the context of the Modal from the DialogRef which is injected
    this.context = dialog.context;

    // This data assignment made from the context comes from the
    // Side-Nav component. This leads to the data prepopulation
    // before the form is loaded.
    this.privacyPolicySettingsData = this.context.privacyPolicySettingsData ? this.context.privacyPolicySettingsData.data : '';
  }

  ngOnInit() {
  }

  closePnPModal() {
    this.dialog.close(true);
    this._globalEventEmitterService.modalClosedEvent();
  }

}

import { Component, OnInit } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { TermsConditionModalContext } from './terms-condition-context';
import { LocalStorageService } from 'angular-2-local-storage';
import { GlobalEventEmitterService } from '../../../../services/EventEmitter/global-event-emitter.service';
import { EventLogTypeEnum, EventLogType } from '../../../../models/common.model';
import { DateUtilityService } from '../../../../services';

@Component({
  selector: 'app-terms-condition',
  templateUrl: './terms-condition.component.html',
  styleUrls: ['./terms-condition.component.scss']
})
export class TermsConditionComponent implements OnInit, CloseGuard, ModalComponent<TermsConditionModalContext>{
   context: TermsConditionModalContext;

   termConditionSettingsData: string;
  constructor(public dialog: DialogRef<TermsConditionModalContext>, private _storage: LocalStorageService,
    private _globalEventEmitterService: GlobalEventEmitterService, public _dateUtilityService: DateUtilityService) {

    // Getting the context of the Modal from the DialogRef which is injected
    this.context = dialog.context;

    // This data assignment made from the context comes from the
    // Side-Nav component. This leads to the data prepopulation
    // before the form is loaded.
    this.termConditionSettingsData = this.context.termConditionSettingsData ? this.context.termConditionSettingsData.data : '';
   }

  ngOnInit() {
  }

  closeTnCModal() {
    this.dialog.close(true);
    this._globalEventEmitterService.modalClosedEvent();
  }

}

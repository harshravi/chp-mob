import { Component, OnInit } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { SymptomAssesmentModalContext } from './symptom-modal-context';
import { LocalStorageService } from 'angular-2-local-storage';
import { GlobalEventEmitterService } from '../../../../services/EventEmitter/global-event-emitter.service';
import { EventLogTypeEnum, EventLogType } from '../../../../models/common.model';
import { DateUtilityService } from '../../../../services';

@Component({
  selector: 'app-symptom-assesment-modal',
  templateUrl: './symptom-assesment-modal.component.html',
  styleUrls: ['./symptom-assesment-modal.component.scss']
})
export class SymptomAssesmentModalComponent implements OnInit, CloseGuard, ModalComponent<SymptomAssesmentModalContext> {

  // Context here referres to the context of the Modal that is being opened.
  // This context carries data that can be seen in the Class Decleration.
  context: SymptomAssesmentModalContext;

  /** Variable to assign symptom assesment data */
  symptomAssesmentData;

  /** Variable to display participant name */
  participantName;

  constructor(public dialog: DialogRef<SymptomAssesmentModalContext>, private _storage: LocalStorageService,
    private _globalEventEmitterService: GlobalEventEmitterService, public _dateUtilityService: DateUtilityService) {

    // Getting the context of the Modal from the DialogRef which is injected
    this.context = dialog.context;

    // This data assignment made from the context comes from the
    // Side-Nav component. This leads to the data prepopulation
    // before the form is loaded.
    this.symptomAssesmentData = this.context.symptomAssesmentData['data'];

    this.participantName = this._storage.get('participantName');
  }

  ngOnInit() {
  }
  closeSymptomModal() {
    this.dialog.close(true);
    this._globalEventEmitterService.modalClosedEvent();
  }

  getClass(status: EventLogTypeEnum) {
    switch (status) {
      case EventLogType.NONE: return 'border-status-green';
      case EventLogType.FULL: return 'border-status-green';
      case EventLogType.MODERATE: return 'border-status-alert';
      case EventLogType.SOMEWHAT: return 'border-status-alert';
      case EventLogType.SEVERE: return 'border-status-danger';
      case EventLogType.NOT_AT_ALL: return 'border-status-danger';
      case EventLogType.YES: return 'border-status-danger';
      case EventLogType.NO: return 'border-status-green';
      case EventLogType.MODERATE: return 'border-status-green';
      case EventLogType.RED : return 'border-status-danger';
      case EventLogType.YELLOW: return 'border-status-green';
      case EventLogType.CLEAR: return 'border-status-green';
      case EventLogType.GREEN: return 'border-status-green';
    }
  }

}

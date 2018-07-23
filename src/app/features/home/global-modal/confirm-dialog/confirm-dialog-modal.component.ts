import { Component, OnInit, SimpleChange, OnChanges } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { CustomConfirmDialogModalContext } from './custom-confirm-dialog-modal-context';
import { GlobalEventEmitterService } from '../../../../services/EventEmitter/global-event-emitter.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog-modal.component.html',
  styleUrls: ['./confirm-dialog-modal.component.scss']
})
export class ConfirmDialogModalComponent implements CloseGuard, ModalComponent<CustomConfirmDialogModalContext> {
    context: CustomConfirmDialogModalContext;
    constructor(public dialog: DialogRef<CustomConfirmDialogModalContext>, private _globalEventEmitterService: GlobalEventEmitterService ) {
      this.context = dialog.context;
    }
    // closing the dialog when cance is clicked
 closeDialog(): void {
    this.dialog.close();
  }

  deleteIsClicked(): void {
      this._globalEventEmitterService.modalDeleteClickEvent();
      this.dialog.close();
  }

}

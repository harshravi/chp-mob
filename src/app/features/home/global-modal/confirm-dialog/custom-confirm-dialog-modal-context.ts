import { BSModalContext, BootstrapModalSize } from 'angular2-modal/plugins/bootstrap';

export class CustomConfirmDialogModalContext extends BSModalContext {

    edit: false;
    textToShow;
    isDeleteClicked: boolean;
    constructor() {
        super();
    }
}

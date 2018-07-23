

import { BSModalContext, BootstrapModalSize } from 'angular2-modal/plugins/bootstrap';

export class InvitePatientModalContext extends BSModalContext {
    edit;
    size: BootstrapModalSize = 'lg';
    invitePatientData: Object = {};
    success = false;
}

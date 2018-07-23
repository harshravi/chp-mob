import { BSModalContext, BootstrapModalSize } from 'angular2-modal/plugins/bootstrap';

export class CustomInviteUserModalContext extends BSModalContext {
    size: BootstrapModalSize = 'lg';
    edit: false;
    facilityId: '';
}

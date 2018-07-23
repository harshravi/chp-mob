import { BSModalContext, BootstrapModalSize } from 'angular2-modal/plugins/bootstrap';

export class CustomAddRoleModalContext extends BSModalContext {
    size: BootstrapModalSize = 'lg';
    edit: false;
    facilityId: '';
    selectedRoleData: Object;
}

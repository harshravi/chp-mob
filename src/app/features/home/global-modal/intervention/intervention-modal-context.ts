import { BSModalContext, BootstrapModalSize } from 'angular2-modal/plugins/bootstrap';

export class InterventionModalContext extends BSModalContext {
    size: BootstrapModalSize = 'lg';
    edit: boolean = false;
    participantId:string = "";
}

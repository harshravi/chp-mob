import { BSModalContext, BootstrapModalSize } from 'angular2-modal/plugins/bootstrap';

export class EmergencyActionPlanModalContext extends BSModalContext {
    size: BootstrapModalSize = 'lg';
    emergencyActionPlan: boolean ;
    EmergencyActionPlanData;
    participantId;
    submitBtnText: string;
    edit;
}
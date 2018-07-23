import { BSModalContext, BootstrapModalSize } from 'angular2-modal/plugins/bootstrap';

export class EventLogModalContext extends BSModalContext {
    size: BootstrapModalSize = 'lg';
    eventLogPlan: boolean;
    eventLogDetails;
    eventLogId;
    eventLogStatus: string;
}

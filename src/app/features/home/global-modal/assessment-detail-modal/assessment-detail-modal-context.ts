import { BSModalContext, BootstrapModalSize } from 'angular2-modal/plugins/bootstrap';

export class AssessmentDetailModalContext extends BSModalContext {
    size: BootstrapModalSize = 'lg';
    eventLogPlan: boolean ;
    assessmentQuestionDetails: Object = {};
}

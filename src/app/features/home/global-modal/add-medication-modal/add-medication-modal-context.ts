import { BSModalContext, BootstrapModalSize } from 'angular2-modal/plugins/bootstrap';

export class AddMedicationModalContext extends BSModalContext {
    size: BootstrapModalSize = 'lg';
    addMedicationPlan: boolean ;
    medicationAssesmentData;
}

import { BSModalContext, BootstrapModalSize } from 'angular2-modal/plugins/bootstrap';

export class DevelopmentModalContext extends BSModalContext {
    size: BootstrapModalSize = 'lg';
    showBenchmark;
    editable;
    baseUnit;
    selectedUnit;
    btnText;
    developmentDetails;
    developmentModalSettingsData: IDevelopmentModalData = {};
    success = false;
}
export interface IDevelopmentModalData {
    data?: string;
}


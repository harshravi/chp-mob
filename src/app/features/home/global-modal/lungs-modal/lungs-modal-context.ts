import { BSModalContext, BootstrapModalSize } from 'angular2-modal/plugins/bootstrap';

export class LungsModalContext extends BSModalContext {
    size: BootstrapModalSize = 'lg';
    showBenchmark;
    baseUnit: string;
    editable;
    btnText;
    lungDetails;
    lungsModalSettingsData: ILungsModalData = {};
    success = false;
}

export interface ILungsModalData {
    data?: string;
}
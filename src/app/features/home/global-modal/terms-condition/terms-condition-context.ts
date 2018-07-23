import { BSModalContext, BootstrapModalSize } from 'angular2-modal/plugins/bootstrap';

export class TermsConditionModalContext extends BSModalContext {
    size: BootstrapModalSize = 'lg';
    termConditionSettingsData: ITermConditionSettingsData = {};
    success = false;
}

export interface ITermConditionSettingsData {
    data?: string;
}

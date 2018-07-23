import { BSModalContext, BootstrapModalSize } from 'angular2-modal/plugins/bootstrap';

export class PrivacyPolicyModalContext extends BSModalContext {
    size: BootstrapModalSize = 'lg';
    privacyPolicySettingsData: IPrivacyPolicySettingsData = {};
    success = false;
}

export interface IPrivacyPolicySettingsData {
    data?: string;
}


import { BSModalContext, BootstrapModalSize } from 'angular2-modal/plugins/bootstrap';

export class GlobalSettingsModalContext extends BSModalContext {
    size: BootstrapModalSize = 'lg';
    globalSettingsData: Object = {};
    success = false;
}

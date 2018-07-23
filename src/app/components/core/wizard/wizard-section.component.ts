import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-wizard-section',
    template: `
    <section>
        <ng-content></ng-content>
    </section>
    `
})

export class WizardSectionComponent{
    @Input('title') private tabTitle:string;
}
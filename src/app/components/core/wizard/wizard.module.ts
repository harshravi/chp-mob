import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WizardContainerComponent } from './wizard.container.component';
import { WizardSectionComponent } from './wizard-section.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    WizardContainerComponent,
    WizardSectionComponent
  ],
  exports: [
    WizardContainerComponent,
    WizardSectionComponent
  ]
})
export class WizardModule { }

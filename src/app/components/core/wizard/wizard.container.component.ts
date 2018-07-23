import { Component, ContentChildren, EventEmitter, Output, Input,
   QueryList, AfterContentInit, OnChanges, SimpleChange } from '@angular/core';
import { WizardSectionComponent } from './wizard-section.component';

@Component({
  selector: 'app-wizard-container',
  template: `
  <div class="modal-body">
            <div class="wizard">
                <ul>
                    <li *ngFor="let section of wizardSections;
                     let i=index;" (click)=selectSection(section,i) [class.active]="section.active">
                        <a class="">{{section.tabTitle}}</a>
                    </li>
                </ul>
                <ng-content></ng-content>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-white" (click)="cancel()">Cancel</button>
            <button type="button" class="btn btn-primary" *ngIf="!enableSave" (click)="nextSection()">Next</button>
            <button type="button" class="btn btn-primary" [ngClass]="isDisabled" *ngIf="enableSave" (click)="save()">
            <span *ngIf="!updateOrSave">Save</span>
            <span *ngIf="updateOrSave">Update</span>
            </button>
        </div>`,
  styleUrls: ['./wizard.component.scss']
})
export class WizardContainerComponent implements AfterContentInit, OnChanges {

  @Output()
  cancelEvent = new EventEmitter<boolean>();

  @Output()
  saveEvent = new EventEmitter<boolean>();

  @Input()
  enableNext;

  @Input()
  updateOrSave;

  @Input()
  validArray: Array<boolean>[];

  @Input() disableSave;

  enableSave: boolean;

  currentSection = 0;
  isDisabled: any = '';

  @ContentChildren(WizardSectionComponent) wizardSections: QueryList<WizardSectionComponent>;
  ngAfterContentInit() {
    // get all active tabs
    const activeTabs = this.wizardSections.filter((tab) => tab['active']);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      this.selectSection(this.wizardSections.first, 0);
    }
  }

  selectSection(section: WizardSectionComponent, i) {

    // Initlizing the current section as the sections are being clicked
    this.currentSection = i;

    // Enable and Disable save button as well as next button
    if (this.wizardSections.toArray().length === (this.currentSection + 1)) {
      this.enableSave = true;
    }else {
      this.enableSave = false;
    }

    // All active tabs to false apart form the current tab being selected
    this.wizardSections.toArray().forEach(sec => section['active'] = false);

    // Making the current selection to be true
    section['active'] = true;
  }

  // If Someone clicks Cancel hookup this event with this function
  cancel() {
    this.cancelEvent.emit(true);
  }

  // If Someone clicks on Save hookup this event with this function
  save() {
    if (this.isDisabled !== 'disabled') {
        this.isDisabled = 'disabled';
        this.saveEvent.emit(true);
    }
  }

  nextSection() {

    this.currentSection++;
    this.wizardSections.toArray().forEach(section => section['active'] = false);

    if (this.wizardSections.toArray().length > this.currentSection) {
      this.wizardSections.toArray()[this.currentSection]['active'] = true;
    }

    if (this.wizardSections.toArray().length === (this.currentSection + 1)) {
      this.enableSave = true;
    } else {
      this.enableSave = false;
    }
  }


  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (changes['disableSave'] !== undefined) {
      this.isDisabled = '';
    }
  }

}

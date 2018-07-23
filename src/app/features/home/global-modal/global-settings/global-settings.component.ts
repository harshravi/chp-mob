import { Component, OnInit, Output, Input, ViewContainerRef } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { GlobalSettingsModalContext } from './global-settings-modal-context';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ValidationService } from '../../../../components/core/error-messages';
import { GlobalSettingsService } from './global-settings.service';
import { ToasterService } from 'angular2-toaster';
import * as _ from 'lodash';

@Component({
  selector: 'app-global-settings',
  templateUrl: './global-settings.component.html',
  styleUrls: ['./global-settings.component.scss'],
  providers: [GlobalSettingsService]
})
export class GlobalSettingsComponent implements OnInit, CloseGuard, ModalComponent<GlobalSettingsModalContext>  {

  // Refers to a formGroup and is being Declared as a FormGroup.
  form: FormGroup;

  customFieldFlag = false;

  customTimeForReminder = null;

  // Context here referres to the context of the Modal that is being opened.
  // This context carries data that can be seen in the Class Decleration.
  context: GlobalSettingsModalContext;

  // Declaring the Global Settings variable that will be binded to the data.
  globalSettingOptions: Object;
  check_for_change = true;
  pre_selected_custom_option;
  globalSetttingDD: string[] = [];
  isDataLoading: boolean;

  constructor(public dialog: DialogRef<GlobalSettingsModalContext>, private _fb: FormBuilder,
    private _globalSettingService: GlobalSettingsService, private _vcr: ViewContainerRef, private _toasterService: ToasterService) {

    // Getting the context of the Modal from the DialogRef which is injected
    this.context = dialog.context;

    // Setting close guard form the Dialog.
    dialog.setCloseGuard(this);

    // This data assignment made from the context comes from the
    // Side-Nav component. This leads to the data prepopulation
    // before the form is loaded.
    this.globalSettingOptions = this.context.globalSettingsData['data'];
  }

  ngOnInit() {

    /** Initializing the form data with the data coming from the side-nav component */
    let medication_time_exsists = true;
    const formGroup = {};
    // let customTimeForReminder ='timeReminder'
    for (let i = 0; i < (<any>this.globalSettingOptions).length; i++) {
      this.setLabel();
      for (const a in this.globalSettingOptions[i].settings_type_values) {
        if (this.globalSettingOptions[i]) {
          this.globalSettingOptions[i]['pre_selected_option'] = this.globalSettingOptions[i].settings_value;

          if (this.globalSettingOptions[i].settings_value === this.globalSettingOptions[i].settings_type_values[a].settings_type_value) {
            medication_time_exsists = true;
            break;
          } else {
            medication_time_exsists = false;
          }
        }
      }

      this.globalSettingOptions[i].settings_type_values.push({
        settings_type_label: 'Custom',
        settings_type_value: 'Custom'
      });

      if (medication_time_exsists === false) {
        this.globalSettingOptions[i].customFieldFlag = true;
        this.globalSettingOptions[i].settings_matched = 'matched';
        formGroup['dropdown' + i] = 'Custom';
      } else {
        formGroup['dropdown' + i] = this.globalSettingOptions[i].settings_value;
      }

      formGroup['sendReqTime' + i] = ['', [Validators.required, ValidationService.onlyNumbers]];
    }

    this.form = this._fb.group(formGroup);

    if (this.form) {
      // this.form.controls is a object
      _.forEach(this.form.controls, (val, key) => {
        if (val.value === 'Custom' && key && key.startsWith('dropdown')) {
          const index = key.split('dropdown')[1];
          this.form.controls['sendReqTime' + index].setValue(this.globalSettingOptions[index].settings_value);
        }
      });
    }
  }

  /** Method used in order to save and update the Global Service */

  saveGlobalSettings() {

    for (const obj in this.globalSettingOptions) {
      if (this.globalSettingOptions[obj]) {
        if (this.check_for_change) {
          if (this.globalSettingOptions[obj].pre_selected_option) {
            this.form.value['dropdown' + obj] = this.globalSettingOptions[obj].settings_value;
          }
        }
        if (this.globalSettingOptions[obj].pre_selected_option !== this.globalSettingOptions[obj].settings_value) {
          this.form.value['dropdown' + obj] = this.globalSettingOptions[obj].settings_value;
        }
        if (!this.globalSettingOptions[obj].settings_value) {
          this.pre_selected_custom_option = false;
          break;
        } else {
          this.pre_selected_custom_option = true;
        }
      }
    }
    /** Saving the Global Settings(This works for both create and update) */
    if (this.pre_selected_custom_option) {
      this._globalSettingService.saveGlobalSettings(
        this._globalSettingService.getGlobalSettingsPostModel(this.form.value)
      ).then(data => {
        if (data.success_message) {
          this._toasterService.pop('success', 'Update', data.success_message);
          this.closeGlobalSettings();
        }
      });
    }
  }

  /** Helps in closing the Dialog after successful addition/update */
  closeGlobalSettings() {
    this.dialog.close();
  }
  /** Helps in to check the value of settings_value is unique or not*/
  checkCustomValue(item) {
    for (let i = 0; i < (<any>this.globalSettingOptions).length; i++) {
      for (const a in this.globalSettingOptions[i].settings_type_values) {
        if (this.globalSettingOptions[i].settings_value === this.globalSettingOptions[i].settings_type_values[a].settings_type_value) {
          if (item.settings_type === this.globalSettingOptions[i].settings_type) {
            if (this.form.value['dropdown' + i] !== 'Custom') {
              this.globalSettingOptions[i].settings_value = this.form.value['dropdown' + i];
            }
          }
        }
      }
    }
  }
  /** Helps to set the Label of dropdown*/
  setLabel() {
    for (let i = 0; i < (<any>this.globalSettingOptions).length; i++) {
      if (this.globalSettingOptions[i].settings_type === 'MOBILE_AUTO_LOCK') {
        this.globalSettingOptions[i].label_text = 'Mobile Auto-lock';
        this.globalSettingOptions[i].time_suffix = 'minutes';
      } else if (this.globalSettingOptions[i].settings_type === 'WEB_AUTO_LOGOFF') {
        this.globalSettingOptions[i].label_text = 'Web Auto-Logoff';
        this.globalSettingOptions[i].time_suffix = 'minutes';
      } else if (this.globalSettingOptions[i].settings_type === 'MEDICATION_REMINDER') {
        this.globalSettingOptions[i].label_text = 'Medication Reminder';
        this.globalSettingOptions[i].time_suffix = 'minutes before event';
      }

    }
  }

  /*check the condition when click on select */
  customBox(item, selectedCategory, settings_value) {
    this.check_for_change = false;
    this.checkCustomValue(item);
    for (const obj in this.globalSettingOptions) {
      if (this.form.value['dropdown' + obj] === 'Custom') {
        this.globalSettingOptions[obj].customFieldFlag = true;
        // this.form.value['dropdown'+obj] = this.globalSettingOptions[obj].settings_value;
      } else {
        if (item.settings_type === this.globalSettingOptions[obj].settings_type) {
          // this.globalSettingOptions[obj].settings_value = selectedCategory

          if (selectedCategory !== 'Custom') {
            this.globalSettingOptions[obj].customFieldFlag = false;
          }
        }
        if (selectedCategory === this.globalSettingOptions[obj].settings_value) {
          this.globalSettingOptions[obj].customFieldFlag = false;
        }
      }

    }
  }

  dataLoadingStarted(): void {
    this.isDataLoading = true;
  }

  dataLoadingCompleted(): void {
    this.isDataLoading = false;
  }
}

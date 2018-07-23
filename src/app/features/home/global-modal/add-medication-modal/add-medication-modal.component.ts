import { Component, OnInit, SimpleChange, Input, OnChanges } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { AddMedicationModalContext } from './add-medication-modal-context';
import { AddMedicationService } from './add-medication.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { ToasterService } from 'angular2-toaster';
import { TextMaskModule } from 'angular2-text-mask';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ValidationService } from '../../../../components/core/error-messages';
import { CommonUtil } from '../../../../utils';
import { SetMedicationInactive } from './service/set-inactive.service';
import { IMedication, IErrorMessage } from './model/medication.model';
import { IResponseObj } from '../../../../models';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';


@Component({
  selector: 'app-add-medication-modal',
  templateUrl: './add-medication-modal.component.html',
  styleUrls: ['./add-medication-modal.component.scss'],
  providers: [AddMedicationService, SetMedicationInactive]
})


export class AddMedicationModalComponent implements OnInit, CloseGuard, OnChanges, ModalComponent<AddMedicationModalContext> {
  context: AddMedicationModalContext;
  medicationAssesmentData;
  addMedicationPlan;
  commonUtils = CommonUtil;
  // Declaring the form with the DataType as FormGroup.
  form: FormGroup;

  // Participant unique id
  participantId;

  // Selected drug unique name
  drugId;
  /** Selected drug id */
  selectedDurgId;
  // Variable color selection on respective condition
  CONST_NUM_SEVENTYFIVE = 75;
  CONST_NUM_FIFTY = 50;
  // Selected medication Id
  medicationId;

  // Participant Name to display in header part of modal
  participantName;

  // Default selected time prefix
  selectedTimeSuffix = 'AM';
  timeErrorFlag = false;
  // Collection of frequency which was created while adding medication
  dosesValueCollection = [];
  formatedDosesValueCollection = [];
  // Flag to check form is editable or not
  enableEdit = true;
  enableAdd = false;
  // Pre selected time AM
  preSelected = 'AM';

  // ActivePastMedication drugDetails
  activePastMedicationDetails;

  // Only active medication Details and its length
  activeMedicationDetails;
  // to get the lenght of past and active medication
  pastMedicationDetailsLength: number;
  activeMedicationDetailsLength: number;
  // Only past medication Deatils
  pastMedicationDetails;

  // Searched drug details
  searchedDrug;

  // Collecting data for selected searched drug
  searchedDataCollection;

  // Data which is required to fill the form
  dataToFillForm;

  // Var for highlighting div which is selected
  highlightedDivActive: number;
  highlightedDivPast: number;
  // Var for highlighting div which is selected to add medication
  highlightedSearchedRow: number;

  // To show the field error while submitting the form
  fieldErrorStr: String;

  // Flag to show div for adding frequency
  addFrequencyDiv = false;

  // to control the visibility of confirm Inactive panel
  isSetInactiveMsgVisible = false;

  // Remove this variable once calendar component is created.
  @Input() minDate;
  @Input() tempContractEndDate;
  @Input() tempContractStartDate;

  // Selected medication object from row to display and edit
  selectedMedication: IMedication;

  // To show over all compliances % in header
  overallCompliance;


  // Flag to show create button when drug is selected
  drugIsSellected = false;
  // Flags to show cancel and submit btn according to condition
  editMedicationBtn = true;
  addMedicationBtn = true;
  cancelBtn = false;
  saveMedicationBtn = false;
  showStartDate = true;
  saveForm = true;

  // Flags to show right Box according to condition
  // Div when no drug is selected
  noDrugSelected = true;
  // Div to show drug details
  drugDetails = false;
  // Div to edit drug details
  editDrugDetails = false;
  // Div to add drug
  addDrug = false;
  // enabling form to add Drug
  addDrugForm = false;
  // flag to check length of string which is entered for search of drug
  checkLength = true;
  // Regex quation for time format
  doseFrequencyTimeArr = [];
  public timeMask = [/([0-1])/, /[0-9]/, ':', /[0-5]/, /[0-9]/,];
  // Setting min date for calender
  medicationMinDate: Date;

  isDataLoading: boolean;
  errorMessage: IErrorMessage = {};
  subScriptions: Subscription[] = [];
  // variable to show the confirm close modal message.
  showConfirmCloseModalMsg: boolean;
  showConfirmCloseModalMsgForEdit: boolean;

  constructor(private _addMedication: AddMedicationService,
    private _toasterService: ToasterService,
    public dialog: DialogRef<AddMedicationModalContext>,
    private _storage: LocalStorageService, private _fb: FormBuilder,
    private _setMedicationInactive: SetMedicationInactive) {
    // Getting the context of the Modal from the DialogRef which is injected
    this.context = dialog.context;
    this.participantName = this._storage.get('participantName');
    // This data assignment made from the context comes from the
    // Side-Nav component. This leads to the data prepopulation
    // before the form is loaded.
    this.medicationAssesmentData = this.context.medicationAssesmentData;
    this.addMedicationPlan = this.context.addMedicationPlan;
    this.participantId = this.medicationAssesmentData;
    this.medicationMinDate = new Date();
  }
  // Function to toggle highlight color of row on selection
  toggleHighlight(newValue: number,activePast) {
    this.highlightedDivActive = null;
    this.highlightedDivPast = null;
    if(activePast === 'active'){
      this.highlightedDivActive = newValue;
    }else if(activePast === 'past'){
      this.highlightedDivPast = newValue;
    }
  };
  // Function to toggle the hilighted rew of searched medication
  toggleHighlightSearch(newValue: number) {
    this.highlightedSearchedRow = newValue;
  }
  // function to select drug
  selectedDrugDetails() {
    this.drugDetails = true;
  }
  // Function to edit drug
  editSelectedDrug() {
    this.hideAllRightPanel();

    this.drugId = null;
    this.noDrugSelected = false;
    this.drugDetails = false;
    this.editDrugDetails = true;
    this.addDrug = false;
    this.addDrugForm = true;
    // this.saveForm = false;
    this.showStartDate = false;
    this.editMedicationBtn = false;
    this.addMedicationBtn = false;
    this.cancelBtn = true;
    this.saveMedicationBtn = true;
    // if (this.dosesValueCollection.length > 0) {
    //   // this.form['_status'] = 'VALID';
    //   this.saveForm = false;
    // }
    const editData = this.selectedMedication;
    if (editData.active_numarator_strength && editData.active_ingred_unit) {
      editData.drugNameDetail = (editData.drug_name + ' '
        + editData.active_numarator_strength
        + editData.active_ingred_unit);
    } else {
      editData.drugNameDetail = editData.drug_name;
    }

    this.form.patchValue({
      'drugNameDetail': this.selectedMedication.drugNameDetail,
      'substance_name': this.selectedMedication.substance_name,
      'medication_start_date': this.selectedMedication.medication_start_date,
      'medication_end_date': this.selectedMedication.medication_end_date,
      'frequency': this.selectedMedication.frequency,
      'dosage': this.selectedMedication.dosage,
      'form': this.selectedMedication.form,
      'note': this.selectedMedication.note
    });

    if (this.selectedMedication.doses) {
      this.dosesValueCollection = this.selectedMedication.doses;
      this.doseFrequencyTimeArr = [];
      for (let frequencies of this.dosesValueCollection) {
        this.doseFrequencyTimeArr.push(frequencies.dose_time);
      }
    } else {
      this.dosesValueCollection = [];
      this.doseFrequencyTimeArr = [];
    }
    this.checkRequireField();
  }

  resetErrorMessage() {
    this.errorMessage.isFrequencyMinFailed = false;
    this.errorMessage.isFrequencyMaxFailed = false;
  }

  formValueChanged(data) {
    const frequencyField = this.form.get('frequency');
    this.resetErrorMessage();

    if (frequencyField.errors) {
      this.errorMessage.isFrequencyMaxFailed = frequencyField.errors.max;
      this.errorMessage.isFrequencyMinFailed = frequencyField.errors.min;
    }
  }

  // function to add new drug
  addNewDrug() {
    this.hideAllRightPanel();

    this.searchedDrug = [];
    this.showStartDate = true;
    this.highlightedSearchedRow = null;
    this.highlightedDivActive = null;
    this.noDrugSelected = false;
    this.drugDetails = false;
    this.editDrugDetails = false;
    this.addDrug = true;
    this.addDrugForm = false;
    this.drugIsSellected = false;
    // this.saveForm = true;

    this.editMedicationBtn = false;
    this.addMedicationBtn = false;
    this.cancelBtn = true;
    this.saveMedicationBtn = true;
  }
  // Function to check save/edit before cancel
  cancel() {
    if (this.form.touched || this.addDrugForm) {
      this.showConfirmCloseModalMsgForEdit = true;
     // const r = confirm('You have not saved your previous action. Are you sure you want to cancel?');
    //  if (r === true) {
    //    this.checkCancel();
    //    this.saveForm = true;
    //  } else {
    //    return true;
    //  }
   // } else {
   //   this.checkCancel();
    }
  }
  
  // Function to cancel edit or save
  checkCancel() {
    this.hideAllRightPanel();

    this.searchedDrug = [];
    this.doseFrequencyTimeArr = []; // Making the array empty once edit is selected to clear the previous data
    this.form.reset();
    this.medicationId = null;
    this.highlightedSearchedRow = null;
    this.highlightedDivActive = null;
    this.noDrugSelected = true;
    this.drugDetails = false;
    this.editDrugDetails = false;
    this.addDrug = false;
    this.addDrugForm = false;
    this.drugIsSellected = false;
    this.enableEdit = true;

    this.editMedicationBtn = true;
    this.addMedicationBtn = true;
    this.cancelBtn = false;
    this.saveMedicationBtn = false;
    this.form.markAsUntouched();
    this.getActiveAndPastMedication();
  }
  // setting the form with default values and showing the active and pastt medication 
  ngOnInit() {
    this.getActiveAndPastMedication();
    this.form = this._fb.group({
      'drugNameDetail': [''],
      'substance_name': [''],
      'medication_start_date': ['', ValidationService.contractStartDate],
      'medication_end_date': [''],
      'dosesValue': ['', Validators.required],
      'dosage': [''],
      'frequency': new FormControl('', [Validators.min(1), Validators.max(48)]),
      'form': [''],
      'note': ['']
    });

    // observe form changes and show or hide validation messages
    this.subScriptions.push(this.form.valueChanges.subscribe(data => this.formValueChanged(data)));

    if (this.addMedicationPlan) {
      this.addDrug = true;
      this.noDrugSelected = false;
      this.editMedicationBtn = false;
      this.addMedicationBtn = false;
      this.cancelBtn = true;
      this.saveMedicationBtn = true;
    }
    this.checkRequireField();
  }

  confirmSetInactive(): void {
    this.hideAllRightPanel();
    this.isSetInactiveMsgVisible = true;
    this.saveForm = true;
  }

  setInactiveCancel(): void {

    this.hideAllRightPanel();
    this.addDrugForm = true;
  }

  async setInactiveSubmit(): Promise<string> {
    try {
      const result = await this._setMedicationInactive
        .setInactive(this.selectedMedication.participant_id, this.selectedMedication.medication_id)
        .first().toPromise<any>();
      const parsedResult: IResponseObj = result.json();
      // if (parsedResult.success_message === 'Updated Successfully') {
      // }
      this.hideAllRightPanel();
      return result;
    } catch (err) {
      this.hideAllRightPanel();
    }
  }

  // Fucntion to update selected active medication details
  updateMedicationDetails() {
    this.activeMedicationDetails.forEach(element => {
      if (this.selectedDurgId === element.drug_id) {
        this.selectedMedication = element;
      }
    });
  }
  // Get data for active and past drug
  getActiveAndPastMedication() {
    this.dataLoadingStarted();
    this._addMedication.getActivePastMedication(this.participantId).then(data => {
      this.dataLoadingCompleted();
      this.activePastMedicationDetails = data;
      this.activeMedicationDetails = data.active_medication;
      this.pastMedicationDetails = data.past_medication;
      this.pastMedicationDetailsLength = this.pastMedicationDetails.length;
      this.activeMedicationDetailsLength = this.activeMedicationDetails.length;
      this.overallCompliance = data.overall_compliance;
      this.activeMedicationDetails.forEach(element => {
        if (element.medication_taken_percentage <= 80) {
          element.medStatus = 1;
          element.medStatusColor = 'border-danger';
        } else if (element.medication_taken_percentage > 80 && element.medication_taken_percentage < 90) {
          element.medStatus = 2;
          element.medStatusColor = 'border-alert';
        }
        if (element.medication_taken_percentage >= 90) {
          element.medStatus = 0;
          element.medStatusColor = 'border-normal';
        }
      });
      if (this.selectedMedication) {
        this.updateMedicationDetails();
      }
    }, error => {
      this.dataLoadingCompleted();
    });
  }
  // Get data for active and past drug
  getSearchedDrugDetails(drugName) {
    const val = drugName.target.value;
    this.searchedDrug = [];
    this.highlightedSearchedRow = null;
    if (val.length >= 3) {
      this._addMedication.getSearchedDrug(val).then(data => {
        this.searchedDrug = data;
      });
    } else {
      this.searchedDrug = [];
    }
  }
  // Collect the selected drug object for edit of display
  collectSelectedDrug(drugId) {
    // this.highlightedSearchedRow = null;
    this.searchedDrug.forEach(element => {
      if (element.drug_id === drugId) {
        this.searchedDataCollection = element;
        this.drugIsSellected = true;
      }
    });
  }
  // To add new medication
  addMedicationForm() {
    this.hideAllRightPanel();

    const dataToFillForm = this.searchedDataCollection;
    this.drugId = this.searchedDataCollection.drug_id;
    if (dataToFillForm.active_numarator_strength && dataToFillForm.active_ingred_unit) {
      dataToFillForm.drugNameDetail = (dataToFillForm.drug_name + ' '
        + dataToFillForm.active_numarator_strength
        + dataToFillForm.active_ingred_unit);
    } else {
      dataToFillForm.drugNameDetail = dataToFillForm.drug_name;
    }
    this.noDrugSelected = false;
    this.drugDetails = false;
    this.editDrugDetails = false;
    this.addDrug = false;
    this.addDrugForm = true;
    //this.saveForm = true;

    this.editMedicationBtn = false;
    this.addMedicationBtn = false;
    this.cancelBtn = true;
    this.saveMedicationBtn = true;
    this.form.patchValue({
      'drugNameDetail': dataToFillForm.drugNameDetail,
      'substance_name': dataToFillForm.substance_name,
      'dosage': dataToFillForm.dosage,
      'form': dataToFillForm.form
    });
    if (dataToFillForm.doses) {
      this.dosesValueCollection = dataToFillForm.doses;
    } else {
      this.dosesValueCollection = [];
    };
    this.checkRequireField();
  }
  // check of data enterd to form before cancel
  selectedMedicationDetails(SelectedRow,activePast) {
    if (this.form.touched) {
      const r = confirm('You have not saved your previous action. Are you sure you want to cancel?');
      if (r === true) {
        this.form.markAsUntouched();
        this.DispalyMedicationDetails(SelectedRow,activePast);
        this.selectedDurgId = SelectedRow.drug_id;
        this.saveForm = true;
      } else {
        return true;
      }
    } else {
      this.DispalyMedicationDetails(SelectedRow,activePast);
      this.selectedDurgId = SelectedRow.drug_id;
    }
  }

  hideAllRightPanel(): void {
    this.noDrugSelected = false;
    this.drugDetails = false;
    this.addDrug = false;
    this.addDrugForm = false;
    this.isSetInactiveMsgVisible = false;
  }

  // Show the drug details according to selection
  DispalyMedicationDetails(SelectedRow,activePast) {
    this.hideAllRightPanel();
    if(activePast === 'past'){
      this.enableEdit = true;
      this.enableAdd = true;
    }else{
      this.enableEdit = false;
      this.enableAdd = false;
    }
    this.noDrugSelected = false;
    this.drugDetails = true;
    this.editDrugDetails = false;
    this.addDrug = false;
    this.addDrugForm = false;

    this.editMedicationBtn = true;
    this.addMedicationBtn = true;
    this.cancelBtn = false;
    this.saveMedicationBtn = false;
    this.selectedMedication = SelectedRow;
    this.medicationId = SelectedRow.medication_id;
  }
  // To show div for adding frequency
  addFrequency() {
    this.form.controls['dosesValue'].reset();
    if (this.addFrequencyDiv) {
      this.addFrequencyDiv = false;
      this.checkLength = true;
    } else {
      this.addFrequencyDiv = true;
      this.checkLength = true;
    }
  }
  // To select the suffix of time as AM or PM
  timeSuffixSelection(selectedValue) {
    this.selectedTimeSuffix = selectedValue;
    if (this.form.value.dosesValue) {
      this.checkLength = false;
    }
    this.timeCheck(this.selectedTimeSuffix);
  }
  // finally fomate the time which is required to show
  finalTime(newHour, min, changeOfTime) {
    const hourInPm = ('0' + newHour).slice(-2);
    const minInPm = ('0' + min).slice(-2);
    const timeInPm = hourInPm + ':' + minInPm + ' ' + changeOfTime;
    this.form.value.dosesValue = timeInPm;
  }
  // TO check time is AM or PM
  timeCheck(changeOfTime) {
    switch (changeOfTime) {
      case 'AM':
        if (this.form.value.dosesValue) {
          const time = this.form.value.dosesValue;
          const hour = +time.substring(0, 2);
          const min = time.substring(3, 5);
          this.finalTime(hour, min, changeOfTime);
          this.preSelected = 'AM'
          // if (hour === 12) {
          //   const newHour = hour - 12;
          //   this.finalTime(newHour, min, changeOfTime);
          // } else {
          //   const newHour = hour - 12;
          //   this.finalTime(newHour, min, changeOfTime);
          // }
        }
        break;

      case 'PM':
        if (this.form.value.dosesValue) {
          const time = this.form.value.dosesValue;
          const hour = +time.substring(0, 2);
          const min = time.substring(3, 5);
          this.finalTime(hour, min, changeOfTime);
          this.preSelected = 'PM';

          // if (hour < 12) {
          //   const newHour = hour + 12;
          //   this.finalTime(newHour, min, changeOfTime);
          // } else if (hour === 12 && min >= 0) {
          //   this.preSelectedAm = 'PM';
          //   this.finalTime(hour, min, changeOfTime);
          // }
        }
        break;
    }
  }
  // function to remove frequency which was added
  removeFrequency(doseTime) {
    console.log(doseTime);
    for (let i = 0; i < this.dosesValueCollection.length; i++) {
      if (this.dosesValueCollection[i].dose_time === doseTime) {
        this.dosesValueCollection.splice(i, 1);
        this.doseFrequencyTimeArr.splice(i, 1);
        break;
      }
    }

    // if (this.dosesValueCollection.length <= 0) {
    //   // this.form['_status'] = 'INVALID';
    //   this.saveForm = true;
    // }
    this.checkRequireField();
  }
  // checking the lenght of string while adding the frequecy
  checkStringLength(timeString) {
    // if (this.dosesValueCollection.length > 0) {
    //   this.saveForm = false;
    // } else {
    //   this.saveForm = true;
    // }
    const val = timeString.target.value;
    const checkHr = +val.substring(0, 2)
    if (checkHr > 12) {
      this.timeErrorFlag = true;
    } else {
      this.timeErrorFlag = false;
    }
    const replacedValue = val.replace('_', '');

    if (replacedValue.length < 5) {
      this.checkLength = true;
    } else if (val.length === 5) {
      this.checkLength = false;
    }
  }
  // function to add frequency
  submitFrequecyData() {
    const time = this.form.value.dosesValue;
    const hour = +time.substring(0, 2);
    const min = +time.substring(3, 5);
    this.finalTime(hour, min, this.preSelected);
    this.preSelected = 'AM';
    if (this.dosesValueCollection.length > 0) {

      this.checkFrequencyExist();
      this.checkRequireField();
    } else {
      this.dosesValueCollection.push({ 'dose_time': this.form.value.dosesValue });
      this.doseFrequencyTimeArr.push(this.form.value.dosesValue);
      this.checkRequireField();
    }
    this.addFrequencyDiv = false;

    this.form.controls['dosesValue'].reset();
  }
  checkFrequencyTime(event, timeFrequency: HTMLInputElement) {
    var dosesValue = event;
    if (dosesValue) {
      const hour = +dosesValue.substring(0, 2);
      this.timeErrorFlag = false;
      if (hour > 12) {
        this.timeErrorFlag = true;
        timeFrequency.value = null;
        this.checkLength = true;
      }
    }
  }
  // To check frequecy which is getting added is allready exist or not
  checkFrequencyExist() {
    for (let i = 0; i < this.dosesValueCollection.length; i++) {
      if (this.dosesValueCollection[i].dose_time === this.form.value.dosesValue) {
        this._toasterService.pop('error', 'Error', 'Entered frequency already exists');
        return true;
      }
    }
    this.dosesValueCollection.push({ 'dose_time': this.form.value.dosesValue });
    this.doseFrequencyTimeArr.push(this.form.value.dosesValue);
  }
  formateDosesValue() {
    this.formatedDosesValueCollection = [];
    this.dosesValueCollection.forEach(element => {
      const dosesValue = element.dose_time
      let hour = dosesValue.substring(0, 2);
      const numericHr = +hour;
      const min = dosesValue.substring(3, 5);
      const timeprefix = dosesValue.substring(6, 8);
      if (timeprefix === 'PM' && numericHr < 12) {
        // hour = hour + 12;
        let changedHour = hour;
        changedHour = +changedHour + 12;
        const time = changedHour + ':' + min;
        this.formatedDosesValueCollection.push({ 'dose_time': time })
      } else if (timeprefix === 'PM' && hour === '12') {
        const time = hour + ':' + min;
        this.formatedDosesValueCollection.push({ 'dose_time': time })
      } else if (timeprefix === 'AM' && hour === '12') {
        hour = "00";
        const time = hour + ':' + min;
        this.formatedDosesValueCollection.push({ 'dose_time': time })
      } else if (timeprefix === 'AM') {
        const time = hour + ':' + min;
        this.formatedDosesValueCollection.push({ 'dose_time': time })
      }
    });
  }

  // Save and Edit of medication
  saveMedication(value: any) {
    const tempObj = Object.assign({}, this.form.value);
    const medicationStartDate = moment(tempObj.medication_start_date).format('YYYY-MM-DD');
    let medicatioEndDate;
    this.formateDosesValue();
    if (this.form.value.medication_end_date) {
      medicatioEndDate = moment(tempObj.medication_end_date).format('YYYY-MM-DD');
    } else {
      medicatioEndDate = null;
    }
    if (this.drugId != null && this.participantId != null) {
      const addMedicationObject = {
        participant_id: this.participantId,
        drug_id: this.drugId,
        form: value.form,
        dosage: value.dosage,
        substance_name: value.substance_name,
        medication_start_date: medicationStartDate,
        medication_end_date: medicatioEndDate,
        note: value.note,
        frequency: this.form.value.frequency,
        doses: this.formatedDosesValueCollection
      };
      if (!addMedicationObject.note) {
        addMedicationObject.note = null;
      }
      if (tempObj.medication_end_date === null) {
        delete addMedicationObject.medication_end_date;
      };
      this._addMedication.addMedication(addMedicationObject).then(data => {
        if (data.success_message) {

          // Clearing the fields once save is successfull
          this.form.reset();
          this.form.markAsUntouched();
          this.hideAllRightPanel();

          this.editMedicationBtn = false;
          this.addMedicationBtn = false;
          this.cancelBtn = true;
          this.saveMedicationBtn = true;
          this.addDrug = true;
          this.addDrugForm = false;
          this.drugIsSellected = false;
          this.saveForm = true;
          this.drugId = '';
          this.searchedDrug = [];
          this.dosesValueCollection = [];
          this.highlightedSearchedRow = null;
          this.doseFrequencyTimeArr = []; // Making the array empty once edit is selected to clear the previous data
          this.dialog.close(true);
          this._toasterService.pop('success', 'Saved', data.success_message);
          // Calling the role service to reload the list of roles in the modal
          this.getActiveAndPastMedication();
        } else if (data.fieldErrors) {
          this.fieldErrorStr = data.fieldErrors[0].message;
        } else if (data.error_message) {
          // this.form.reset();
          // this.form.markAsUntouched();
          // this.editMedicationBtn = true;
          // this.addMedicationBtn = true;
          // this.cancelBtn = false;
          // this.saveMedicationBtn = false;
          // this.saveForm = true;
          // this.addDrug = true;
          // this.addDrugForm = false;
          // this.drugIsSellected = false;
          // this.drugId = '';
          // this.searchedDrug = [];
          // this.dosesValueCollection = [];
          // this.highlightedSearchedRow = null;
          this._toasterService.pop('error', 'Error', data.error_message);
        }
      });
    } else if (this.medicationId != null && this.participantId != null) {
      const editMedicationObject = {
        participant_id: this.participantId,
        medication_id: this.medicationId,
        medication_end_date: moment(tempObj.medication_end_date).format('YYYY-MM-DD'),
        note: value.note,
        form: value.form,
        dosage: value.dosage,
        substance_name: value.substance_name,
        frequency: value.frequency,
        doses: this.formatedDosesValueCollection
      };
      if (!editMedicationObject.note) {
        editMedicationObject.note = null;
      }
      if (tempObj.medication_end_date === null) {
        delete editMedicationObject.medication_end_date;
      }
      this._addMedication.editMedication(editMedicationObject).then(data => {
        if (data.success_message) {

          // Clearing the fields once save is successfull
          this.form.reset();
          // Calling the getActiveAndPastMedication to reload the Active and Past in the modal
          this.getActiveAndPastMedication();
          this.form.markAsUntouched();
          this.hideAllRightPanel();
          this.drugId = '';
          this.enableEdit = false;
          this.editMedicationBtn = true;
          this.addMedicationBtn = true;
          this.cancelBtn = false;
          this.saveMedicationBtn = false;
          this.addDrugForm = false;
          this.noDrugSelected = false;
          this.drugDetails = true;
          this.doseFrequencyTimeArr = []; // Making the array empty once edit is selected to clear the previous data
          // this.highlightedDiv = null;
          this._toasterService.pop('success', 'Update', data.success_message);
        } else if (data.fieldErrors) {
          this.fieldErrorStr = data.fieldErrors[0].message;
          this.form.markAsUntouched();
        } else if (data.error_message) {
          this.fieldErrorStr = data.error_message;
          this.form.markAsUntouched();
        }
      });
    }
  }
  // function to close the modal with confermation check
  closeSymptomModal() {
    if (this.form.touched || this.addDrugForm) {
      // const r = confirm('You have not saved your previous action. Are you sure you want to cancel?');
      // if (r === true) {
      //   this.form.markAsUntouched();
      //   this.dialog.close(true);
      //   this.saveForm = true;
      // } else {
      //   return true;
      // }
      this.showConfirmCloseModalMsg = true;
    } else {
      this.dialog.close(true);
    }
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
  }

  // ** to check for required field */
  checkRequireField() {
    if ((this.form.value.frequency >= 1 && this.form.value.frequency <= 48)
      && this.form.value.frequency && this.form.value.form && this.form.value.dosage
      && this.form.value.substance_name && this.dosesValueCollection.length > 0 &&
      this.form.value.medication_start_date) {
      this.saveForm = false;
    } else {
      this.saveForm = true;
    }
  }
  // ** To check require field on change of start Date */
  startDateChange() {
    this.checkRequireField();
  }

  dataLoadingStarted(): void {
    this.isDataLoading = true;
  }

  dataLoadingCompleted(): void {
    this.isDataLoading = false;
  }
  // close method to be called when dialog is opened after clicking on cross symbol
  cancelConfirmDialog() {
    console.log('cancel confirm dialogue');
     this.showConfirmCloseModalMsg = false;
  }
  // close method to be called when dialog is opened after clicking on cross symbol
  closeConfirmDialog() {
     this.dialog.close(true);
  }
  // cancel modal method when edit is clicked
  cancelConfirmDialogForEdit(){
    this.showConfirmCloseModalMsgForEdit = false;
  }
  // close modal method when close is clicked
  closeConfirmDialogForDialog(){
    this.showConfirmCloseModalMsgForEdit = false;
     this.checkCancel();
     this.saveForm = true;
  }
}

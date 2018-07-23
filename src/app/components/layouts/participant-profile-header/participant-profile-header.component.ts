import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantDashboardService } from './../../../../../src/app/features/home/participant-dashboard/participant-dashboard.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { ValidationService } from '../../../components/core/error-messages';
import { CommonUtil } from '../../../utils';
import { DateUtilityService } from '../../../services';
import { CustomConfirmDialogModalContext, ConfirmDialogModalComponent } from '../../../features/home/global-modal/confirm-dialog';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { GlobalEventEmitterService } from '../../../services/EventEmitter/global-event-emitter.service';

@Component({
  selector: 'app-participant-profile-header',
  templateUrl: './participant-profile-header.component.html',
  styleUrls: ['./participant-profile-header.component.scss'],
  providers: [ParticipantDashboardService]
})
export class ParticipantProfileHeaderComponent implements OnInit, OnDestroy {

  commonUtils = CommonUtil;
  participantDetail;
  participantProfileCondition;
  medicationAdherence;
  participantId;
  participantName;
  displayName;
  diagnosisConditions;
  diagnosis;
  displayAdd;
  careplanCompliance: any = '';
  newDiagnosis: String;
  form: FormGroup;
  confirmationText: string;
  displayTextEnrolled = 'UNRESOLVED';
  count: number;
  colorOfBoxEnrolled = 'bg-danger';
  colorOfBoxTasks: string;
  heading = 'TASKS';
  countInterval;
  constructor(private route: ActivatedRoute,
    private _participantDashboardService: ParticipantDashboardService,
    private _storage: LocalStorageService, private _fb: FormBuilder, private _dateUtilityService: DateUtilityService,
    private _router: Router, private _modal: Modal, private _globalEventEmitterService: GlobalEventEmitterService) {
    this.displayAdd = true;
    this.confirmationText = "Are you sure you want to delete this condition from the patient's profile?"
    this.updateParticipantData();
    this._router.events.subscribe((val) => {
      setTimeout(() => {
        this.updateParticipantData();
      }, 1000);
    });

    this.countInterval = setInterval(() => {
      this._participantDashboardService.getParticipantUnreadTaskCount(this.participantId).then(data => {
        this.count = data.unread_task_count;
        if (this.count === 0) {
          this.colorOfBoxTasks = 'bg-muted';
        } else {
          this.colorOfBoxTasks = 'bg-danger';
        }
      });
    }, 5000);
  }

  ngOnInit() {
  }
  participantDetails() {
    this.participantDetail = [];
    this._participantDashboardService.participantDetails(this.participantId).then(data => {
      this.participantDetail = data;
      this._storage.set('participantName', data.participant_name);
      this.displayNameText();
    });
    this._participantDashboardService.participantMedicationAdherence(this.participantId).then(data => {
      this.medicationAdherence = data;
      this.medicationAdherence['displayTextEnrolled'] = 'Medication';
      this.medicationAdherence['boxColor'] = 'white-bg';
      this.medicationAdherence['boxBorder'] = 'border-all';
      this.medicationAdherence['medicationCountSymbol'] = '%';
    });

    this._participantDashboardService.getParticipantCareplanCompliance(this.participantId).then(data => {
      this.careplanCompliance = data;
      this.careplanCompliance['displayTextEnrolled'] = 'Care Plan';
      this.careplanCompliance['boxColor'] = 'white-bg';
      this.careplanCompliance['boxBorder'] = 'border-all';
      this.careplanCompliance['careplanCountSymbol'] = '%';
      if (this.careplanCompliance.colorCode === 0) {
        this.careplanCompliance['statusColor'] = 'text-navy';
      } else if (this.careplanCompliance.colorCode === 1) {
        this.careplanCompliance['statusColor'] = 'text-warning';
      } else if (this.careplanCompliance.colorCode === 2) {
        this.careplanCompliance['statusColor'] = 'text-danger';
      }
    });

    this._participantDashboardService.getParticipantUnreadTaskCount(this.participantId).then(data => {
      this.count = data.unread_task_count;
      if (this.count === 0) {
        this.colorOfBoxTasks = 'bg-muted';
      } else {
        this.colorOfBoxTasks = 'bg-danger';
      }
    });
  }
  participantDiagnosisDetails() {
    this._participantDashboardService.participantProfileCondition(this.participantId).then(data => {
      this.participantProfileCondition = data;
      this.diagnosisConditions = data;
    });
  }
  displayNameText() {
    this.participantName = this.participantDetail.participant_name;
    const temp = this.participantName.split(' ');
    this.displayName = temp[0].charAt(0) + temp[temp.length - 1].charAt(0);
  }
  // Methos for delete Diagnosis
  deleteParticipantDiagnosis(diagnosisName, diagnosis_id) {
    this._modal.open(ConfirmDialogModalComponent, overlayConfigFactory({ edit: false, textToShow: this.confirmationText }, CustomConfirmDialogModalContext));
    this._globalEventEmitterService.modalDeleteClickObservable.subscribe(closed => {
      const obj = {
        'diagnosis_name': diagnosisName,
        'participant_id': this.participantId,
        'diagnosis_id': diagnosis_id
      };
      this._participantDashboardService.deleteDiagnosis(obj).then(data => {
        this.participantDiagnosisDetails();
      });
    });
  }
  // Methos for Add Diagnosis
  addParticipantDiagnosis(value) {
    const obj = {
      'diagnosis_name': value.diagnosis_name,
      'participant_id': this.participantId
    };
    this._participantDashboardService.addDiagnosis(obj).then(data => {
      this.participantDiagnosisDetails();
    });
    this.form.reset();
    this.displayAdd = true;
  }
  // Methos for Display addDiagnosis Field
  displayAddDiagnosisField() {
    this.displayAdd = false;
  }
  // Methos for Hide addDiagnosis Field
  hideAddDiagnosisField() {
    this.displayAdd = true;
    this.form.reset();
  }

  /** get Color class for Overall medication compliance */
  getClassForCarePlan() {
    if (this.careplanCompliance.compliance < 50) {
      return 'text-danger';
    } else if (this.careplanCompliance.compliance > 50 && this.careplanCompliance.compliance < 75) {
      return 'text-warning';
    } else if (this.careplanCompliance.compliance > 75) {
      return 'text-navy';
    }
  }

  /** Update Participant Data */
  updateParticipantData() {
    this.participantId = this._storage.get('participantId');
    this.participantDetails();
    this.participantDiagnosisDetails();
    // this.hideAddDiagnosisField();
    this.form = this._fb.group({
      'diagnosis_name': ['', ValidationService.roleName]
    });
  }

  ngOnDestroy() {
    clearInterval(this.countInterval);
  }
}

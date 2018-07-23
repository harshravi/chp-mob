import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { ChartModule } from 'angular2-highcharts';
import { DevelopmentModalComponent } from './global-modal/development-modal/development-modal.component';
import { LungsModalComponent } from './global-modal/lungs-modal/lungs-modal.component';

import { AppDirectiveModule } from '../../directive/app.directive.module';


var Highcharts = require('highcharts');

// Change the TimeZone to UTC
Highcharts.setOptions({
  global: {
    useUTC: false
  }
});

export function highchartsFactory() {
  return Highcharts;
}

/** Module imported for breadcrumb  */
import { BreadcrumbModule } from 'primeng/primeng';

import { CanActivateViaAuthGuard } from './../../config/guards/can-activate';
import { AuthenticationService } from '../../services/Authentication/authentication.service';


/** Modules imported for data grid */
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { ToasterModule } from 'angular2-toaster';
// import { DatePickerModule } from 'ng2-datepicker/ng2-datepicker';
import { MomentModule } from 'angular2-moment';
/** Custom App based modules */
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientsComponent } from './clients/clients.component';
import { ViewClientsComponent } from './clients/view-clients/view-clients.component';
import { NgxDataTableComponent } from './clients/view-clients/component/ngx-data-table/ngx-data-table.component';
import { LibrariesComponent } from './libraries/libraries.component';
import { GlobalLibrariesComponent } from './libraries/global-libraries';
import { MedicationComponent } from './libraries/medication';


/** All Modal Based Imports go here  */
import { AddAccountModalComponent } from './global-modal/add-account/add-account-modal.component';
import { GlobalSettingsComponent } from './global-modal/global-settings/global-settings.component';


/** Component's Modules to be imported */
import {
  SideNavModule,
  HeaderModule,
  DashboardHeaderModule,
  IboxContainerModule,
  IboxContentModule,
  IboxHeaderModule,
  CheckBoxModule,
  CustomCheckBoxModule,
  WizardModule,
  ErrorMessagesModule,
  DropDownModule,
  DropDownCustomModule,
  CategoryBoxModule,
  VHPaginationModule,
  TagsModule,
  TabModule,
  CarouselModule,
  CountBoxModule,
  ChipsModule,
  ProgressBarModule,
  DatepickerModule,
  LoadingBarModule,
  UiDropdownModule,
  MultiselectModule,
  MessagingModule,
  ProgressSpinnerModule,
  ClientDropDownModule,
  ButtonModule
} from '../../components';
import { ComboBoxModule } from '../../components/core/combo-box';

// Import Service for the Loading bar
import { LoadingBarService } from './../../components/core/loading-bar';

// Importing text-mask module
import { TextMaskModule } from 'angular2-text-mask';

import { AccessManagementComponent } from './access-management/access-management.component';
import { AccessManagementTableComponent } from './access-management/component/access-management-table/access-management-table.component';
import { AddRoleModalComponent } from './global-modal/add-role/add-role-modal.component';
import { HomeDataTableComponent } from './dashboard/components/home-data-table/home-data-table.component';
import { CareplanComponent } from './dashboard/components/careplan/careplan.component';
import { DiagnosisComponent } from './dashboard/components/diagnosis/diagnosis.component';
import { VitalsComponent } from './dashboard/components/vitals/vitals.component';
import { ParticipantDashboardComponent } from './participant-dashboard/participant-dashboard.component';
import { CarePlanComponent } from './care-plan/care-plan.component';
import { CarePlanDetailsComponent } from './care-plan-details/care-plan-details.component';
import { ViewCarePlanComponent } from './care-plan/view-care-plan/view-care-plan.component';
import { CarePlanPatientsComponent } from './care-plan-patients/care-plan-patients.component';
import { ViewParticipantComponent } from './participant-dashboard/view-participant/view-participant.component';
import { CcdMedicalRecordsComponent } from './participant-dashboard/ccd-medical-records/ccd-medical-records.component';
import { GraphsComponent } from './participant-dashboard/graphs/graphs.component';
import { SymptomAssesmentModalComponent } from './global-modal/symptom-assesment/symptom-assesment-modal.component';
import { ChatComponent } from './chat/chat.component';
import { AddMedicationModalComponent } from './global-modal/add-medication-modal/add-medication-modal.component';
import { CareTeamComponent } from './care-team/care-team.component';
import { CareTeamListComponent } from './care-team/care-team-list/care-team-list.component';
import { PatientCarePlanComponent } from './participant-dashboard/patient-care-plan/patient-care-plan.component';
import { ParticipantHealthStatusComponent } from './participant-dashboard/participant-health-status/participant-health-status.component';
import { InterventionComponent, InterventionComplianceComponent } from './global-modal';
import { EventLogComponent } from './event-log/event-log.component';
import { EventLogListComponent } from './event-log/event-log-list/event-log-list.component';
import { EventLogModalComponent } from './global-modal/event-log-modal/event-log-modal.component';
import { ParticipantAssessmentComponent } from './participant-dashboard/participant-assessment/participant-assessment.component';
import { AssessmentDetailModalComponent } from './global-modal/assessment-detail-modal/assessment-detail-modal.component';
import { EventlogAssessmentDetailsComponent } from './eventlog-assessment-details/eventlog-assessment-details.component';
import { InviteUserModalComponent } from './global-modal/invite-user/invite-user-modal.component';
import { ClientDataTableComponent } from './dashboard/components/client-data-table/client-data-table.component';
import { ConfirmDialogModalComponent } from './global-modal/confirm-dialog/confirm-dialog-modal.component';

// import pipes
import { AppPipeModule } from '../../pipes/app-pipe.module';
import { ParticipantCareTeamComponent } from './participant-dashboard/participant-care-team/participant-care-team.component';

// import providers
import { AppGlobal } from '../../models/app-global.model';
import { TermsConditionComponent } from './global-modal/terms-condition/terms-condition.component';
import { PrivacyPolicyComponent } from './global-modal/privacy-policy/privacy-policy.component';
import { TwilioService } from '../../services/TwilioService/twilio.service';
import { InvitePatientModalComponent } from './global-modal/invite-patient-modal/invite-patient-modal.component';
import { AppACLService, AclService, DateUtilityService } from '../../services/';
import { AppOnlyNumbersDirective } from '../../directive/only-number.directive';
import { AppLungInputNumberValidationDirective } from '../../directive/lung-input-number-validation.directive';
import { TooltipDirective } from '../../directive/tooltip.directive';
import { EmergencyActionPlanModalComponent } from './global-modal/emergency-action-plan-modal/emergency-action-plan-modal.component';

const options: any = {
  animate: 'flyRight',
  positionClass: 'toast-bottom-right',
};

@NgModule({
  imports: [
    AppDirectiveModule,
    CommonModule,
    NgxDatatableModule,
    ModalModule.forRoot(),
    BootstrapModalModule,
    FormsModule,
    ReactiveFormsModule,
    ToasterModule,
    SideNavModule,
    HeaderModule,
    BreadcrumbModule,
    IboxContainerModule,
    IboxContentModule,
    IboxHeaderModule,
    CheckBoxModule,
    CustomCheckBoxModule,
    DashboardHeaderModule,
    WizardModule,
    ErrorMessagesModule,
    HomeRoutingModule,
    DropDownModule,
    DropDownCustomModule,
    CategoryBoxModule,
    VHPaginationModule,
    TagsModule,
    MomentModule,
    TextMaskModule,
    TabModule,
    ChartModule,
    CarouselModule,
    CountBoxModule,
    ChipsModule,
    ProgressBarModule,
    DatepickerModule,
    LoadingBarModule,
    UiDropdownModule,
    ComboBoxModule,
    MultiselectModule,
    MessagingModule,
    ProgressSpinnerModule,
    AppPipeModule,
    ClientDropDownModule
  ],
  declarations: [
    HomeComponent,
    ClientsComponent,
    DashboardComponent,
    ViewClientsComponent,
    NgxDataTableComponent,
    AddAccountModalComponent,
    GlobalSettingsComponent,
    AccessManagementComponent,
    AccessManagementTableComponent,
    AddRoleModalComponent,
    LibrariesComponent,
    GlobalLibrariesComponent,
    MedicationComponent,
    HomeDataTableComponent,
    CareplanComponent,
    DiagnosisComponent,
    VitalsComponent,
    ParticipantDashboardComponent,
    CarePlanComponent,
    CarePlanDetailsComponent,
    ViewCarePlanComponent,
    CarePlanPatientsComponent,
    ViewParticipantComponent,
    CcdMedicalRecordsComponent,
    GraphsComponent,
    SymptomAssesmentModalComponent,
    AddMedicationModalComponent,
    CareTeamComponent,
    CareTeamListComponent,
    ChatComponent,
    PatientCarePlanComponent,
    ParticipantHealthStatusComponent,
    InterventionComponent,
    InterventionComplianceComponent,
    EventLogComponent,
    EventLogListComponent,
    EventLogModalComponent,
    ParticipantAssessmentComponent,
    AssessmentDetailModalComponent,
    EventlogAssessmentDetailsComponent,
    ParticipantCareTeamComponent,
    TermsConditionComponent,
    PrivacyPolicyComponent,
    InviteUserModalComponent,
    InvitePatientModalComponent,
    ConfirmDialogModalComponent,
    DevelopmentModalComponent,
    LungsModalComponent,
    ClientDataTableComponent,
    ConfirmDialogModalComponent,
    AppOnlyNumbersDirective,
    TooltipDirective,
    AppLungInputNumberValidationDirective,
    EmergencyActionPlanModalComponent
  ],
  entryComponents: [
    AddAccountModalComponent,
    GlobalSettingsComponent,
    AddRoleModalComponent,
    SymptomAssesmentModalComponent,
    AddMedicationModalComponent,
    EmergencyActionPlanModalComponent,
    InterventionComponent,
    InterventionComplianceComponent,
    EventLogModalComponent,
    AssessmentDetailModalComponent,
    TermsConditionComponent,
    PrivacyPolicyComponent,
    InviteUserModalComponent,
    InvitePatientModalComponent,
    ConfirmDialogModalComponent,
    LungsModalComponent,
    DevelopmentModalComponent
  ],
  providers: [
    AppACLService,
    AclService,
    DateUtilityService,
    {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
    },
    LoadingBarService,
    CanActivateViaAuthGuard,
    AuthenticationService,
    AppGlobal,
    TwilioService
  ]
})
export class HomeModule { }

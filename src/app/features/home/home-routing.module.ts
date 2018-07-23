import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientsComponent } from './clients/clients.component';
import { ViewClientsComponent } from './clients/view-clients/view-clients.component';
import { AccessManagementComponent } from './access-management/access-management.component';
import { LibrariesComponent } from './libraries';
import { GlobalLibrariesComponent } from './libraries/global-libraries/global.component';
import { MedicationComponent } from './libraries/medication';
import { CarePlanComponent } from './care-plan/care-plan.component';
import { EventLogListComponent } from './event-log/event-log-list/event-log-list.component';
import { EventLogComponent } from './event-log/event-log.component';
import { CarePlanDetailsComponent } from './care-plan-details/care-plan-details.component';
import { ViewCarePlanComponent } from './care-plan/view-care-plan/view-care-plan.component';
import { CarePlanPatientsComponent } from './care-plan-patients/care-plan-patients.component';
import { ParticipantDashboardComponent } from './participant-dashboard/participant-dashboard.component';
import { ViewParticipantComponent } from './participant-dashboard/view-participant/view-participant.component';
import { CcdMedicalRecordsComponent } from './participant-dashboard/ccd-medical-records/ccd-medical-records.component';
import { CanActivateViaAuthGuard } from './../../config/guards/can-activate';
import { CareTeamComponent } from './care-team/care-team.component';
import { CareTeamListComponent } from './care-team/care-team-list/care-team-list.component';
import { ChatComponent } from './chat/chat.component';
import { PatientCarePlanComponent } from './participant-dashboard/patient-care-plan/patient-care-plan.component';
import { ParticipantHealthStatusComponent } from './participant-dashboard/participant-health-status/participant-health-status.component';
import { ParticipantAssessmentComponent } from './participant-dashboard/participant-assessment/participant-assessment.component';
import { EventlogAssessmentDetailsComponent } from './eventlog-assessment-details/eventlog-assessment-details.component';
import { ParticipantCareTeamComponent } from './participant-dashboard/participant-care-team/participant-care-team.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: {
      breadcrumb: 'Home'
    },
    canActivate: [
      CanActivateViaAuthGuard
    ],
    children: [
      {
        path: '',
        component: DashboardComponent,
        data: {
          breadcrumb: 'Dashboard',
          pageTitle: 'Dashboard',
          routeName: 'dasboard1'
        },
      }, {
        path: 'carePlan',
        component: CarePlanComponent,
        data: {
          breadcrumb: 'Care Plans',
          pageTitle: 'Care Plan'
        },
        children: [
          {
            path: '',
            component: ViewCarePlanComponent,
            data: {
              breadcrumb: 'View Care Plan',
              pageTitle: 'View Care Plan'
            },
          }, {
            path: 'carePlanDetails/:id/:programName/:viewName',
            component: CarePlanDetailsComponent,
            data: {
              breadcrumb: '',
              pageTitle: 'Care Plan Details'
            },
          }, {
            path: 'carePlanPatientsDetails/:id/:viewName',
            component: CarePlanPatientsComponent,
            data: {
              breadcrumb: 'Patient List',
              pageTitle: 'Patient List'
            },
          }]
      },
      {
        path: 'clients',
        component: ClientsComponent,
        data: {
          breadcrumb: 'Clients',
          pageTitle: 'Clients'
        },
        children: [
          {
            path: '',
            component: ViewClientsComponent,
            data: {
              breadcrumb: 'View Clients',
              pageTitle: 'View Clients'
            },
          }]
      }, {
        path: 'chat',
        component: ChatComponent,
        data: {
          breadcrumb: 'Messaging',
          pageTitle: 'Chat'
        }
      },
      {
        path: 'access-management',
        component: ClientsComponent,
        data: {
          breadcrumb: 'User Management',
          pageTitle: 'User Management'
        },
        children: [
          {
            path: '',
            component: AccessManagementComponent,
            data: {
              breadcrumb: 'Access Management',
              pageTitle: 'Access Management'
            },
          }]
      },
      {
        path: 'libraries',
        component: LibrariesComponent,
        data: {
          breadcrumb: 'Libraries',
          pageTitle: 'Libraries'
        },
        children: [
          {
            path: '',
            component: GlobalLibrariesComponent,
            data: {
              breadcrumb: 'Global Libraries',
              pageTitle: 'Global Libraries'
            },
          },
          {
            path: 'medication',
            component: MedicationComponent,
            data: {
              breadcrumb: 'Medication',
              pageTitle: 'Medication'
            },
          }]
      },
      {
        path: 'participant-dashboard/:id/:participantName/:viewName',
        component: ParticipantDashboardComponent,
        data: {
          breadcrumb: 'Patient List',
          pageTitle: 'ParticipantDashboard'
        },
        children: [
          {
            path: '',
            component: ViewParticipantComponent,
            data: {
              breadcrumb: 'Participant Dashboard',
              pageTitle: 'ParticipantDashboard'
            },
          },
          {
            path: 'ccd-medical-records/:selectedCCD',
            component: CcdMedicalRecordsComponent,
            data: {
              breadcrumb: 'Medical Records',
              pageTitle: 'Medical Records'
            },
          },         
          {
            path: 'patientCarePlan',
            component: PatientCarePlanComponent,
            data: {
              breadcrumb: 'Care Plans',
              pageTitle: 'PatientCare Plan'
            }
          },
          {
            path: 'patientCareTeam',
            component: ParticipantCareTeamComponent,
            data: {
              breadcrumb: 'Patient Care Team',
              pageTitle: 'PatientCareTeamList'
            }
          },
          {
            path: 'eventLog',
            component: EventLogComponent,
            data: {
              breadcrumb: 'Event Log',
              pageTitle: 'Event Log'
            },
            children: [
              {
                path: '',
                component: EventLogListComponent,
                data: {
                  breadcrumb: 'Event Log',
                  pageTitle: 'Event Log'
                }
              },              
              {
                path: 'assessment/:eventId',
                component: EventlogAssessmentDetailsComponent,
                data: {
                  breadcrumb: 'Assessment',
                  pageTitle: 'Assessment Details'
                }
              }
            ]            
          },
          {
            path: 'participantHealthStatus',
            component: ParticipantHealthStatusComponent,
            data: {
              breadcrumb: 'Vital Details',
              pageTitle: 'Participant Health Status'
            }
          },
          {
            path: 'participantAssessments',
            component: ParticipantAssessmentComponent,
            data: {
              breadcrumb: 'Assessment List',
              pageTitle: 'Assessment List'
            }
          }]
      },
      {
        path: 'careTeam/:id',
        component: CareTeamComponent,
        data: {
          breadcrumb: 'Care Team',
          pageTitle: 'Care Team'
        },
        children: [
          {
            path: '',
            component: CareTeamListComponent,
            data: {
              breadcrumb: 'Care Team List',
              pageTitle: 'CareTeamsList'
            },
          }]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [CanActivateViaAuthGuard]
})
export class HomeRoutingModule { }

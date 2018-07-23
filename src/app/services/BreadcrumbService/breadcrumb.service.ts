import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MenuItem } from 'primeng/primeng';
import { PAGE_NAME } from '../../constants/other-constants';
import { LABEL_NAME } from '../../constants/other-constants';
import { LocalStorageService } from 'angular-2-local-storage';
import { IUserDetail } from '../../models';

@Injectable()
export class BreadcrumbService {

  public breadcrumbItem: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>([]);
  private itemBreadcrums: MenuItem[];
  private userDetails: IUserDetail;

  constructor(private _storage: LocalStorageService) {
    this.userDetails = <IUserDetail>this._storage.get('userdetails');
  }

  setBreadcrumbs(page: string, param: Map<string, string>) {
    this.itemBreadcrums = [];
    let refList: MenuItem[] = this.getBreadcrumsLink(page, param);
    this.breadcrumbItem.next(refList);
  }
  private getBreadcrumsLink(page: string, param: Map<string, string>): MenuItem[] {
    this.itemBreadcrums = [];
    let path;
    if (param && param.get('id') && param.get('participantName')) {
      path = ['/home/participant-dashboard/', param.get('id'), param.get('participantName'), 'ParticipantProflie'];
    }

    if (page === PAGE_NAME.HOME) {
      this.itemBreadcrums.push({ label: LABEL_NAME.HOME, routerLink: ['/home'] });
      if (this.userDetails.roleType === 'ADMIN') {
        this.itemBreadcrums.push({ label: LABEL_NAME.USERS });
      }
    } else if (page === PAGE_NAME.VIEW_PARTICIPANT) {
      this.itemBreadcrums.push({ label: LABEL_NAME.HOME, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: LABEL_NAME.PARTICIPANT_LIST, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: param.get('participantName') });
    } else if (page === PAGE_NAME.HEALTH_STATUS) {
      this.itemBreadcrums.push({ label: LABEL_NAME.HOME, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: LABEL_NAME.PARTICIPANT_LIST, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: param.get('participantName'), routerLink: path });
      this.itemBreadcrums.push({ label: LABEL_NAME.HEALTH_STATUS });
    } else if (page === PAGE_NAME.PATIENT_CARE_PLAN) {
      this.itemBreadcrums.push({ label: LABEL_NAME.HOME, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: LABEL_NAME.PARTICIPANT_LIST, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: param.get('participantName'), routerLink: path });
      this.itemBreadcrums.push({ label: LABEL_NAME.CARE_PLANS });
    } else if (page === PAGE_NAME.PATIENT_CARE_TEAMS) {
      this.itemBreadcrums.push({ label: LABEL_NAME.HOME, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: LABEL_NAME.PARTICIPANT_LIST, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: param.get('participantName'), routerLink: path });
      this.itemBreadcrums.push({ label: LABEL_NAME.CARE_TEAM });
    } else if (page === PAGE_NAME.VIEW_CARE_PLAN) {
      this.itemBreadcrums.push({ label: LABEL_NAME.HOME, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: LABEL_NAME.CARE_PLANS });
    } else if (page === PAGE_NAME.VIEW_CARE_PLAN_DETAILS) {
      this.itemBreadcrums.push({ label: LABEL_NAME.HOME, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: LABEL_NAME.CARE_PLANS, routerLink: ['/home/carePlan'] });
      this.itemBreadcrums.push({ label: param.get('carePlanName') });
    } else if (page === PAGE_NAME.PATIENT_LIST_FROM_CAREPLAN) {
      this.itemBreadcrums.push({ label: LABEL_NAME.HOME, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: LABEL_NAME.CARE_PLANS, routerLink: ['/home/carePlan'] });
      path = ['/home/carePlan/carePlanDetails/', param.get('id'), param.get('carePlanName'), 'CarePlan'];
      this.itemBreadcrums.push({ label: param.get('carePlanName'), routerLink: path });
      this.itemBreadcrums.push({ label: LABEL_NAME.PARTICIPANT_LIST });
    } else if (page === PAGE_NAME.CARE_TEAM_FROM_CARE_PLAN) {
      this.itemBreadcrums.push({ label: LABEL_NAME.HOME, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: LABEL_NAME.CARE_PLANS, routerLink: ['/home/carePlan'] });
      path = ['/home/carePlan/carePlanDetails/', param.get('id'), param.get('carePlanName'), 'CarePlan'];
      this.itemBreadcrums.push({ label: param.get('carePlanName'), routerLink: path });
      this.itemBreadcrums.push({ label: LABEL_NAME.CARE_TEAM });
    } else if (page === PAGE_NAME.EVENT_LOG) {
      this.itemBreadcrums.push({ label: LABEL_NAME.HOME, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: LABEL_NAME.PARTICIPANT_LIST, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: param.get('participantName'), routerLink: path });
      this.itemBreadcrums.push({ label: LABEL_NAME.EVENT_LOG });
    } else if (page === PAGE_NAME.SEIZURE_QUESTIONNAIRE) {
      this.itemBreadcrums.push({ label: LABEL_NAME.HOME, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: LABEL_NAME.PARTICIPANT_LIST, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: param.get('participantName'), routerLink: path + '/eventLog' });
      this.itemBreadcrums.push({ label: LABEL_NAME.EVENT_LOG, routerLink: path + '/eventLog' });
      this.itemBreadcrums.push({ label: LABEL_NAME.SEIZURE_QUESTIONNAIRE });
    } else if (page === PAGE_NAME.ASSESSMENT_ANSWER) {
      this.itemBreadcrums.push({ label: LABEL_NAME.HOME, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: LABEL_NAME.PARTICIPANT_LIST, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: param.get('participantName'), routerLink: path + '/eventLog' });
      this.itemBreadcrums.push({ label: LABEL_NAME.EVENT_LOG, routerLink: path + '/eventLog' });
      this.itemBreadcrums.push({ label: LABEL_NAME.ASSESSMENT});
    } else if (page === PAGE_NAME.PARTICIPANT_PROFILE_FROM_CAREPLAN) {
      this.itemBreadcrums.push({ label: LABEL_NAME.HOME, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: LABEL_NAME.CARE_PLANS, routerLink: ['/home/carePlan'] });
      path = ['/home/carePlan/carePlanDetails/', param.get('id'), param.get('carePlanName'), 'CarePlan'];
      this.itemBreadcrums.push({ label: param.get('carePlanName'), routerLink: path });
      path = ['/home/carePlan/carePlanPatientsDetails/', param.get('id'), 'CarePlan'];
      this.itemBreadcrums.push({ label: LABEL_NAME.PARTICIPANT_LIST, routerLink: path });
      this.itemBreadcrums.push({ label: param.get('participantName') });
    } else if (page === PAGE_NAME.PATIENT_LIST_FROM_PATIENT_PROFILE) {
      this.itemBreadcrums.push({ label: LABEL_NAME.HOME, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: LABEL_NAME.PARTICIPANT_LIST, routerLink: ['/home'] });
      path = ['/home/participant-dashboard/', param.get('patientId'), param.get('patientName'), 'ParticipantProflie'];
      this.itemBreadcrums.push({ label: param.get('patientName'), routerLink: path });
      path = '/home/participant-dashboard/' + param.get('patientId') + '/' + param.get('patientName') + '/patientCarePlan/patientCarePlan';
      this.itemBreadcrums.push({ label: LABEL_NAME.CARE_PLANS, routerLink: [path] });
      path = ['/home/carePlan/carePlanDetails/', param.get('id'), param.get('carePlanName'), 'PatientProfile'];
      this.itemBreadcrums.push({ label: param.get('carePlanName'), routerLink: path });
      this.itemBreadcrums.push({ label: LABEL_NAME.PARTICIPANT_LIST });
    } else if (page === PAGE_NAME.CHAT) {
      this.itemBreadcrums.push({ label: LABEL_NAME.HOME, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: LABEL_NAME.CHAT });
    } else if (page === PAGE_NAME.VIEW_CARE_PLAN_DETAILS_FROM_PATIENTPROFILE) {
      this.itemBreadcrums.push({ label: LABEL_NAME.HOME, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: LABEL_NAME.PARTICIPANT_LIST, routerLink: ['/home'] });
      path = ['/home/participant-dashboard/', param.get('patientId'), param.get('patientName'), 'ParticipantProflie'];
      this.itemBreadcrums.push({ label: param.get('patientName'), routerLink: path });
      path = '/home/participant-dashboard/' + param.get('patientId') + '/' + param.get('patientName') + '/patientCarePlan/patientCarePlan';
      this.itemBreadcrums.push({ label: LABEL_NAME.CARE_PLANS, routerLink: [path] });
      path = ['/home/carePlan/carePlanDetails/', param.get('id'), param.get('carePlanName'), 'PatientProfile'];
      this.itemBreadcrums.push({ label: param.get('carePlanName') });
    } else if (page === PAGE_NAME.MEDICAL_RECORD) {
      this.itemBreadcrums.push({ label: LABEL_NAME.HOME, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: LABEL_NAME.PARTICIPANT_LIST, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: param.get('participantName'), routerLink: path });
      this.itemBreadcrums.push({ label: LABEL_NAME.MEDICAL_RECORD });
    } else if (page === PAGE_NAME.CARETEAM_FROM_CAREPLAN_OF_PATIENPROFILE) {
      this.itemBreadcrums.push({ label: LABEL_NAME.HOME, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: LABEL_NAME.PARTICIPANT_LIST, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: param.get('patientName'), routerLink: path });
      path = '/home/participant-dashboard/' + param.get('id') + '/' + param.get('patientName') + '/patientCarePlan/patientCarePlan';
      this.itemBreadcrums.push({ label: LABEL_NAME.CARE_PLANS, routerLink: [path] });
      path = ['/home/carePlan/carePlanDetails/', param.get('carePlanId'), param.get('carePlanName'), 'PatientProfile'];
      this.itemBreadcrums.push({ label: param.get('carePlanName'), routerLink: path });
      this.itemBreadcrums.push({ label: LABEL_NAME.CARE_TEAM });
    } else if (page === PAGE_NAME.PATIENT_LIST_FROM_CAREPLAN_OF_PATIENTPROFILE) {
      this.itemBreadcrums.push({ label: LABEL_NAME.HOME, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: LABEL_NAME.PARTICIPANT_LIST, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: param.get('patientName'), routerLink: path });
      path = '/home/participant-dashboard/' + param.get('id') + '/' + param.get('patientName') + '/patientCarePlan/patientCarePlan';
      this.itemBreadcrums.push({ label: LABEL_NAME.CARE_PLANS, routerLink: [path] });
      path = ['/home/carePlan/carePlanDetails/', param.get('carePlanId'), param.get('carePlanName'), 'PatientProfile'];
      this.itemBreadcrums.push({ label: param.get('carePlanName'), routerLink: path });
      this.itemBreadcrums.push({ label: LABEL_NAME.PARTICIPANT_LIST });
    } else if (page === PAGE_NAME.ASSESSMENT) {
      this.itemBreadcrums.push({ label: LABEL_NAME.HOME, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: LABEL_NAME.PARTICIPANT_LIST, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: param.get('participantName'), routerLink: path });
      this.itemBreadcrums.push({ label: LABEL_NAME.ASSESSMENT });
    } else if (page === PAGE_NAME.ACCESS_MANAGEMENT) {
      this.itemBreadcrums.push({ label: LABEL_NAME.HOME, routerLink: ['/home'] });
      this.itemBreadcrums.push({ label: LABEL_NAME.USER_MANAGEMENT });
      this.itemBreadcrums.push({ label: LABEL_NAME.ACCESS_MANAGEMENT });
    }
    return this.itemBreadcrums;
  }


}


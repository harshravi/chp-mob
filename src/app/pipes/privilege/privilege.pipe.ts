import { Pipe, PipeTransform } from '@angular/core';
import { CommonUtil } from '../../utils/common.util';
import { AppACLService, AclService } from '../../services';
import * as _ from 'lodash';

@Pipe({ name: 'privilege' })
export class PrivilegePipe implements PipeTransform {

    /**
     * constructor implementation
     * @param {AclService} _aclService 
     * @memberof PrivilegePipe
     */
    constructor(private _aclService: AclService) {

    }

    /**
     * Implementation for PipeTransform interface method - transform
     * 
     * @param {(string[] | string)} value
     * @returns {boolean}
     * @memberof PrivilegePipe
     */
    transform(value: string[] | string): boolean {

        // this._aclService.data.abilities['STAFF'] = _.without(this._aclService.data.abilities['STAFF'],
        //     'ROLE_view_medicalrecords_participantdocumentation');

        // this._aclService.data.abilities['STAFF'] = _.without(this._aclService.data.abilities['STAFF'],
        //     'ROLE_delete_medication _medicationmanagement');

        //return this._aclService.canAny(this.getRealRoleName(value));
        //disabled the role & permission for the MCH
        return true;
    }

    /**
     * get the real name which is stored in localstorage for given simple value
     * 
     * @param {(string[] | string)} value 
     * @returns {(string[])} 
     * @memberof PrivilegePipe
     */
    getRealRoleName(value: string[] | string): string[] {

        if (_.isString(value)) {
            return [this._getRoleName(value)];
        } else {
            return _.map(value, masked => {
                return this._getRoleName(masked);
            });
        }

    }

    /**
     * Helper method for the "getRealRoleName" public method
     * 
     * @private
     * @param {string} roleNameMask 
     * @returns {string} 
     * @memberof PrivilegePipe
     */
    private _getRoleName(roleNameMask: string): string {
        switch (roleNameMask) {
            case 'addMedication':
            case 'ROLE_add_medication _medicationmanagement':
                return 'ROLE_add_medication _medicationmanagement';

            case 'viewMedication':
            case 'ROLE_view_medication _medicationmanagement':
                return 'ROLE_view_medication _medicationmanagement';

            case 'editMedication':
            case 'ROLE_edit_medication _medicationmanagement':
                return 'ROLE_edit_medication _medicationmanagement';

            case 'deleteMedication':
            case 'ROLE_delete_medication _medicationmanagement':
                return 'ROLE_delete_medication _medicationmanagement';

            case 'viewPrimaryDiagnosis':
            case 'ROLE_view_conditions_participantdocumentation':
                return 'ROLE_view_conditions_participantdocumentation';

            case 'viewMedicalrecords':
            case 'ROLE_view_medicalrecords_participantdocumentation':
                return 'ROLE_view_medicalrecords_participantdocumentation';

            case 'addPrimaryDiagnosis':
            case '"ROLE_add_conditions_participantdocumentation':
                return 'ROLE_add_conditions_participantdocumentation';

            case 'deletePrimaryDiagnosis':
            case 'ROLE_delete_primarydiagnosis&comorbidities_participantdocumentation':
                return 'ROLE_delete_primarydiagnosis&comorbidities_participantdocumentation';

            /**Care Plan Management**/
            /*Currently not handled*/
            case 'viewCreateProgramCarePlanManagement':
            case 'ROLE_view_create program_careplanmanagement':
                return 'ROLE_view_create program_careplanmanagement';

            /*Currently not handled*/
            case 'viewParticipantsEnrolledCarePlanManagement':
            case 'ROLE_view_participants enrolled_careplanmanagement':
                return 'ROLE_view_participants enrolled_careplanmanagement';

            /*Currently not handled*/
            case 'viewUnassignedParticipantsCarePlanManagement':
            case 'ROLE_view_unassigned participants_careplanmanagement':
                return 'ROLE_view_unassigned participants_careplanmanagement';

            case 'viewProgramOverviewCarePlanManagement':
            case 'ROLE_view_program overview_careplanmanagement':
                return 'ROLE_view_program overview_careplanmanagement';

            case 'addSendInviteCarePlanManagement':
            case 'ROLE_add_send invite_careplanmanagement':
                return 'ROLE_add_send invite_careplanmanagement';

            /*Currently not handled*/
            case 'addUnassignedParticipantsCarePlanManagement':
            case 'ROLE_add_unassigned participants_careplanmanagement':
                return 'ROLE_add_unassigned participants_careplanmanagement';

            /*Currently not handled*/
            case 'addCreateProgramCarePlanManagement':
            case 'ROLE_add_create program_careplanmanagement':
                return 'ROLE_add_create program_careplanmanagement';

            /*Currently not handled*/
            case 'editCreateProgramCarePlanManagement':
            case 'ROLE_edit_create program_careplanmanagement':
                return 'ROLE_edit_create program_careplanmanagement';

            /**Secure messaging Management**/
            case 'viewChatSecureMessaging':
            case 'ROLE_view_chat_securemessaging':
                return 'ROLE_view_chat_securemessaging';

            /**Vitals Management**/
            case 'viewVitalsManagement':
            case 'ROLE_view_notificationsbell_vitalsmanagement':
                return 'ROLE_view_notificationsbell_vitalsmanagement';
            default:
                return roleNameMask;
        }
    }
}


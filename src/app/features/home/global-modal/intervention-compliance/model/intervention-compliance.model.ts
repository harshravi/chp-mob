export class CareplanCMPLDetail {
    selected: boolean;
    task_id: number;
    task_type: string;
    event_timestamp: number;
    event_status: number;
    action_count?: number;
    event_type: string;
    event_type_desc: string;
    event_value: string;
    event_valueExt?: string;
    unit?: number;
    variance: string;
    varianceUnit?: string;
    selected_flag: boolean;
}

export class MedicationCMPLDetails {
    selected: boolean;
    task_id: number;
    task_type: string;
    event_timestamp: number;
    event_status: number;
    action_count?: number;
    event_type: string;
    event_type_desc: string;
    event_value: string;
    event_valueExt?: string;
    unit?: number;
    variance: string;
    varianceUnit?: string;
    selected_flag: boolean;
}

export class InterventionComplianceModel {
    participant: string;
    participant_id: string;
    prev_participant_id?: string;
    next_participant_id?: string;
    participant_name: string;
    diagnosis: string[];
    careplanCMPLDetails: CareplanCMPLDetail[];
    medicationCMPLDetails: MedicationCMPLDetails[];
}


export interface IVitalTasks {
    action_count: number;
    next_participant_id: string;
    participant_id: string;
    participant_name: string;
    phone_number: string;
    prev_participant_id: string;
    read_flag: number;
    symptom_asseement: number;
    timestamp: number;
    vital_count: number;
    vital_status: number;
    vital_desc: string[];
    diagnosis: string[];
    vitalDetails: IVitalDetails[];
    symptomAssessmentDetails: ISymptomAssessmentDetails;
};

export interface IVitalDetails {
    action_count: number;
    event_status: number;
    event_timestamp: number;
    event_type: string;
    event_type_desc: string;
    event_value: string;
    event_valueExt: string;
    reassign_count: number;
    selected: boolean;
    snooze_count: number;
    taskReadFlag: number;
    task_id: number;
    task_type: string;
    unit: string;
    variance: string;
    varianceUnit: string;
};

export interface ISymptomAssessmentDetails {
    assessment_expired_msg: string;
    assessment_pending_msg: string;
    symptom_assessment_summary_id: number;
    symptom_reported_time: number;
}
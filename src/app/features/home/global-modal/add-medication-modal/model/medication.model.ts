export interface IDose {
    dose_taken_flag: number;
    dose_time: string;
    old_dose_time: string;
}

export interface IMedication {
    acknowledgement: string;
    active_ingred_unit: string;
    active_numarator_strength: string;

    dosage:
    string;
    dose_schedule_modifiable_flag: string;
    doses: IDose[];
    drugNameDetail: string;
    drug_id: number;
    drug_name: string;
    form: string;
    frequency: number;
    last_taken_time: string;
    medStatus: number;

    medStatusColor: string;
    medication_end_date: string;
    medication_id: string;
    medication_reminder_id: string;
    medication_start_date: string;
    medication_status: string;
    medication_taken_percentage: string;
    note: string;
    participant_id: string;
    program_reference_number: string;
    skipped_count: number;
    snooze: string;
    substance_name: string;
    taken_count: number;
}

export interface IErrorMessage {
    isFrequencyMinFailed?: boolean;
    isFrequencyMaxFailed?: boolean;
}

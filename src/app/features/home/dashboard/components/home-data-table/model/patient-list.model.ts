export interface IVitalList {
    value: string;
    vital_type: string;
    value_ext: string;
    vital_status: number;
    received_date: number;
    unit: string;
}

export interface ICarPlanName {
    care_plan_name: string;
    care_plan_compliance: number;
}

export interface IMedicationDetail {
    medication_id: number;
    medication_name: string;
}

export interface IDashboardPatientDetail {
    participant_id: string;
    participant_name: string;
    age: number;
    care_plan_count: number;
    meds_count: number;
    medication_compliance: string;
    participant_status: number;
    vital_list: IVitalList[];
    medication_details: IMedicationDetail[];
    diagnosis: string[];
    vital_task_count: number;
    compliance_task_count: number;
    care_plan_names: ICarPlanName[];
    last_intervention_time: number;
    overall_careplan_compliance: string;
}

export interface IPatientListGridRequest {
    my_patients: boolean;
    program_nums: string[];
    risk_status: string[];
    offset: number;
    search_params: string;
}

export interface IPatientListGridData {
    count: number;
    staff_dashboard_search_result: IDashboardPatientDetail[];
}


















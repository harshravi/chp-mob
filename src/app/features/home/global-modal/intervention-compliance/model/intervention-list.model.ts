
export class OutcomeType {
    selected_flag: boolean;
    snooze_duration: number;
    isDisabled: boolean;
    outcome_type_cd: string;
    multi_selectable: number;
    outcome_type_group: string;
    snooze_duration_type: string;
}

export class InterventionType {
    selected_flag: string;
    intervention_type_cd: string
    outcome_type_cd:string
    snooze_duration: number
    snooze_duration_type: string
}

export class InterventionList {
    assigned_to_staff_id: string;
    assign_to_users: string[];
    intervention_notes: string;
    outreaching_agent_id: string;
    selected_outcome_types: string[];
    selected_intervention_types: string[];
    intervention_types?: InterventionType[];
    outcome_types?: OutcomeType[];
    selected_outreach_type_cd: string;
    task_ids: string[];
    participant_id: string;
    event_reported_by_email: string;
    event_reported_by_name: string;
    event_type: string;
    event_trigger_type: string;
}
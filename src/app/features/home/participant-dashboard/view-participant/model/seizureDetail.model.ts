export interface ISeizureDetail {
    occurrence: string;
    occurrence_details: string;
    type: string;
    seizure_name: string;
    solution: string;
    seizure_description: string;
    reason: string;
    question?: ISeizureDetail;
    updated_date?: number;
    seizure_status?: 0 | 1;
    seizureDate?: number;
    assessment_date?: number;
};

export interface IReviewQuestionnaire {
    isAvailable: boolean;
    assessmentStatus: 0 | 1;
    assessmentName: string;
}

export interface ISeizureDetails {
    questions: ISeizureDetail[];
    reviewQuestionnaire: IReviewQuestionnaire;
}

export interface IAssessmentModalData {
    //  participantName: string;
    seizureDetails: ISeizureDetail[];
    isEpilepsy: boolean;
    assessment_name: string;
    participant_name: string;
}

export interface ISeizureQuestionModel {
    selected_language: string;
    seizure_types: ISeizureQuestionType[];
    is_review_questions?: string;
    assessment_status?: '1' | '0';
    assessment_name?: string;
}

export interface ISeizureQuestionType {
    type_english: string;
    type_spanish: string;
    questions: ISeizureQuestionDetail[];
}

export interface ISeizureQuestionDetail {
    seizure_question_english: string;
    seizure_question_id: string;
    seizure_question_spanish: string;
}


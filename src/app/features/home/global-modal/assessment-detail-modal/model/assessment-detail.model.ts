import { ISeizureDetails, ISeizureQuestionModel } from '../../../participant-dashboard/view-participant/model/seizureDetail.model';

export interface IFirstAssessmentDetail {
    seizureDetails: ISeizureDetails;
    seizureQuestion: ISeizureQuestionModel;
};

export interface IAssessmentQuestionDetails {

    assessmentId?: string;
    participantId?: string;
    participantName?: string;

    [index: string]: any;
}

export interface IReviewQuestionnaireQuestionsScale {
    scale_english: string;
    scale_spanish: string;
    scale_value: string;
    scale_id: string;
    showCheckbox?: boolean;
    fontStrong?: string;
}

export interface IReviewQuestionnaireQuestions {
    assessment_id: number;
    topic_english: string;
    topic_spanish: string;
    assessment_english: string;
    assessment_spanish: string;
    scale_type: string;
    scales: IReviewQuestionnaireQuestionsScale[];
    answer: string;
    answer_text_english: string;
    answer_text_spanish: string;
    correct_answer: string;
    answer_string: string;
    isUserAnswerCorrect?: boolean;
}

export interface IReviewQuestionnaireDetail {
    participant_id: string;
    assessment_name: string;
    assessment_id: string;
    assessment_summary_id: number;
    assessment_status: string;
    assessment_count: string;
    completed_date: number;
    assessment_date: string;
    assessment_msg_english: string;
    assessment_msg_spanish: string;
    language: string;

    assessment_questions: IReviewQuestionnaireQuestions[];
}


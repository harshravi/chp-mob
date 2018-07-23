export interface IDateFilter {

    daysOptionSelected: string;
    startDate: IMoment;
    endDate: IMoment;
    isDatePrevBtnDisabled: boolean;
    isDateNextBtnDisabled: boolean;

    checkNextBtnVisibility: () => void;
    datePrevClick: () => void;
    dateNextClick: () => void;
    daysOptionChange: () => void;
    init: void;

}
export interface IErrorMessage {
    isPEFMinError?: boolean;
    isFEV1MinError?: boolean;
    isFVCMinError?: boolean;
    isPEFMaxError?: boolean;
    isFEV1MaxError?: boolean;
    isFVCMaxError?: boolean;
    isOneValueRequiredError?: boolean;
}

export type LungDataStatusType = 1 | 0;

export interface ILungDataStatus {
    pef_status: LungDataStatusType;
    fev1_status: LungDataStatusType;
    fvc_status: LungDataStatusType;
}

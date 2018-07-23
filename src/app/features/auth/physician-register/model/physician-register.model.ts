export interface IRegistrationData {
    error_message: string;
    email_id: string;
    role_name: string;
    role_id: string;
    first_name: string;
    last_name: string;
    mobile_number: string;
    opt?: string;
    password: string;
    confirm_password: string;
    timezone_offset: number;
    registration_type: number;
    address: IUserAddress;
    user_id?: string;
}

export interface IUserAddress {
    address_line_1: string;
    city: string;
    state: string;
    zip_code: string;
}

export interface IRegPersonalDetail extends IRegistrationData {
    address_line_1: string;
    city: string;
    state: string;
    zip_code: string;
}

export interface IPasswordForm {
    password: string;
    confirm_password: string;
}

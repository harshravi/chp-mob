export interface IProgramDetails {
    staff_details: IStaffDetails[];
    end_date: string;
    program_ref_no: string;
    program_name: string;
    edit: boolean;
}

export interface IStaffDetails {
    staff_name_initials: string;
    staff_role: string;
    phone_number: string;
    staff_name: string;
    staff_id: string;
}

export interface IInvitationDetail {
    email_id: string;
    program_ref_no: string;
    staff_id: string;
    dob: string;
    gender: string;
    first_name: string;
    last_name: string;
    mrn: string;
}



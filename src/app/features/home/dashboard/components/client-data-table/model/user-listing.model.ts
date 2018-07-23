export interface IUserListForClient {
    care_team_user_list: IUsers[];
    role_sort_list: IRoleList[];
};

export interface IUsers {
    access: string;
    editable: boolean;
    editable_flag: boolean;
    email_id: string;
    facility_name: string;
    options: string[];
    role_id: string;
    role_name: string;
    staff_id: string;
    status: string;
    user_id: string;
    user_name: string;
    roleList: IRoleList[];
};

export interface IRoleList {
    role_desc: string;
    role_id: string;
    role_name: string;
    role_type: string;
}

export interface IColumns {
    prop: string;
    name: string;
}

export interface IgriObject {
    invited: boolean;
    disabled: boolean;
    role_name_search: string;
}

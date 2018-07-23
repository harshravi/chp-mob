export interface IContact {
    active_chat_user: IActiveChatUser[];

}

export interface IActiveChatUser {
    updatedDate: string;
    token: string
    messages: string[];
    active_user: string;
}

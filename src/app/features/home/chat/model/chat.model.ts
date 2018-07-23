export interface IChatUser {
    lastMessage: string;
    messages: IMessageObj[];
    unread: number;
    isTyping: string;
    presence: string;
    name_initials: string;
    active_user: string;
    displayName: string;
    isChatOpen: boolean;
    firstName: string;
    lastName: string;
    updatedDate: Date;
}

export interface IChannel {
    uniqueName: string;
}

export interface IMessageObj {
    createdDate?: Date;
    decryptedBody: string;
    body: string;
    timestamp: Date;
    recipientStatus: string;
    direction: string;
    author: string;
    index: number;
    timeStampForSorting: Date;
    channel: IChannel;

}

export interface IEncryptionObj {
    message_sender_id: string;
    message_sender_full_name: string;
    channel_name: string;
    message_sent_date: Date;
    message_receiver_id: string;
    message_receiver_full_name: string;
    message_content: string;
}

export interface IDecryptionObj {
    message_sender_id: string;
    message_sender_full_name: string;
    channel_name: string;
    message_sent_date: string;
    message_receiver_id: string;
    message_receiver_full_name: string;
    message_content: string;
    message_ref_ids: string[];
}

export interface IPushNotificationObj {
    reference_id: string;
    ref_type: string;
    title: string;
    body: string;
    param1: string;
}

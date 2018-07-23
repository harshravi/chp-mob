export const AUTH_CONSTANT = {
    'LOGIN': '/login',
    'LOGOUT': '/logout',
    'mchRegistration': '/ldapUser/staffRegistration',
    'SECURE_CHAT_CREDENTIALS' : '/staff/securechat/getSecureChatCredentials',
    'CHAT_USER_LIST_OF_CONTACTS' : '/staff/securechat/getChatUserDetails',
    'MESSAGE_ARCHIVAL' : '/staff/securechat/messageStore/archiveMessage',
    'LOAD_ARCHIVED_MESSAGES' : '/staff/securechat/messageStore/loadMoreMessages',
    'SEND_PUSH_NOTIFICATION' : '/staff/securechat/sendPushNotification',
    'GET_ACCESS_TOKEN': '/staff/securechat/getAccessToken',
    'MESSAGE_ENCRYPTION': '/staff/securechat/messageStore/encryptTextMessage',
    'MESSAGE_DECRYPTION': '/staff/securechat/messageStore/decryptTextMessage',
    'REGISTER_PHYSICIAN' : '/registration/createUserAccount',
    'PASSCODE' : '/registration/validateOtp',
    'USER_INVITATION' : '/registration/loadInviteUserDetails?invitation_code='
};

export const ALL_USER_LIST = 'ALL_USER_LIST';
export const MY_RECENT_USER_CHAT_LIST = 'MY_RECENT_USER_CHAT_LIST';
export const CHAT_USER = 'CHAT_USER';
export const CHAT_DATA = 'CHAT_DATA';
export const ADD_SINGLE_CHAT_DATA = 'ADD_SINGLE_CHAT_DATA';

// ************************************** Action Creator ************************************************/

export const setAllUerList = allUser => {
    return {
        type: ALL_USER_LIST,
        payload: allUser
    };
};

export const setMyRecentUserChatList = myRecentUserChatList => {
    return {
        type: MY_RECENT_USER_CHAT_LIST,
        payload: myRecentUserChatList
    };
};

export const setChatUser = chatUser => {
    return {
        type: CHAT_USER,
        payload: chatUser
    };
};

export const setChatData = (chatData, id) => {
    return {
        type: CHAT_DATA,
        payload: chatData,
        id : id
    };
};

export const setSingleChatData = (chatData, id) => {
    return {
        type: ADD_SINGLE_CHAT_DATA,
        payload: chatData,
        id : id
    };
};
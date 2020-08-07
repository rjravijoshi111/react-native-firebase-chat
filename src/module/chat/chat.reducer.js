/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
import {
    ALL_USER_LIST,
    MY_RECENT_USER_CHAT_LIST,
    CHAT_USER,
    CHAT_DATA,
    ADD_SINGLE_CHAT_DATA,
} from './chat.action';

const _ = require("lodash");

const INITIAL_STATE = {
    allUser: [],
    myRecentUserChatList: [],
    chatUser : undefined,
    chatData : {},
};


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        case ALL_USER_LIST:
            return {
                ...state,
                allUser: action.payload,
            };
        case MY_RECENT_USER_CHAT_LIST:
            console.log('action.payload-->', JSON.stringify(action.payload))
            let tempMyRecentUserChatList = action.payload;
            
            console.log('action.payload-->', JSON.stringify(_.orderBy(tempMyRecentUserChatList,['createdAt'],['desc'])))
            return {
                ...state,
                myRecentUserChatList: _.orderBy(tempMyRecentUserChatList,['createdAt'],['desc']),
            };
        case CHAT_USER:
            return {
                ...state,
                chatUser: action.payload,
            };
        case CHAT_DATA:
            let myData = state.chatData || {}
            myData[action.id] = action.payload
            return {
                ...state,
                chatData: {...myData},
            };
        case ADD_SINGLE_CHAT_DATA:
            let chatData = state.chatData || {}; 
            let selectedChatData = chatData[action.id] || []
            selectedChatData.unshift(action.payload)
            chatData[action.id] = selectedChatData;

            console.log('ADD_SINGLE_CHAT_DATA chatData-->',chatData);
            return {
                ...state,
                chatData: {...chatData},
            };
        default:
            return state;
    }
};
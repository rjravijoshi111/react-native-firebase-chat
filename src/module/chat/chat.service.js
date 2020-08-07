
import * as GeneralAction from "@general/general.action";
import Lang from "@config/localization"
import * as ChatAction from './chat.action';
import { goBackAction } from '@config/helper';
import globals from '@constant/globalsConst';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import {Notifications} from 'react-native-notifications';
import _ from 'lodash';


/**
 * getNewUserList API
 */
export const getNewUserList = (data) => async (dispatch,getStore) => {
    dispatch(GeneralAction.setLoadingIndicator(true));
    return database()
        .ref('/Users')
        .on('value', snapshot => {
            dispatch(GeneralAction.setLoadingIndicator(false));
            let newUserList = [];
            let currentUserId  = _.get(getStore(),'auth.userData.uid');
            console.log('currentUserId-->',currentUserId);
            snapshot.forEach(item => {
                if(item.val().uid != currentUserId){
                    newUserList.push(item.val());
                }
                return false;
            });
            console.log('newUserList-->',JSON.stringify(newUserList));
            dispatch(ChatAction.setAllUerList(newUserList));
        });
}

export const getChatUserList = () => async (dispatch,getStore) => {
    
    let userData = getStore().auth.userData;
    let chatUserRef = database().ref().child("ChatList/"+userData.uid+"/member/");

    chatUserRef.on("child_changed",async snap => {
        console.log("data.ref.key-->",snap.ref.key);
        console.log("child_changed snap-->",JSON.stringify(snap));
        let createdAt = snap.val().createdAt;
        let myRecentUserChatList = getStore().chat.myRecentUserChatList;
        let selectedInItemIndex = myRecentUserChatList.findIndex(x => x.createdAt == createdAt)
        if(selectedInItemIndex == -1){
            let chatUserId = snap.ref.key
            await database().ref().child("Users/"+chatUserId).once('value',userSnap =>{
                console.log("child_changed User snap-->",JSON.stringify(userSnap));
                let item = {
                    ...userSnap.val(),
                    ...snap.val(),
                    uid : chatUserId
                }
                console.log("item-->",JSON.stringify(item));
                let userIndex = myRecentUserChatList.findIndex(x => x.uid == userSnap.val().uid)
                if(userIndex > -1){
                    myRecentUserChatList.splice(userIndex,1);
                }
                myRecentUserChatList.unshift(item);

                console.log("myRecentUserChatList-->",JSON.stringify(myRecentUserChatList));

                // if(userData.uid != chatUserId){
                //     console.log("Notification display-->");
                //     Notifications.postLocalNotification({
                //         title: item.name,
                //         body: item.text,
                //         userInfo: { }
                //     });
                // }
                dispatch(ChatAction.setMyRecentUserChatList(myRecentUserChatList));
            });
        } else {
            let selectedItem = myRecentUserChatList[selectedInItemIndex];
            selectedItem.isTyping = snap.val().isTyping;
            myRecentUserChatList[selectedInItemIndex] = selectedItem;
            dispatch(ChatAction.setMyRecentUserChatList(myRecentUserChatList));
        }
    });

    chatUserRef.on("child_added",async snap => {
        console.log("child_added snap data-->",JSON.stringify(snap));
        let chatUserId = snap.ref.key
        console.log("child_added snap-->",JSON.stringify(chatUserId));
        if(chatUserId != undefined){
            await database().ref().child("Users/"+chatUserId).once('value',userSnap =>{
                console.log("child_added User snap-->",JSON.stringify(userSnap));
                let item = {
                    ...userSnap.val(),
                    ...snap.val(),
                    uid : chatUserId
                }
                let myRecentUserChatList = getStore().chat.myRecentUserChatList;
                let userIndex = myRecentUserChatList.findIndex(x => x.uid == userSnap.val().uid)
                if(userIndex > -1){
                    myRecentUserChatList.splice(userIndex,1);
                }
                myRecentUserChatList.unshift(item);
                dispatch(ChatAction.setMyRecentUserChatList(myRecentUserChatList));
            });
        }
    });
    
}

export const setMessageRead = (userId)=> async(dispatch, getStore) => {
    
    let myRecentUserChatList = getStore().chat.myRecentUserChatList
    let index = myRecentUserChatList.findIndex(x => x.uid == userId);
    let userData = myRecentUserChatList[index];
    userData.isRead = true;
    myRecentUserChatList.slice(userData,index);
    let tempData = JSON.stringify(myRecentUserChatList);
    dispatch(ChatAction.setMyRecentUserChatList(JSON.parse(tempData)));
}

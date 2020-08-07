import { Alert, Platform } from 'react-native';
import * as GeneralAction from "@general/general.action";
import * as GeneralService from "@general/general.service";
import Lang from "@config/localization";

import { goBackAction, replaceToScreen } from '@config/helper';
import * as AuthAction from './auth.action';
import * as ChatService from '@chat/chat.service';
import _ from 'lodash';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export const TAG = "== auth.service.js :";

export const signup = (data) => async (dispatch) => {
    dispatch(GeneralAction.setLoadingIndicator(true));
    return auth()
    .createUserWithEmailAndPassword(data.email,data.password)
    .then(() =>{
        dispatch(GeneralAction.setLoadingIndicator(false));
        auth().onAuthStateChanged((user) =>{
            console.log('user-->',JSON.stringify(user));
            let uid = new Date(_.get(user,'metadata.creationTime')).getTime();
            
            const newReference = database()
                .ref('/Users/'+uid)
                newReference
                .set({
                    email : data.email,
                    name: data.name,
                    uid: uid,
                    about : "Hey there, I am using ChatApp."
                });

            // database().ref().child("/ChatList/"+user.uid).push()
            

            if(user.emailVerified){
                user.sendEmailVerification({
                    handleCodeInApp: false,
                    url: 'app/email-verification',
                });
            }
        });

        Alert.alert(Lang.APP_NAME, Lang.COMMON_MESAGE.REGISTER_SUCCESFULLY, [
            {
                text: Lang.ok, onPress: () => { goBackAction() }, style: 'cancel'
            }
        ]);
    })
    .then(() =>{

    })
    .catch(error =>{
        dispatch(GeneralAction.setLoadingIndicator(false));
        if (error.code === 'auth/email-already-in-use') {
            Alert.alert(Lang.APP_NAME, Lang.COMMON_MESAGE.USER_EXIST, [
                {
                    text: Lang.ok, onPress: () => { }, style: 'cancel'
                }
            ]);
          }
      
          if (error.code === 'auth/invalid-email') {
            Alert.alert(Lang.APP_NAME, Lang.COMMON_MESAGE.INVALID_EMAIL, [
                {
                    text: Lang.ok, onPress: () => { }, style: 'cancel'
                }
            ]);
          }
    })
    
            
}


/**
 * userSignIn API
 */
export const userSignIn = (data) => async (dispatch,getStore) => {
    dispatch(GeneralAction.setLoadingIndicator(true));
    
    return auth()
    .signInWithEmailAndPassword(data.email,data.password)
    .then((response) =>{
        dispatch(GeneralAction.setLoadingIndicator(false));
        let uid = new Date(_.get(response,'user.metadata.creationTime')).getTime();

        let loginUserReferance = database().ref().child('Users/'+uid);
        
        loginUserReferance
            .update({
                token: getStore().general.FCMToken || '',
            }).then(() =>{
                loginUserReferance.once('value')
                .then((snap) =>{
                    console.log("login uset snap-->", snap.val());
                    let tempResponse = snap.val();
                    console.log('login response-->',JSON.stringify(tempResponse));
                    dispatch(AuthAction.setUserData(tempResponse))
                    setTimeout(() =>{
                        dispatch(GeneralAction.setLoadingIndicator(false));
                        dispatch(GeneralService.updateOnlineStatus(true));
                        dispatch(ChatService.getChatUserList())
                        dispatch(ChatService.getNewUserList())
                        replaceToScreen("TabNavigator")
                    },1000)
                    
                })
            });
    })
    .catch(error =>{
        dispatch(GeneralAction.setLoadingIndicator(false));
        console.log('error-->',error)
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            Alert.alert(Lang.APP_NAME, Lang.COMMON_MESAGE.INVALID_EMAIL_PASSWORD, [
                {
                    text: Lang.ok, onPress: () => { }, style: 'cancel'
                }
            ]);
        }
    })
}

/**
 * logout API
 */
export const logout = () => async (dispatch,getStore) => {
    dispatch(GeneralAction.setLoadingIndicator(true));
    return auth()
    .signOut()
    .then(() =>{

        let uid = _.get(getStore(),'auth.userData.uid');

        let loginUserReferance = database().ref().child('Users/'+uid);
        
        loginUserReferance
            .update({
                token: '',
            }).then(() =>{
                replaceToScreen('AuthNavigator');
                dispatch(GeneralAction.setLoadingIndicator(false));
                dispatch(GeneralService.updateOnlineStatus(false));
                dispatch(AuthAction.setLogoutUser());
            });

        
    })
    .catch(error =>{
        dispatch(GeneralAction.setLoadingIndicator(false));
        console.log('error-->',error)
        replaceToScreen('AuthNavigator');
        dispatch(GeneralAction.setLoadingIndicator(false));
        dispatch(GeneralService.updateOnlineStatus(false));
        dispatch(AuthAction.setLogoutUser());
        
    })
}

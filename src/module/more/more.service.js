import { Alert, Platform } from 'react-native';

import * as GeneralAction from "@general/general.action";
import * as AuthAction from "@auth/auth.action";
import Lang from "@config/localization";
import {loginUserReferance, getUser} from "@config/firebaseHelper";

import { goBackAction, replaceToScreen } from '@config/helper';
import * as MoreAction from './more.action';
import * as ChatService from '@chat/chat.service';
import _ from 'lodash';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';

export const TAG = "== more.service.js :";


/**
 * updateProfile API
 */
export const updateProfile = (data) => async (dispatch, getStore) => {
    
    dispatch(GeneralAction.setLoadingIndicator(true));
    let imageUrl = data.profileImage;
    if(data.profileImage && !data.profileImage.startsWith("http")){
        let fileName = data.uid + "."+ data.profileImage.split('.').pop();;
        const reference = storage().ref(fileName);
        let imageUploadResponse = await reference.putFile(data.profileImage);
        imageUrl = await storage().ref(imageUploadResponse.metadata.fullPath).getDownloadURL();
    }

    loginUserReferance()
        .update({
            profileImage : imageUrl,
            name : data.name,
            about : data.about
        }).then(async () =>{
            let userData = await getUser(data.uid);
            console.log('userData-->', JSON.stringify(userData));
            dispatch(AuthAction.setUserData(userData))
            dispatch(GeneralAction.setLoadingIndicator(false));
        });
    
}


/* eslint-disable eqeqeq */
// /* eslint-disable prefer-destructuring */
import React from 'react';
import { Dimensions, PixelRatio, PermissionsAndroid, Alert, Platform, Linking } from 'react-native';
import { CommonActions, StackActions } from '@react-navigation/native';
import APPCONSTANT from '@constant/appConstant';
import globalsConst from '@constant/globalsConst';
import images from '@config/images';
import Lang from '@config/localization'

import FastImage from 'react-native-fast-image'
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging';
import * as GeneralAction from '@general/general.action';
import moment from 'moment';
import { store } from '../reducers';

export const widthPercentageToDP = widthPercent => {
    const screenWidth = Dimensions.get('window').width;
    // Convert string input to decimal number
    const elemWidth = parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
};
export const heightPercentageToDP = heightPercent => {
    const screenHeight = Dimensions.get('window').height;
    // Convert string input to decimal number
    const elemHeight = parseFloat(heightPercent);
    return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
};

export const widthPercentage = pixel => {
    const screenWidth = Dimensions.get('window').width;
    return screenWidth * (((pixel * 100) / screenWidth) / 100);
};

export const heightPercentage = pixel => {
    const screenHeight = Dimensions.get('window').height;
    return screenHeight * (((pixel * 100) / screenHeight) / 100);
};


export const navigateToScreen = (screenName, param = {}) => {
    store.getState().general.navigationRef.dispatch(
        CommonActions.navigate({
            name: screenName,
            params: param
        })
    )
}

export const replaceToScreen = ( screenName, param = {}) => {
    store.getState().general.navigationRef.dispatch(
        StackActions.replace(screenName, {
            params: param
        })
    )
}

export const resetToScreen = (stateObject) => {
    store.getState().general.navigationRef.dispatch(CommonActions.reset({ stateObject }))
}

export const goBackAction = () => {
    store.getState().general.navigationRef.dispatch(CommonActions.goBack());
}

export const popToTopAction = () => {
    store.getState().general.navigationRef.dispatch(StackActions.popToTop());
}

export const setDate = (date) => {
    
    let dt = ''
        let tempDate = new Date(date);
        if(tempDate.getDate() == new Date().getDate()){
            dt = moment(tempDate).format("h:mm A")
        }else if(tempDate.getDate() == new Date().getDate() - 1){
            dt = "Yesterday"
        }else if((tempDate.getDate() == new Date().getDate() - 2) || 
            (tempDate.getDate() == new Date().getDate() - 3) ||
            (tempDate.getDate() == new Date().getDate() - 4) ||
            (tempDate.getDate() == new Date().getDate() - 5)){
            dt = moment(tempDate).format("dddd")
        }else{
            dt = moment(tempDate).format("DD/MM/YYYY")
        }
        return dt;
}

export const openCamera = (options) => {
    return new Promise(async (resolve, reject) => {
        ImagePicker.openCamera(options).then(image => {
            console.log("Images-->",image)
            resolve(image)
        }).catch((error) =>{
            reject(error)
            if(error.code == "E_PERMISSION_MISSING"){
                // Alert.alert(APPCONSTANTS.APP_NAME,APPCONSTANTS.ALERT_MESSAGES.PHOTO_LIBRARY_PERIMISSION)
            }
            console.log("openCamera Error->",JSON.stringify(error));
            
        })
    })
}

export const openPicker = (options) => {
    return new Promise(async (resolve, reject) => {
        ImagePicker.openPicker(options).then(image => {
            console.log(image)
            resolve(image)
        }).catch((error) =>{
            reject(error)
            if(error.code == "E_PERMISSION_MISSING"){
            }
            console.log("Error->",JSON.stringify(error));
        })
    })
}

export const fileUpload = (fileData, type) => {
    return new Promise(async (resolve, reject) => {
        try {
            const reference = storage().ref(type+ '/'+fileData.filename);
            let fileUploadResponse = reference.putFile(fileData.uri);

            fileUploadResponse.on('state_changed', taskSnapshot => {
                console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
                const progress = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes
                console.log('progress-->', progress);

                switch (taskSnapshot.state) {
                    case 'running':
                        //   setUpload({ loading: true, progress });
                        break;
                    case 'success':
                        taskSnapshot.ref.getDownloadURL().then(downloadURL => {
                            // setUpload({ loading: false });
                            FastImage.preload([
                                {
                                    uri: downloadURL,
                                }
                            ])
                            resolve(downloadURL)
                        });
                        break;
                    default:
                        break;
                }

            });
            
            // let fileUrl = await storage().ref(fileUploadResponse.metadata.fullPath).getDownloadURL();
            // resolve(fileUrl)    
        } catch (error) {
            reject(error);
        }
    })
}

export const getFcmToken = async () => {
    return new Promise(async (resolve, reject) => {
        const enabled = await messaging().hasPermission();
        if (enabled) {
            messaging().getToken()
                .then(fcmToken => {
                    if (fcmToken) {
                        console.log("Firebase Token-->", fcmToken);
                        store.dispatch(GeneralAction.setFCMToken(fcmToken));
                        resolve(fcmToken)
                        
                    } else {
                        reject('Token denied')
                        console.log("Token denied");
                    }
                });
        } else {
            try {
                await messaging().requestPermission();
                getFcmToken()
            } catch (error) {
                reject('error')
                // User has rejected permissions
            }
        }
    });
}
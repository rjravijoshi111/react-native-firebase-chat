import React from 'react';
import { Alert } from 'react-native';
import Lang from '@src/config/localization';
import APP_CONSTANT from '@constant/appConstant';

let validator = require('validator');



// const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
// const passwordPattern = /^(?=.*?[A-Z])(?=(.*[a-z]){3,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{6,}$/;
const mailPattern = '^[^<>()[\\]\\\\,;:\\%#^\\s@\\"$?&!@]+@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z0-9\s@,=%$#&_\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF]+\\.)+[a-zA-Z]{2,}))$';
const namePattern = "^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]+[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]*$";

export const maxLengthPass = 14;

const _ = require('lodash');

/**
 * Validate SignUp Details
 * @param {*} param0
 */
export const validateRegister = ({ name, email, password, confirmPassword }) => {
    const { KEMPTY_NAME,KEMPTY_EMAIL, KINVALID_EMAIL, 
        KEMPTY_PASSWORD,KINVALID_PASSWORD, KEMPTY_VERIFYPASSWORD, KPASSWORD_DOESNOTMATCH} = Lang.COMMON_MESAGE;
    
    if (validator.isEmpty(name)){
        Alert.alert(Lang.APP_NAME,KEMPTY_NAME)
        return false;
    }

    if (validator.isEmpty(email)){
        Alert.alert(Lang.APP_NAME,KEMPTY_EMAIL)
        return false;
    }

    if (!email.match(mailPattern)) {
        Alert.alert(Lang.APP_NAME,KINVALID_EMAIL)
        return false;
    }

    if (validator.isEmpty(password)){
        Alert.alert(Lang.APP_NAME,KEMPTY_PASSWORD)
        return false;
    }

    if (!password.match(passwordPattern)) {
        Alert.alert(Lang.APP_NAME,KINVALID_PASSWORD)
        return false;
    }

    if (validator.isEmpty(confirmPassword)){
        Alert.alert(Lang.APP_NAME,KEMPTY_VERIFYPASSWORD)
        return false;
    }

    if (password != confirmPassword ) {
        Alert.alert(Lang.APP_NAME,KPASSWORD_DOESNOTMATCH)
        return false;
    }
    return true;
};

export const validateLogin = ({ email, password }) => {

    const { KEMPTY_EMAIL, KINVALID_EMAIL, KEMPTY_PASSWORD } = Lang.COMMON_MESAGE;

    if (validator.isEmpty(email)) {
        Alert.alert(Lang.APP_NAME,KEMPTY_EMAIL)
        return false;
    }

    if (!email.match(mailPattern)) {
        Alert.alert(Lang.APP_NAME,KINVALID_EMAIL)
        return false;
    }

    if (validator.isEmpty(password)) {
        Alert.alert(Lang.APP_NAME,KEMPTY_PASSWORD)
        return false;
    }

    return true;
};

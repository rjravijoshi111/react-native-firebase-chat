export const SET_LOADING_INDICATOR = 'SET_LOADING_INDICATOR';
export const SET_NAVIGATION_REF = 'SET_NAVIGATION_REF';
export const FCM_TOKEN = 'FCM_TOKEN';

/** ************************************ Action Creator *********************************************** */

export const setLoadingIndicator = isLoading => {
    return {
        type: SET_LOADING_INDICATOR,
        payload: isLoading
    };
}

export const setNavigationReference = (navigationRef) => {
    return {
        type: SET_NAVIGATION_REF,
        payload: navigationRef.current,
    };
}

export const setFCMToken = FCMToken => {
    return {
        type: FCM_TOKEN,
        payload: FCMToken
    };
}
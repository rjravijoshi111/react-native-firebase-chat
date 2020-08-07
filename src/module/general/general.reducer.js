
import {
    SET_LOADING_INDICATOR,
    SET_NAVIGATION_REF,
    FCM_TOKEN,
} from './general.action';
import globalsConst from '@constant/globalsConst';
const INITIAL_STATE = {
    isLoading: false,
    navigationRef: null,
    FCMToken: undefined,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_LOADING_INDICATOR:
            return {
                ...state,
                isLoading: action.payload
            };
        case SET_NAVIGATION_REF:
            return {
                ...state,
                navigationRef: action.payload,
            };
        case FCM_TOKEN:
            return {
                ...state,
                FCMToken: action.payload
            };
        default:
            return state;
    }
};




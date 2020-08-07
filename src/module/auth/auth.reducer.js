/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
import {
    USER_DATA
} from './auth.action';

// const _ = require("lodash");

const INITIAL_STATE = {
    userData: undefined,
};


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        case USER_DATA:
            return {
                ...state,
                userData: action.payload,
            };
        default:
            return state;
    }
};
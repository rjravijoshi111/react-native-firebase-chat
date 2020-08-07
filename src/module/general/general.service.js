import * as GeneralAction from "./general.action";
import {loginUserReferance, getUser} from "@config/firebaseHelper";
export const TAG = "== general.service.js :";


/**
 * updateOnlineStatus API
 */
export const updateOnlineStatus = (isOnline) => async (dispatch, getStore) => {
    
    loginUserReferance()
        .update({
            isOnline : isOnline,
            lastSeenTimeStamp : new Date().toString()
        }).then(async () =>{

        });
}

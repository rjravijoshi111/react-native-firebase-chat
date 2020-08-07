export const USER_DATA = 'USER_DATA';
export const LOGOUT_USER = 'LOGOUT_USER';

// ************************************** Action Creator ************************************************/

export const setUserData = userData => {
    return {
        type: USER_DATA,
        payload: userData
    };
};

export const setLogoutUser = () => {
    return {
        type: LOGOUT_USER,
    };
};


export const USER_DATA = 'USER_DATA';

// ************************************** Action Creator ************************************************/

export const setUserData = userData => {
    return {
        type: USER_DATA,
        payload: userData
    };
};






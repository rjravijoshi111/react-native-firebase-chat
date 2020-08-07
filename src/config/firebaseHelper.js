import { connect } from 'react-redux';
import { store } from '../reducers';
import database from '@react-native-firebase/database';

export const loginUserReferance = () => {
    let uid = store.getState().auth.userData.uid;
    let loginUserReferance = database().ref('Users/'+uid);
    return loginUserReferance
}

export const getUser = (uid) => {
    return new Promise((resolve, reject) => {
        database().ref('Users/'+uid).once('value')
        .then((snap) =>{
            resolve(snap.val())
        })
        .catch(error =>{
            reject(error);
        })
    });
}

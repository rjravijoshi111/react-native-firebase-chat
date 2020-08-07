import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import { createBlacklistFilter } from 'redux-persist-transform-filter';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import AsyncStorage from '@react-native-community/async-storage';
import { CommonActions } from '@react-navigation/native';
import rootReducer from './rootReducer';

const generalBlacklistFilter = createBlacklistFilter(
    'general',
    ['isLoading']
);

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    transforms: [
        generalBlacklistFilter
    ],
    // blacklist: [],
    // whitelist : ['auth.savedUserData'],
    stateReconciler: autoMergeLevel2
}
export const persistedReducer = persistReducer(persistConfig, rootReducer)

// export const App = createReduxContainer(Navigator, "root")
// const rootStore = createStore(persistedReducer, applyMiddleware(thunk, logger,middleware));
const rootStore = createStore(persistedReducer, applyMiddleware(thunk));
export const persistor = persistStore(rootStore);
export const store = rootStore;





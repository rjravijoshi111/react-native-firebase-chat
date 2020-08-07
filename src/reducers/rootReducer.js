import { combineReducers } from 'redux';
import general from "@general/general.reducer";
import chat from "@chat/chat.reducer";
import auth from "@auth/auth.reducer";
import more from "@more/more.reducer";

// const navReducer = createNavigationReducer(Navigator);

const appReducer = combineReducers({
    general,
    auth,
    chat,
    more
});

const rootReducer = (state, action) => {
    if (action.type === 'LOGOUT_USER') {
        state.auth = undefined
        state.chat = undefined
        state.more = undefined
    }
    return appReducer(state, action)
}

export default rootReducer;
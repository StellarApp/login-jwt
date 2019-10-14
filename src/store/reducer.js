import {combineReducers} from 'redux';
import { SET_AUTH, SET_TOKEN, DELETE_AUTH } from './constants';

const authReducer = (state = {}, action) => {
    switch(action.type){
        case SET_AUTH : 
            return {...state, ... action.auth}
            break;
        case SET_TOKEN :
            return {...state, token: action.token}
            break;
        case DELETE_AUTH : 
            return {...state, ... action.auth}
            break;
    }
    return state
}

const reducer = combineReducers({
    auth: authReducer
})

export default reducer;
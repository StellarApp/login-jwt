import {combineReducers} from 'redux';
import { SET_AUTH, DELETE_AUTH } from './constants';

const authReducer = (state = {}, action) => {
    switch(action.type){
        case SET_AUTH : 
            return {...state, ... action.auth}
            break;
        case DELETE_AUTH : 
            return {... action.auth}
            break;
    }
    return state
}

const reducer = combineReducers({
    auth: authReducer
})

export default reducer;
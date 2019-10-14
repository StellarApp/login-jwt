import { SET_AUTH, SET_TOKEN, DELETE_AUTH } from './constants';
import axios from 'axios';

const setAuth = (auth) => {
    return { 
        type: SET_AUTH, 
        auth
      }
}

const setToken = (token) => {
    return {
        type: SET_TOKEN, 
        token
    }
}

const deleteAuth = () => {
    return { 
        type: DELETE_AUTH, 
        auth: {}
    }
}

const attemptLogin = (credentials, history)=> {
  return async(dispatch)=> {
    const {token} = (await axios.post('/api/sessions', credentials)).data;
    window.localStorage.setItem('token', token)
    dispatch(setToken(token));
    history.push('/');
  };
};

const attemptSessionLogin = ()=> {
  return async(dispatch)=> {
    const token = window.localStorage.getItem('token')
    // console.log(token)
    const auth = (await axios.get('/api/sessions', {headers: {'authorization': token}})).data;
    dispatch(setAuth(auth));
  };
};

const logout = ()=> {
  return async(dispatch)=> {
    await axios.delete('/api/sessions');
    dispatch(deleteAuth());
  };
};

export { attemptLogin, attemptSessionLogin, logout}
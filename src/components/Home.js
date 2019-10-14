import React from 'react';
import { connect } from 'react-redux';
import { actions } from '../store';

/* Home */
const _Home = ({ auth, logout })=> <div>
  Home - Welcome { auth.email }
  <button onClick={ logout }>Logout</button>
</div>;

const Home = connect(
    ({ auth })=> {
      return { auth }
    },
    (dispatch)=> {
      return {
        logout: ()=> dispatch(actions.logout()) 
      }
    }
)(_Home);

export default Home
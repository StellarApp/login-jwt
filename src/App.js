import React, { Component } from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import { actions } from './store';


/* App */
class _App extends Component{
    componentDidMount(){
      this.props.attemptSessionLogin()
        .catch(ex => console.log(ex));
    }
    render(){
      const { loggedIn } = this.props;
      return (
        <div>
          <h1>Acme Login</h1>
          <HashRouter>
            <Switch>
            {
              loggedIn && (<Route path='/' component= { Home } exact/>)
            }
            {
              !loggedIn && (<Route path='/login' component= { Login } exact/>)
            }
            {
              !loggedIn && <Redirect to='/login' />
            }
            {
              loggedIn && <Redirect to='/' />
            }
            </Switch>
          </HashRouter>
        </div>
      );
    }
  };
  
  const App = connect(
      ({ auth })=> {
        return {
          loggedIn: !!auth.id
        };
      },
      (dispatch)=> {
        return {
          attemptSessionLogin: ()=> dispatch(actions.attemptSessionLogin())
        };
      }
  )(_App);

  export default App
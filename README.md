Install
=======

```
$ npm install react-flux
```

Use it
======
```
var ReactFlux = require("react-flux");
```

Constants
=========
```
var userConstants = ReactFlux.createConstants([
  'LOGIN',
  'LOGOUT'
], 'USER');
```
this will result in the following:

```
{
   USER_LOGIN:           'USER_LOGIN',
   USER_LOGIN_SUCCESS:   'USER_LOGIN_SUCCESS',
   USER_LOGIN:           'USER_LOGIN_FAIL',
   USER_LOGOUT:          'USER_LOGOUT',
   USER_LOGOUT_SUCCESS:  'USER_LOGOUT_SUCCESS',
   USER_LOGOUT_FAIL:     'USER_LOGOUT_FAIL'
}
```
Actions
=======
```
var userActions = ReactFlux.createActions({
  
  login: [userConstants.USER_LOGIN, function(username, password){
    return {
      id: 1,
      username: 'Max Mustermann'
    }
  }],
  
  logout: [userConstant.USER_LOGOUT, function(){
    return ....; 
  }]
  
});
```
calling userActions.login("mustermann", "1234567") will dispatch USER_LOGIN message directly, before it executes the passed callback. Depending on the action callback result it will also either dispatch USER_LOGIN_SUCCESS or USER_LOGIN_FAIL. 

USER_LOGIN_SUCCESS gets dispatched in two cases:
1. The callback retuns a value, like in the example above
2. the callback retuns a promise which gets resolved


USER_LOGIN_FAIL gets dispatched in two cases:
1. The action callback throws an exception or returns an Error
2. It returns a promise whicht gets rejected


an action that returns a promise may look like this:
```
login: [userConstants.USER_LOGIN, function(username, password){
    var promise = new Promise(function(resolve, reject){
      setTimeout(function(){
        if( Math.random() > 0.7 ){
          reject(new Error("Login failed"));
          return;
        }
        resolve({
          id: 1,
          username: 'Max Mustermann'
        });
      }, 100);
    });
    return promise;
  }],
```


Stores
==== 
```
var userStore = ReactFlux.createStore({
  
  getInitialState: function(){
    return {
      isAuth: false,
      data: null,
      isLoggingIn: false,
      error: null
    };
  },
  
  storeDidMount: function(){
    //....
  },
  
  isAuth: function(){
    return this.getState().isAuth
  }
  
}, [
 
 /**
 * called directly before executing login action
 */
 [userConstants.USER_LOGIN, function onLogin(){
  this.setState({
    isLoggingIn: true,
    error: null
  });
 }],
 
 /**
 * called if login action was successful
 */
 [userConstants.USER_LOGIN_SUCCESS, function onLoginSuccess(payload){
  this.setState({
    isAuth: true,
    data: payload,
    isLoggingIn: false,
    error: null
  });
 }],
  /**
 * called if login action failed
 */
 [userConstants.USER_LOGIN_FAIL, function onloginFail(error){
  this.setState({
    isLoggingIn: false,
    error: error.message
  });
 }]

]);
```


createStore takes two parameters: 1. A mixin object for the store 2. an array of action listeners

all *_SUCCESS callbacks get payload as parameter, which is the value returned from an actioin, or the payload passed to it's promise resolve function

all *_FAIL callbacks get an Error object

to get the state of the store, use store.getState();

to listen to store changes use: store.onChange(onChangeCallback)

to stop listening to store changes use: store.offChange(onChangeCallback)


Example React component
=======================
```
var LoginComponent = React.createClass({
  
  getInitialState: function(){
    return userStore.getState()
  },
  
  componentWillMount: function(){
    userStore.onChange( this.onUserChange );
  },
  
  componentWillUnmount: function(){
    userStore.offChange( this.onUserChange );
  },
  
  onUserChange: function(){
    this.setState( userStore.getState() );
  },
  
  render: function(){
    if( this.state.isAuth ){
      return this.renderLogin();
    }
    return this.renderLogout();
  },
  
  renderLogin: function(){
    if( this.state.isLoggingIn ){
      return (<div>...</div>);
    }
    return(
      <div>
        Hello Stranger! 
        <a href="#" onClick={this.login}>login</a>
      </div>
    );
  },
  
  renderLogout: function(){
    return(
      <div>
      Hello {this.state.data.username}!
      <a href="#" onClick={this.logout}>Logout</a>
      </div>
    );
  },
  
  login: function(){
    userActions.login("mustermann", "1234567");
    return false;
  },
  
  logout: function(){
    userActions.logout();
    return false;
  }
  
});
```

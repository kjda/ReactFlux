Read about Flux-Data-Flow http://facebook.github.io/flux/docs/overview.html

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

ReactFlux
=========
ReactFlux expose the following methods:  
1. createConstants( Array constants, String prefix )  
2. createActions( Object actions )  
3. createStore( Object mixin, Array listeners )  
4. dispatch( String constant, Object payload )  
5. mixin( Store store, ..... )  

Constants
=========
```
var userConstants = ReactFlux.createConstants([
  'LOGIN',
  'LOGOUT'
], 'USER');
```
The second parameter which is a prefix to be added to all messages is optional


this will result in the following:

```
{
   LOGIN:           'USER_LOGIN',
   LOGIN_SUCCESS:   'USER_LOGIN_SUCCESS',
   LOGIN_FAIL:      'USER_LOGIN_FAIL',
   LOGOUT:          'USER_LOGOUT',
   LOGOUT_SUCCESS:  'USER_LOGOUT_SUCCESS',
   LOGOUT_FAIL:     'USER_LOGOUT_FAIL'
}
```

It is also possible to configure constant generation, one may configure separator, success- and fail suffixes
```
ReactFlux.configs.constants.setSeparator(':');
ReactFlux.configs.constants.setSuccessSuffix('OK');
ReactFlux.configs.constants.setFailSuffix('ERROR');
```

now the previous example will result in:
```
{
   LOGIN:            'USER:LOGIN',
   LOGIN_OK:         'USER:LOGIN:OK',
   LOGIN_ERROR:      'USER:LOGIN:ERROR',
   LOGOUT:           'USER:LOGOUT',
   LOGOUT_OK:        'USER:LOGOUT:OK',
   LOGOUT_ERROR:     'USER:LOGOUT:ERROR'
}
```
to go back to default configurations use:
```
ReactFlux.configs.constants.resetToDefaults();
```

Actions
=======
```
var userActions = ReactFlux.createActions({
  
  login: [userConstants.LOGIN, function(username, password){
    return {
      id: 1,
      username: 'Max Mustermann'
    }
  }],
  
  logout: [userConstant.LOGOUT, function(){
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
login: [userConstants.LOGIN, function(username, password){
    //API.post returns a promise
    return api.post('/user/login', {username: username, password: password});

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
    return this.state.get('isAuth')
  }
  
}, [
 
 /**
 * called directly before executing login action
 */
 [userConstants.LOGIN, function onLogin(){
  this.setState({
    isLoggingIn: true,
    error: null
  });
 }],
 
 /**
 * called if login action was successful
 */
 [userConstants.LOGIN_SUCCESS, function onLoginSuccess(payload){
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
 [userConstants.LOGIN_FAIL, function onloginFail(error){
  this.setState({
    isLoggingIn: false,
    error: error.message
  });
 }]

]);
```


createStore takes two parameters: 1. A mixin object for the store 2. an array of action listeners


The state of the store is an [Immutable][1] object
to get the state of the store, use store.state.
to set the state use store.setState
to get a specific property from a state, use: store.get('property')

To listen to store changes use: store.onChange(onChangeCallback)

To stop listening to store changes use: store.offChange(onChangeCallback)

Each store has a mixin method which returns a ReactMixin, so that you don't need to manually couple the component with the store. If you use this mixin you must implement a getStateFromStores method on the component which will be called in componentWillMount and whenever you set the state of the store 

all *_SUCCESS callbacks get payload as parameter, which is the value returned from an actioin, or the payload passed to it's promise resolve function

all *_FAIL callbacks get an Error object

Example React component
=======================
```
var LoginComponent = React.createClass({
  
  mixins: [ ReactFlux.mixin(userStore) ], //or mixins: [ userStore.mixin() ]
  
  getStateFromStores: function(){
    return {
      user: userStore.state
    };
  },
  
  render: function(){
    if( !this.state.user.get('isAuth') ){
      return this.renderLogin();
    }
    return this.renderLogout();
  },
  
  renderLogin: function(){
    if( this.state.user.get('isLoggingIn') ){
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
      Hello {this.state.user.get('data').username}!
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
[1]: https://github.com/facebook/immutable-js

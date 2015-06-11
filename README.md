[![Build Status](https://travis-ci.org/kjda/ReactFlux.svg?branch=master)](https://travis-ci.org/kjda/ReactFlux)
[![Coverage Status](https://coveralls.io/repos/kjda/ReactFlux/badge.svg?branch=master)](https://coveralls.io/r/kjda/ReactFlux?branch=master)

Read about [Flux-Data-Flow](http://facebook.github.io/flux/docs/overview.html)

Install
=======
Npm:
```
$ npm install react-flux
```
Bower:
```
$ bower install react-flux
```

Use it
======
```
var ReactFlux = require("react-flux");
```

Browser:  
```
<script src="/react-flux/dist/react-flux.js" type="text/javascript"></script>
```


ReactFlux
=========
ReactFlux expose the following methods:  
	1. createConstants( Array constants, String prefix )  
	2. createActions( Object actions )  
	3. createStore( Object mixin, Array listeners )  
	4. dispatch( String constant, Object payload )  
	5. mixinFor( Store store, ..... )  

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
	 LOGIN_AFTER:     'USER_LOGIN_AFTER',
	 LOGOUT:          'USER_LOGOUT',
	 ...
}
```

It is also possible to configure constant generation, one may configure separator, success- and fail suffixes
```
ReactFlux.configs.constants.setSeparator(':');
ReactFlux.configs.constants.setSuccessSuffix('OK');
ReactFlux.configs.constants.setFailSuffix('ERROR');
ReactFlux.configs.constants.setAfterSuffix('DONE');
```

now the previous example will result in:
```
{
	 LOGIN:            'USER:LOGIN',
	 LOGIN_OK:         'USER:LOGIN:OK',
	 LOGIN_ERROR:      'USER:LOGIN:ERROR',
	 LOGIN_DONE:       'USER:LOGIN:DONE',
	 LOGOUT:           'USER:LOGOUT',
	 ...
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
	
	login: [userConstants.LOGIN, function loginAction(username, password){
		return {
			id: 1,
			username: 'Max Mustermann'
		}
	}]
	
});
```
calling userActions.login("mustermann", "1234567") will do the following:  
	1. **USER_LOGIN** gets dispatched directly before the passed callback gets executed.   which means: any store handlers registered for USER_LOGIN will get invoked.
	2. the passed callback gets executed, in this case **loginAction**.  
	3. Depending on the result of the action callback, it will either dispatch **USER_LOGIN_SUCCESS** or **USER_LOGIN_FAIL**.  
	4. **USER_LOGIN_AFTER** get's dispatched after step 3 

**USER_LOGIN_SUCCESS** gets dispatched in two cases:  
	1. The callback returns a value, like in the example above  
	2. the callback returns a promise which gets resolved  

**USER_LOGIN_FAIL** gets dispatched in two cases:  
	1. The action callback throws an exception or returns an Error  
	2. It returns a promise which gets rejected  


Stores
==== 
```
var userStore = ReactFlux.createStore({
	
	mixins: [ SomeStoreMixin, AnotherStoreMixin ],

	getInitialState: function(){
		return {
			isAuth: false,
			data: null,
			isLoggingIn: false,
			error: null
		};
	},
	
	storeDidMount: function(){
		//Get called when store is ready
	},
	
	isAuth: function(){
		return this.get('isAuth')
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
		data: payload
	});
 }],

 /**
	* called if login action failed
	*/
 [userConstants.LOGIN_FAIL, function onloginFail(error){
	this.setState({
		error: error.message
	});
 }]
 
 /**
	* called after login action succeeds or fails
	*/
 [userConstants.LOGIN_AFTER, function onloginAfter(error){
	this.setState({
		isLoggingIn: false
	});
 }],

]);
```


ReactFlux.createStore takes two parameters: 


	1. A mixin object for the store:
		 

> Thanks to [Leland Richardson][1] store definition accepts mixins  which get mixed into the store.  A store mixin may be recursive and it may hook into store lifecycle events i.e getInitialState and storeDidMount. Please have a look at the tests for more insights. 

	2. an array of action listeners


###all *_SUCCESS callbacks get payload as parameter, which is the value returned from an actioin, or the payload passed to it's promise resolve function

###all *_FAIL callbacks get an Error object, or whatever you pass to a promise reject function

###Store API
#####store.setState(obj)  
	sets the state of the store
#####store.replaceState(obj) 
		replaces the state of the store
#####store.getState() 
		gets the store state. getState does not return a copy or a clone of state, rather it returns the object itself.
#####store.getStateClone() 
		gets a clone of the store state
#####store.get(key)
		gets the value corresponding to the key from store's state. *get* does not return a clone of the value if it's an object, rather it returns the object itself.
#####store.getClone(key)
		gets a clone of the value corresponding to the key from store's state
#####store.onChange(callback)
registers a callback which gets invoked whenever store's state changes
#####store.offChange(callback)
deregisters callback from store changes
#####store.mixinFor()
Each store exposes a "mixinFor" method which returns a ReactMixin, so that you don't need to manually couple your your components with different stores. If you use this mixin you must implement a getStateFromStores method on the component which gets called in componentWillMount and whenever the store's state gets updated    
```
	var fooComponent = React.createClass({
		mixins: [
			fooStore.mixinFor()
		],
		getStateFromStores: function(){
			return {
				fooState: fooStore.getState()
			};
		},
		
	});
```
#####store.addActionHandler(constant, actionHandlerMixin)
register an action handler for the given constant.. please refer to ActionHandlers sections for more details.

#####store.getActionState(constant)
returns a copy of the state of the action handler related to the given constant
#####store.setActionState(const, newState)
sets the state of the action handler related to the given constant


### Store Action Handlers
stores also provide a different way for setting handlers, namely through StoreActionHandler.
StoreActionHandler is an object defining handlers for all action possible constants. It provides a **seperate sub-state** specific to every single action handler. This could be useful when maintaining different UI states in a store that is used by different UI views. This way we don't need to pollute a Store's state with many variables correlating to the state of UI Views, we can just dump those variables into sub-states, while keeping store's state dedicated to real data. 

```
UserStore.addActionHandler(constants.SAVE_NEW_USERNAME, {

	//returns initial state specific only to this handler
	getInitialState: function(){
		 isSaving: false,
		 error: null,
		 success: false
	},
		
	//this gets called before the action associated with SAVE_NEW_USERNAME is executed
	before: function(){
		//this inside handler callbacks refers to the action handler itself and not to the store
		this.setState({
		 isSaving: true,
		 error: null
		});
	},
	
	//this gets called after the action associated with SAVE_NEW_USERNAME succeeds or fails
	after: function(){
		this.setState({
			isSaving: false
		});
	},
	
	//this gets called if the action associated with SAVE_NEW_USERNAME succeeds
	success: function(payload){
		this.setState({
			success: true
		});
		
		//here we set the state of parent store(UserStore) using this.parent.setState
		this.parent.setState({
			username: payload.username
		});
	},
	
	//this gets called if the action associated with SAVE_NEW_USERNAME fails
	fail: function(error){
		this.setState({
			error: error
		});
	}
	
});
```

**getInitialState**, **before**, **after**, **success** and fail are optional.


We can access handler specific state using:
```
UserStore.getActionState(constants.SAVE_NEW_USERNAME); // returns the state object
```
or we can get a specific property from handler state
```
UserStore.getActionState(constants.SAVE_NEW_USERNAME, 'isSaving');
```
to reset a handler state use:
```
UserStore.resetActionState(constants.SAVE_NEW_USERNAME);
```
to set a handler state use:
```
UserStore.setActionState(constants.SAVE_NEW_USERNAME, {
 //.....
});
```

setting handler state will cause the store to emit a change event

Inside an ActionHandler the parent store is accessible through this.parent.  So, to update the state of the parent store from within the actionHandler, use **this.parent.setState**

Code Generation
===============
ReactFlux ships with a code generation utility which can make life a lot easier.  
To use this functionality create a special js file in your working directory:

flux.js  
```
#!/usr/bin/env node
require('react-flux/codegen');
```

make it executable  
```
chmod +x flux.js
```

then look at the help  
```
./flux --help
```

code generator will put your files into "flux" directory by default. if you want to change it, create another file "reactflux.json" in the same directory as "flux.js" and specify where you want to have your flux folder  
```
{
	"directory": "my-special-flux-directory"
}
```



Example React component
=======================
```
var LoginComponent = React.createClass({
	
	mixins: [ 
		ReactFlux.mixinFor(userStore) //or  userStore.mixin() 
	], 
	
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
[1]: https://github.com/lelandrichardson

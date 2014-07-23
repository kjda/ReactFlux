var ReactFlux = require('../../../../index');
var userConstants = require('../constants/user');

var MotherStore = require('./mother');
var FatherStore = require('./father');

module.exports = ReactFlux.createStore({

	getInitialState: function(){
		console.log("UserStore.getInitialState");
		return {
			data: null,
			isAuth: false,
			error: null
		}
	},

	storeDidMount: function(){
		console.log("UserStore.storeDidMount");
	},

	getUsername: function(){
		return this.state.isAuth ? this.state.data.username : null;
	},
	getName: function(){
		return 'User';
	}

}, [

	/**
	* Dispatcher calls this directly when it receives a USER_LOGIN message,
	* just before it tries to execute the corresponding action
	*/
	[userConstants.USER_LOGIN, function onLogin(payload){
		console.log("UserStore.onLogin", payload);
		this.setState({
			isLoggingIn: true
		});
	}],

	/**
	* This gets called if USER_LOGIN action was successfull
	* This store waits for MasterStore to process this message
	*/
	[userConstants.USER_LOGIN_SUCCESS, [MotherStore, FatherStore], function handleLoginSuccess(payload){
		console.log("UserStore.handleLogin", payload);
		this.setState({
			isLoggingIn: false,
			error: null,
			data: payload,
			isAuth: (!!payload && !!payload.id) 
		});
	}],

	/**
	* This gets called if USER_LOGIN action was unsuccessful
	*/
	[userConstants.USER_LOGIN_FAIL, function handleLoginFailure(error){
		console.log("UserStore.handleLoginFailure", error);
		this.setState({
			isLoggingIn: false,
			error: error.message
		});
	}],

	/**
	*
	*/
	[userConstants.USER_LOGOUT_SUCCESS, function handleLogout(){
		console.log("UserStore.handleLogout");
		this.setState({
			isAuth: false,
			data: null
		});
	}]
	
]);
var ReactFlux = require('../../../../index');
var userConstants = require('../constants/user');

var MotherStore = require('./mother');
var FatherStore = require('./father');

var Store = ReactFlux.createStore({

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
		return this.get('isAuth') ? this.get('data').username : null;
	}

}, [

	/**
	* Dispatcher calls this directly when it receives a USER_LOGIN message,
	* just before it tries to execute the corresponding action
	*/
	[userConstants.LOGIN, function onLogin(payload){
		console.log("UserStore.onLogin", JSON.stringify(payload));
		this.setState({
			isLoggingIn: true
		});
	}],

	/**
	* This gets called if USER_LOGIN action was successfull
	* This store waits for MotherStore and FatherStore to process this message
	*/
	[userConstants.LOGIN_SUCCESS, [MotherStore, FatherStore], function handleLoginSuccess(payload){
		console.log("UserStore.handleLogin", JSON.stringify(payload));
		this.setState({
			isLoggingIn: false,
			error: null,
			data: payload,
			isAuth: true
		});
	}],

	/**
	* This gets called if USER_LOGIN action was unsuccessful
	*/
	[userConstants.LOGIN_FAIL, function handleLoginFailure(error){
		console.log("UserStore.handleLoginFailure", error.message);
		this.setState({
			isLoggingIn: false,
			error: error.message
		});
	}]

]);

Store.addActionHandler(userConstants.LOGOUT, {
	success: function(){
		console.log("UserStore.handleLogout");
		this.parent.setState({
			isAuth: false,
			data: null
		});
	}
});

module.exports = Store;

var ReactFlux = require('../../../../index');
var userConstants = require('../constants/user');

module.exports = ReactFlux.createActions({

	/**
	* Action may return a value(SUCCESS PAYLOAD), an error, or a promise
	*/
	login: [userConstants.LOGIN, function(username, password){
		console.log("UserActions.login", username, password);
		var promise = new Promise(function(resolve, reject){
			setTimeout(function(){
				if( username.length ){
					resolve({
						id: 1,
						username: username
					});
				}
				else{
					reject(new Error('Invalid login'));
				}
			}, 500);
		});
		return promise;
	}],


	/**
	* An actoin without a callback will always be successful
	*/
	logout: [userConstants.LOGOUT]


});

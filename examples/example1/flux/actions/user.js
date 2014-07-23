var ReactFlux = require('../../../../index');
var userConstants = require('../constants/user');

module.exports = ReactFlux.createActions({

	login: [userConstants.USER_LOGIN, function(username, password){
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
			}, 250);
		});
		return promise; 
	}],


	logout: [userConstants.USER_LOGOUT, function(){

	}]

	
});


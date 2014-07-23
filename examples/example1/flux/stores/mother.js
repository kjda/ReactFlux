var ReactFlux = require('../../../../index');
var userConstants = require('../constants/user');


module.exports = ReactFlux.createStore({
	getName: function(){
		return 'SPY';
	}
}, [
	
	[userConstants.USER_LOGIN_SUCCESS,  function NotifyMotherOfLogin(payload){

		console.log("I'm Mother, I need 0.5 sec to answer!");
		
		var promise = new Promise(function(resolve, reject){
			setTimeout(function(){
				console.log("I'm Mother, I have been notified of login!", payload.username);
				resolve();
			}, 500);
		});
		
		return promise;
	
	}]

]);
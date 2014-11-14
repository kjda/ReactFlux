var ReactFlux = require('../../../../index');
var userConstants = require('../constants/user');

var MotherStore = require('./mother');

var Store = ReactFlux.createStore(null, [
	
	[userConstants.LOGIN_SUCCESS, [MotherStore],  function notifyFatherOfLogin(payload){

		console.log("I'm Father,  I need 1 sec to answer!");
		
		var promise = new Promise(function(resolve, reject){
			setTimeout(function(){
				console.log("I am Father, I have been notifed of login! Username: ", payload.username);
				resolve();
			}, 1000);
		});
		
		return promise;
	
	}]

]);


module.exports = Store;
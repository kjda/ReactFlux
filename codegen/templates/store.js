var ReactFlux = require('react-flux');
var constants = require('../constants/<%= name %>');

var Store = ReactFlux.createStore({
	
	displayName: '<%= name %>Store',

	getInitialState: function(){
		return {
		};
	}

});


module.exports = Store;
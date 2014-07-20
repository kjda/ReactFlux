var Constants = require('./constants');
var Actions = require('./actions');
var Store = require('./store');
var Dispatcher = require('./dispatcher');

var  dispatcher = new Dispatcher();

module.exports = {
	
	createActions: function(actions){
		return new Actions(dispatcher, actions);
	},
	
	createStore: function(storeProto, handlers){
		return new Store(dispatcher, storeProto, handlers);
	},

	createConstants: function(constants){
		return new Constants(constants);
	}
	
};

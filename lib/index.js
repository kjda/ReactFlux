var Constants = require('./constants');
var Actions = require('./actions');
var Store = require('./store');
var Dispatcher = require('./dispatcher');

var  dispatcher = new Dispatcher();

module.exports = {
	
	/**
	* createActions
	* @param {object} actions
	*/
	createActions: function(actions){
		return new Actions(dispatcher, actions);
	},
	
	/**
	* createStore
	* @param {object} storeMixin
	* @param {array} handlers
	*/
	createStore: function(storeMixin, handlers){
		return new Store(dispatcher, storeMixin, handlers);
	},

	/**
	* createConstants
	* @param {array} constants
	*
	*/
	createConstants: function(constants, prefix){
		return new Constants(constants, prefix);
	}
	
};

var _isString = require('lodash-node/modern/objects/isString');
var _isFunction = require('lodash-node/modern/objects/isFunction');

var constantsConfigs = require('./configs').constants.get();

var HANDLER_NAMES = ['before', 'after', 'success', 'fail'];

function StoreActionHandler(store, constant, configs){
	if( !store.isStore() ){
		throw new Error('StoreActionHandler expects first parameter to be a store');
	}
	if( !_isString(constant) ){
		throw new Error('StoreActionHandler expects second parameter to be a constant(string)');
	}
	if( typeof configs.getInitialState == 'undefined' ){
		configs.getInitialState = function(){
			return {};
		};
	}
	if( !_isFunction(configs.getInitialState) ){
		throw new Error('StoreActionHandler expects getInitialState to be a function');
	}

	configs = configs || {};
	this.parent = store;
	this.constant = constant;
	this.getInitialState = configs.getInitialState;
	this.before =  configs.before || null;
	this.after = configs.after || null;
	this.success = configs.success || null;
	this.fail = configs.fail || null;
	
	this.parent.setActionState(this.constant, this.getInitialState());

	//register handlers for this constant
	var handlers = [];
	var len = HANDLER_NAMES.length;
	for(var i = 0; i < len; i++){
		var handlerName = HANDLER_NAMES[i];
		if( this[handlerName] == null ){
			continue;
		}
		if( !_isFunction(this[handlerName]) ){
			throw new Error('StoreActionHandler expects "' + handlerName + '" to be a function');
		}
		var constant = this.constant;
		if( handlerName != 'before' ){
			constant += constantsConfigs.separator + constantsConfigs[handlerName + 'Suffix'];
		} 
		handlers.push( [constant, this[handlerName].bind(this) ] );
	}
	store.setHandlers(handlers);
}

StoreActionHandler.prototype = {
	/**
	* @param {object} newState
	*/
	setState: function(newState){
		this.parent.setActionState(this.constant, newState);
	},
	/**
	* @return {object} state
	*/
	getState: function(){
		return this.parent.getActionState(this.constant);
	}
};


module.exports = StoreActionHandler;
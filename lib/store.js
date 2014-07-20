var _assign = require('lodash-node/modern/objects/assign');
var _merge = require('lodash-node/modern/objects/merge');
var _forEach = require('lodash-node/modern/collections/forEach');
var _isArray = require('lodash-node/modern/objects/isArray');
var _isFunction = require('lodash-node/modern/objects/isFunction');

var Promise = require('es6-promise').Promise;
var CHANGE_EVENT = 'change';
var EventEmitter = require('events').EventEmitter;

var uuid = 0;

var Store = function(dispatcher, storeProps, handlers){
	this._id = uuid++;
	this._dispatcher = dispatcher;
	this._setProperties(storeProps);
	this._setHandlers(handlers);
	this._setInitialState();
}


Store.prototype = _assign(EventEmitter.prototype, {
	
	state: {},
	_handlers: {},

	setState: function(newState){
		this.state = _merge(this.state, newState);
		this.emit(CHANGE_EVENT);
	},
	
	getState: function(){
		return this.state;
	},
	
	addChangeListener: function(callback){
		this.on(CHANGE_EVENT, callback);
	},
	
	removeChangeListener: function(callback){
		this.remove(CHANGE_EVENT, callback);
	},

	getHandler: function(constant){
		return this._handlers[constant];
	},

	_setProperties: function(storeProps){
		_forEach(storeProps, function(prop, propName){
			if( _isFunction(prop) ){
				prop = prop.bind(this);
			} 
			this[propName] = prop;
		}.bind(this));
	},

	_setHandlers: function(handlers){
		_forEach(handlers, function(options){
			var constant, handler, waitFor;
			constant = options[0];
			if( options.length == 2 ){
				waitFor = null;
				handler = options[1];
			}else{
				waitFor = options[1];
				handler = options[2];
			}
			var waitForHandlers = null;
			if( waitFor ){
				var waitForHandlers = waitFor.map(function(store){
					return store.getHandler(constant);
				});
			}
			
			this._handlers[constant] = handler.bind(this);
			this._dispatcher.register(constant, this._handlers[constant], waitForHandlers);
		}.bind(this));
	},

	_setInitialState: function(){
		if( !!this.getInitialState ){
			this.setState( this.getInitialState() );
		}
	}

});

module.exports = Store;
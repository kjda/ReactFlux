var Immutable = require('immutable');
var _assign = require('lodash-node/modern/objects/assign');
var _forEach = require('lodash-node/modern/collections/forEach');
var _isFunction = require('lodash-node/modern/objects/isFunction');

var EventEmitter = require('events').EventEmitter;

var Mixin = require('./mixin');

var CHANGE_EVENT = 'change';

/**
* Flux Store 
* @param {object} dispatcher
* @param {object} storeMixin
* @param {array} handlers
*/
var Store = function(dispatcher, storeMixin, handlers){
	this.state = Immutable.Map({});
	this._handlers = {};
	this._dispatcherIndexes = {};
	this._dispatcher = dispatcher;
	
	this._mixin(storeMixin);
	this._setInitialState();
	this._setHandlers(handlers);
	!!this.storeDidMount && this.storeDidMount();
}


Store.prototype = _assign(EventEmitter.prototype, {

	/**
	* @param {object} newState
	*/
	setState: function(newState){
		this.state = this.state.merge(newState);
		this.emit(CHANGE_EVENT);
	},

	/**
	* @param {object} newState
	*/
	replaceState: function(newState){
		this.state = Immutable.Map(newState)
	},
	
	/**
	* @return {object} Store's state
	*/
	toJS: function(){
		return this.state.toJS();
	},

	/**
	* @return {object} Store's state
	*/
	toObject: function(){
		return this.state.toObject();
	},

	/**
	* 
	*/
	toJSON: function(){
		return this.state.toJSON();
	},

	/**
	*
	*/
	isStore: function(){
		return true;
	},

	/**
	* @param {function} callback
	*/
	onChange: function(callback){
		this.on(CHANGE_EVENT, callback);
	},
		
	/**
	* @param {function} callback
	*/
	offChange: function(callback){
		this.removeListener(CHANGE_EVENT, callback);
	},


	/**
	* set extra properties & methods for this Store
	* @param {object} storeMixin
	*/
	_mixin: function(storeMixin){
		_forEach(storeMixin, function(prop, propName){
			if( _isFunction(prop) ){
				prop = prop.bind(this);
			} 
			this[propName] = prop;
		}.bind(this));
	},

	/**
	* Set handlers for this Store
	* @param {array} handlers
	*/
	_setHandlers: function(handlers){
		this._dispatcherIndexes = {};
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

			var waitForIndexes = null;
			if( waitFor ){
				waitForIndexes = waitFor.map(function(store){
					return store.getHandlerIndex(constant);
				});
			}
			
			this._handlers[constant] = handler.bind(this);
			var dispatcherIndex = this._dispatcher.register(constant, this._handlers[constant], waitForIndexes);
			this._dispatcherIndexes[constant] = dispatcherIndex;
		}.bind(this));
	},
	
	/**
	* Get dispatcher idx of this constant callback for this store
	* @param {string} constant
	* @return {number} Index of constant callback
	*/
	getHandlerIndex: function(constant){
		if( typeof this._dispatcherIndexes[constant] == "undefined" ){
			throw new Error('Can not get store handler for constant: ' + constant);
		}
		return this._dispatcherIndexes[constant];
	},

	/**
	* Sets intial state of the Store
	*/
	_setInitialState: function(){
		!!this.getInitialState && this.setState( this.getInitialState() );
	},

	mixin: function(){
		return Mixin(this);
	}

});

module.exports = Store;

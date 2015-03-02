var Immutable = require('immutable');
var _merge = require('lodash-node/modern/objects/merge');
var _forEach = require('lodash-node/modern/collections/forEach');
var _isArray = require('lodash-node/modern/objects/isArray');

var Mixin = require('./mixin');

var CHANGE_EVENT = 'change';

var StoreActionHandler = require('./storeActionHandler');

/**
* Flux Store
* @param {object} dispatcher
* @param {object} storeMixin
* @param {array} handlers
*/
var Store = function(dispatcher, storeMixin, handlers){
	this.state = Immutable.fromJS({
		_action_states: {}
	});
	this._events = {};//used by store event emitter
	this._actionHandlers = {};
	this._constantHandlers = {};
	this._dispatcherIndexes = {};
	this._dispatcher = dispatcher;
	this._getInitialStateCalls = [];
	this._storeDidMountCalls = [];

	this._mixin(storeMixin);
	this._setInitialState();
	if( !!handlers ){
		this.setConstantHandlers(handlers);
	}
	_forEach(this._storeDidMountCalls, function (fn){
		fn();
	});
};


Store.prototype =  {

	/**
	* @param {object} newState
	*/
	setState: function(newState){
		this.state = this.state.merge(newState);
		this.emit(CHANGE_EVENT);
	},

	/**
	* @param {string} constant
	* @param {object} newState
	*/
	setActionState: function(constant, newState){
		var actionStates = this.state.get('_action_states');
		actionStates[constant] = _merge(actionStates[constant] || {}, newState);
		this.setState({
			'_action_states': actionStates
		});
	},

	/**
	* @param {string} constant
	*/
	resetActionState: function(constant){
		if( typeof this._actionHandlers[constant] === 'undefined' ){
			throw new Error('Store.resetActionState constant handler for [' + constant + '] is not defined');
		}
		var actionStates = this.state.get('_action_states');
		actionStates[constant] = this._actionHandlers[constant].getInitialState();
		this.setState({
			'_action_states': actionStates
		});
	},

	/**
	* @param {string} constant - constant to get handler state for
	* @param {string} [key] - a specfic key to get
	*/
	getActionState: function(constant, key){
		if( typeof this._actionHandlers[constant] === 'undefined' ){
			throw new Error('Store.getActionState constant handler for [' + constant + '] is not defined');
		}
		var actionState = this.state.get('_action_states');
		if( typeof key === "undefined" ){
			return actionState[constant];
		}
		return actionState[constant][key] || undefined;
	},

	/**
	* @param {string} propertyName
	* @return {mixed}
	*/
	get: function(propertyName){
		return this.state.get(propertyName);
	},

	/**
	* @param {object} newState
	*/
	replaceState: function(newState){
		this.state = Immutable.Map(newState);
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
		this.off(CHANGE_EVENT, callback);
	},


	/**
	* set extra properties & methods for this Store
	* @param {object} storeMixin
	*/
	_mixin: function(storeMixin){
		if (storeMixin && storeMixin.mixins && _isArray(storeMixin.mixins) ){
			_forEach(storeMixin.mixins, this._mixin.bind(this));
		}
		_forEach(storeMixin, function(prop, propName){
			if( propName === 'mixins' ) {
				return;
			}

			if( typeof prop === 'function' ){
				prop = prop.bind(this);
			}

			if ( propName === 'getInitialState' ) {
				this._getInitialStateCalls.push(prop);
			} else if ( propName === 'storeDidMount' ) {
				this._storeDidMountCalls.push(prop);
			} else {
				this[propName] = prop;
			}
		}.bind(this));
	},

	/**
	* @param {string} constant
	* @param {object} configs
	* @return {FluxStore} self
	*/
	addActionHandler: function(constant, configs){
		this._actionHandlers[constant] = new StoreActionHandler(this, constant, configs);
		return this;
	},

	/**
	* Set constant handlers for this Store
	* @param {array} handlers
	*/
	setConstantHandlers: function(handlers){
		if( !_isArray(handlers) ){
			throw new Error('store expects handler definitions to be an array');
		}
		_forEach(handlers, function(options){
			if( !_isArray(options) ){
				throw new Error('store expects handler definition to be an array');
			}
			var constant, handler, waitFor;

			constant = options[0];
			if( options.length === 2 ){
				waitFor = null;
				handler = options[1];
			}
			else{
				waitFor = options[1];
				handler = options[2];
			}
			if( typeof constant !== 'string' ){
				throw new Error('store expects all handler definitions to contain a constant as the first parameter');
			}
			if( typeof handler !== 'function' ){
				throw new Error('store expects all handler definitions to contain a callback');
			}
			if( !!waitFor && !_isArray(waitFor) ){
				throw new Error('store expects waitFor to be an array of stores');
			}
			var waitForIndexes = null;
			if( waitFor ){
				waitForIndexes = waitFor.map(function(store){
					if( !(store instanceof Store) ){
						throw new Error('store expects waitFor to be an array of stores');
					}
					return store.getHandlerIndex(constant);
				});
			}

			this._constantHandlers[constant] = handler.bind(this);
			var dispatcherIndex = this._dispatcher.register(constant, this._constantHandlers[constant], waitForIndexes);
			this._dispatcherIndexes[constant] = dispatcherIndex;
		}.bind(this));
	},

	/**
	* Get dispatcher idx of this constant callback for this store
	* @param {string} constant
	* @return {number} Index of constant callback
	*/
	getHandlerIndex: function(constant){
		if( typeof this._dispatcherIndexes[constant] === "undefined" ){
			throw new Error('Can not get store handler for constant: ' + constant);
		}
		return this._dispatcherIndexes[constant];
	},

	/**
	* Sets intial state of the Store
	*/
	_setInitialState: function(){
		this.setState( this.getInitialState() );
	},

	/**
	* Gets initial state of the store
	* 
	* @return {mixed} Store initial state
	*/
	getInitialState: function(){
		var state = {};

		_forEach(this._getInitialStateCalls, function(fn){
			_merge(state, fn());
		});

		return state;
	},

	/**
  * @return {Object} A mixin for React Components
  */
	mixin: function(){
		return Mixin(this);
	},

	/**
	*
	* @param {String} evt
	* @param {Function} handler
	* @return  {Function} handler
	*/
	on: function(evt, handler){
		if( typeof this._events[evt] === 'undefined' ) {
			this._events[evt] = [];
		}
		this._events[evt].push(handler);
		return handler;
	},

	/**
	*
	* @param {String} evt
	* @param {Function} handler
	*/
	off: function(evt, handler){
		if( typeof this._events[evt] !== 'undefined' ){
			for(var i=0, len = this._events[evt].length; i < len; i++){
				if( this._events[evt][i] === handler ){
					this._events[evt].splice(i, 1);
					break;
				}
			}
		}
	},

	/**
	*
	* @param {String} evt
	*/
	emit: function(evt){
		if( typeof this._events[evt] === 'undefined' ){
			return;
		}
		var args = Array.prototype.slice.call(arguments, 1);
		_forEach(this._events[evt], function(listner){
			listner.apply(null, args);
		});
	},

};

module.exports = Store;

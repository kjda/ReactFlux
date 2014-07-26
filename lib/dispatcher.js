var Promise = require('es6-promise').Promise;
var _merge = require('lodash-node/modern/objects/merge');
var _isFunction = require('lodash-node/modern/objects/isFunction');
var _isArray = require('lodash-node/modern/objects/isArray');
var _map   = require('lodash-node/modern/collections/map');
var _forEach  = require('lodash-node/modern/collections/forEach');

/**
* Dispatcher
*/
function Dispatcher(){
	/**
	* Registry of callbacks, waitFor, promises, etc
	* each constant has it's own array of callbacks, waitFor, promises, etc
	*/
	this._registry = {};
}

Dispatcher.prototype = _merge(Dispatcher.prototype, {
	
	/**
	* Registers a callback
	* @param {string} constant
	* @param {function} callback
	* @param {array|null} waitFor Array indexes to callbacks 
	*/
	register: function(constant, callback, waitForIndexes){
		waitForIndexes = waitForIndexes || null;
		
		if( !_isFunction(callback) ){
			throw new Error('Dispatcher.register expects second parameter to be a callback');
		}
		
		if( waitForIndexes !== null && !_isArray(waitForIndexes) ){
			throw new Error('Dispatcher.register expects third parameter to be null or an array');
		}

		var registry = this._getRegistry(constant);
		registry.callbacks.push(callback);
		registry.waitFor.push(waitForIndexes);
		return registry.callbacks.length - 1;
	},


	/**
	* Dispatch
	* @param {string} constant
	* @param {object} payload
	*/
	dispatch: function(constant, payload){
		var registry = this._getRegistry(constant);
		registry.dispatchQueue.push({
			constant: constant,
			payload: payload
		});
		this._dispatch(registry);
	},

	_dispatch: function(registry){

		if( registry.isDispatching || registry.dispatchQueue.length == 0 ) {
			return;
		}

		registry.isDispatching = true;
		var job = registry.dispatchQueue.shift();

		this._createDispatchPromises(registry);

		_forEach(registry.callbacks, function(callback, idx){

			var resolver = (function(registry, idx, payload){
				return function(){
					Promise.resolve( registry.callbacks[idx](payload) ).then(function(){
						registry.resolves[idx](payload)
					}, function(){
						registry.rejects[idx](new Error('Dispatch callback error'))
					});
				};
			})(registry, idx, job.payload);

			var waitFor = registry.waitFor[idx];
			if( !waitFor ){
				resolver();
			}
			else{
				var promisesToWaitFor = this._getPromisesByIndexes(registry, waitFor);
				Promise.all(promisesToWaitFor).then(
					resolver, 
					resolver  //Should we really resolve the callback here?
						// Some of the WaitForStores callbacks rejected the request
				);
			}
		}.bind(this));//_forEach(registry.callbacks,

		Promise.all(registry.promises).then(function(){
			this._onDispatchEnd(registry);
		}.bind(this), function(){
			this._onDispatchEnd(registry);
		});

	},//dispatch


	/**
	* Gets a registry for a constant
	* @param {string} constant
	*/
	_getRegistry: function(constant){
		if( typeof this._registry[constant] == "undefined" ){
			this._registry[constant] = {
				callbacks: [],
				waitFor: [],
				promises: [],
				resolves: [],
				rejects: [],
				dispatchQueue: [],
				isDispatching: false
			};
		}
		return this._registry[constant];
	},

	/**
	* @param {object} registry
	* @param {array} callbacks 
	*/
	_getPromisesByIndexes: function(registry, indexes){
		return indexes.map(function(idx){
			return registry.promises[idx];
		});
	},

	/**
	* Create promises for all callbacks in this registry
	* @param {object} registry
	*/
	_createDispatchPromises: function(registry){
		registry.promises = [];
		registry.resolves = [];
		registry.rejects = [];
		_forEach(registry.callbacks, function(callback, i){
			registry.promises[i] = new Promise(function(resolve, reject){
				registry.resolves[i] = resolve;
				registry.rejects[i] = reject;
			});
		});
	},


	/**
	* Clean registry
	* @param {object} registry
	*/
	_onDispatchEnd: function(registry){
		registry.promises = [];
		registry.resolves = [];
		registry.rejects = [];
		registry.isDispatching = false;
		this._dispatch(registry);
	}

});

module.exports = Dispatcher;

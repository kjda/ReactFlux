var Promise = require('es6-promise').Promise;
var _merge = require('lodash-node/modern/objects/merge');
var _isFunction = require('lodash-node/modern/objects/isFunction');
var _isArray = require('lodash-node/modern/objects/isArray');
var _map   = require('lodash-node/modern/collections/map');
var _forEach  = require('lodash-node/modern/collections/forEach');

var Dispatcher = function(){
	this._registry = {};
}

Dispatcher.prototype = _merge(Dispatcher.prototype, {
	
	_registry: {},

	register: function(constant, callback, waitFor){
		waitFor = waitFor || null;
		if( !_isFunction(callback) ){
			throw new Error('Dispatcher.register expects second parameter to be a callback');
		}
		if( waitFor !== null && !_isArray(waitFor) ){
			throw new Error('Dispatcher.register expects third parameter to be null or an array');
		}
		var registry = this._getRegistry(constant);
		registry.callbacks.push(callback);
		registry.waitFor.push(waitFor);
		return registry.callbacks.length - 1;
	},


	dispatch: function(constant, payload){

		var registry = this._getRegistry(constant);
		this._createDispatchPromises(registry);

		_forEach(registry.callbacks, function(callback, i){
			var waitFor = registry.waitFor[i];
			if( !waitFor ){
				this._resolveCallback(registry, i, payload);
			}
			else{
				var promisesToWaitFor = this._getCorrespondingPromises(registry, waitFor);
				Promise.all(promisesToWaitFor).then(function(){
					this._resolveCallback(registry, i, payload);
				}.bind(this));
			}
		}.bind(this));//_forEach(registry.callbacks,

		Promise.all(registry.promises).then(function(){
			this._onDispatchEnd(registry);
		}.bind(this));

	},


	_getRegistry: function(constant){
		if( !!!this._registry[constant] ){
			this._registry[constant] = {
				callbacks: [],
				waitFor: [],
				promises: [],
				resolves: [],
				rejects: []
			};
		}
		return this._registry[constant];
	},

	_getCorrespondingPromises: function(registry, callbacks){
		return callbacks.map(function(callback){
			var idx = registry.callbacks.indexOf(callback);
			return registry.promises[idx];
		});
		return res;
	},

	_resolveCallback: function(registry, idx, payload){
		Promise.resolve(registry.callbacks[idx](payload)).then(function(){
			registry.resolves[idx](payload)
		}, function(){
			registry.rejects[idx](new Error('Dispatch callback error'))
		});
	},

	_createDispatchPromises: function(registry){
		_forEach(registry.callbacks, function(callback, i){
			registry.promises[i] = new Promise(function(resolve, reject){
				registry.resolves[i] = resolve;
				registry.rejects[i] = reject;
			});
		});
	},

	_onDispatchEnd: function(registry){
		registry.promises = [];
		registry.resolves = [];
		registry.rejects = [];
	}

});

module.exports = Dispatcher;
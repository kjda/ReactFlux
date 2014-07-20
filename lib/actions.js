var _merge = require('lodash-node/modern/objects/merge');
var _forEach = require('lodash-node/modern/collections/forEach');
var _isArray = require('lodash-node/modern/objects/isArray');
var _isFunction = require('lodash-node/modern/objects/isFunction');
var Promise = require('es6-promise').Promise;

var Actions = function(dispather, actions){
	this._dispatcher = dispather;
	_forEach(actions, function(item, actionName){
		if( !_isArray(item) ){
			throw new Error('ReactFlux.Actions: Action must be an array {login: [CONTANT, callback]}')
		}
		var constant = item[0];
		var callback = item[1];
		if( !_isFunction(callback) ){
			throw new Error('ReactFlux.Actions: you did not provide a valid callback')
		}
		this[actionName] = this._creareAction(actionName, constant, callback);
	}.bind(this));
}

Actions.prototype = _merge(Actions.prototype, {
	_creareAction: function(name, constant, callback){
		return function(){
			var resp = callback.apply(this, arguments);
			Promise.resolve(resp).then(function(payload){
				this._dispatcher.dispatch(constant, payload)
			}.bind(this), function(){
				throw new Error('CALLBAXK')
			}.bind(this))
			
		}.bind(this);
	},
	iam: function(){
		console.log("iam ACTIONS");
	}
});

module.exports = Actions;
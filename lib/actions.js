var _merge = require('lodash-node/modern/objects/merge');
var _forEach = require('lodash-node/modern/collections/forEach');
var _isArray = require('lodash-node/modern/objects/isArray');
var _isFunction = require('lodash-node/modern/objects/isFunction');
var Promise = require('es6-promise').Promise;

var Actions = function(dispather, actions){

	this._dispatcher = dispather;
	this._registerActions(actions);

}

Actions.prototype = _merge(Actions.prototype, {
	
	/**
	*@param {object} actions
	*/
	_registerActions: function(actions){
		_forEach(actions, function(options, actionName){
			if( !_isArray(options) ){
				throw new Error('ReactFlux.Actions: Action must be an array {login: [CONTANT, callback]}')
			}
			var constant = options[0];
			var callback = options[1];
			if( !_isFunction(callback) ){
				throw new Error('ReactFlux.Actions: you did not provide a valid callback')
			}
			this[actionName] = this._creareAction(actionName, constant, callback);
		}.bind(this));
	},

	/**
	*@param {string} name
	*@param {string} constant
	*@param {string} callback
	*/
	_creareAction: function(name, constant, callback){
		return function(){
			this._dispatcher.dispatch(constant, arguments);
			try{
				var resp = callback.apply(this, arguments);
				if( !!resp && typeof resp == 'object' && Object.prototype.toString.call(resp) == '[object Error]' ){
					throw resp;
				}
			}catch(e){
				resp = new Promise(function(_, reject){
					reject(e);
				});
			}
			Promise.resolve(resp).then(function(payload){
				this._dispatcher.dispatch(constant + '_SUCCESS', payload);
			}.bind(this), function(error){
				this._dispatcher.dispatch(constant + '_FAIL', error);
			}.bind(this));
		}.bind(this);
	}

});

module.exports = Actions;
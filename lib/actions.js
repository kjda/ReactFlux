var _merge = require('lodash/object/merge');
var _forEach = require('lodash/collection/forEach');
var _isArray = require('lodash/lang/isArray');
var Promise = Promise || require('promise');

var constantsConfigs = require('./configs').constants.get();

var Actions = function (dispather, actions) {

	this._dispatcher = dispather;
	this._registerActions(actions);

};

Actions.prototype = _merge(Actions.prototype, {

	/**
	 *@param {object} actions
	 */
	_registerActions: function (actions) {
		_forEach(actions, function (options, actionName) {
			if (!_isArray(options)) {
				throw new Error('ReactFlux.Actions: Action must be an array {login: [CONSTANT, callback]}');
			}
			var constant = options[0];
			var callback = options[1];
			if (typeof callback === "undefined") {
				callback = function () {
				};
			}
			else if (typeof callback != 'function') {
				throw new Error('ReactFlux.Actions: you did not provide a valid callback for action: ' + actionName);
			}
			this[actionName] = this._createAction(actionName, constant, callback);
		}.bind(this));
	},

	/**
	 *@param {string} name
	 *@param {string} constant
	 *@param {string} callback
	 */
	_createAction: function (name, constant, callback) {
		return function () {
			this._dispatch(constant, null, arguments);
			var resp = null;
			try {
				resp = callback.apply(this, arguments);
				if (!!resp && typeof resp == 'object' && Object.prototype.toString.call(resp) == '[object Error]') {
					throw resp;
				}
			} catch (e) {
				resp = new Promise(function (_, reject) {
					reject(e);
				});
			}
			Promise.resolve(resp).then(function (payload) {
				this._dispatch(constant, 'successSuffix', payload);
				this._dispatch(constant, 'afterSuffix', payload);
			}.bind(this), function (payload) {
				this._dispatch(constant, 'failSuffix', payload);
				this._dispatch(constant, 'afterSuffix', payload);
			}.bind(this))
				.catch(function (e) {
					console.error(e.toString(), e.stack);
				});
		}.bind(this);
	},

	/**
	 *@param {string} constant
	 *@param {string} suffixName
	 *@param {mixed} payload
	 */
	_dispatch: function (constant, suffixName, payload) {
		if (!!suffixName) {
			constant += constantsConfigs.separator + constantsConfigs[suffixName];
		}
		this._dispatcher.dispatch(constant, payload);
	}

});

module.exports = Actions;

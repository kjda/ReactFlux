var _isString = require('lodash/lang/isString');

var constantsConfigs = require('./configs').constants.get();

var HANDLER_NAMES = ['before', 'after', 'success', 'fail'];

function StoreActionHandler(store, constant, configs) {
	if (!store || typeof store.isStore !== 'function' || !store.isStore()) {
		throw new Error('StoreActionHandler expects first parameter to be a store');
	}
	if (!_isString(constant) || !constant.length) {
		throw new Error('StoreActionHandler expects second parameter to be a constant(string)');
	}
	if (typeof configs.getInitialState == 'undefined') {
		configs.getInitialState = function () {
			return {};
		};
	}
	if (typeof configs.getInitialState != 'function') {
		throw new Error('StoreActionHandler expects getInitialState to be a function');
	}

	configs = configs || {};
	this.parent = store;
	this.constant = constant;
	this.getInitialState = configs.getInitialState;
	this.before = configs.before || null;
	this.after = configs.after || null;
	this.success = configs.success || null;
	this.fail = configs.fail || null;

	this.parent.setActionState(this.constant, this.getInitialState());

	//register handlers for this constant
	var handlers = [];
	var len = HANDLER_NAMES.length;
	for (var i = 0; i < len; i++) {
		var handlerName = HANDLER_NAMES[i];
		if (this[handlerName] === null) {
			continue;
		}
		if (typeof this[handlerName] !== 'function') {
			throw new Error('StoreActionHandler expects "' + handlerName + '" to be a function');
		}
		var constantName = this.constant;
		if (handlerName !== 'before') {
			constantName += constantsConfigs.separator + constantsConfigs[handlerName + 'Suffix'];
		}
		handlers.push([constantName, this[handlerName].bind(this)]);
	}
	store._setConstantHandlers(handlers);
}

StoreActionHandler.prototype = {
	/**
	 * @param {object} newState
	 */
	setState: function (newState) {
		this.parent.setActionState(this.constant, newState);
	},
	/**
	 * @return {object} state
	 */
	getState: function () {
		return this.parent.getActionState(this.constant);
	}
};

module.exports = StoreActionHandler;

var Constants = require('./constants');
var Actions = require('./actions');
var Store = require('./store');
var MixinFor = require('./mixinFor');
var Dispatcher = require('./dispatcher');
var Configs = require('./configs');

var dispatcher = new Dispatcher();

module.exports = {

	configs: Configs,
	/**
	 * createActions
	 * @param {object} actions
	 */
	createActions: function (actions) {
		return new Actions(dispatcher, actions);
	},

	/**
	 * createStore
	 * @param {object} storeMixin
	 * @param {array} handlers
	 */
	createStore: function (storeMixin, handlers) {
		return new Store(dispatcher, storeMixin, handlers);
	},

	/**
	 * createConstants
	 * @param {array} constants
	 *
	 */
	createConstants: function (constants, prefix) {
		return new Constants(constants, prefix);
	},

	/**
	 * dispatch a message
	 * @param {string} constant
	 * @param {object} payload
	 */
	dispatch: function (constant, payload) {
		dispatcher.dispatch(constant, payload);
	},

	/**
	 * The global dispatcher
	 */
	dispatcher: dispatcher,

	/**
	 * Mixin
	 */
	mixinFor: MixinFor

};

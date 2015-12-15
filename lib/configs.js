var _isString = require('lodash/lang/isString');

var CONSTANTS_DEFAULT_SEPARATOR = '_';
var CONSTANTS_DEFAULT_SUCCESS_SUFFIX = 'SUCCESS';
var CONSTANTS_DEFAULT_FAIL_SUFFIX = 'FAIL';
var CONSTANTS_DEFAULT_AFTER_SUFFIX = 'AFTER';

var CONFIGS = {
	constants: {
		separator: CONSTANTS_DEFAULT_SEPARATOR,
		successSuffix: CONSTANTS_DEFAULT_SUCCESS_SUFFIX,
		failSuffix: CONSTANTS_DEFAULT_FAIL_SUFFIX,
		afterSuffix: CONSTANTS_DEFAULT_AFTER_SUFFIX

	}
};

module.exports = {

	/**
	 * constants
	 */
	constants: {

		/**
		 * @param {string} separator
		 */
		setSeparator: function (separator) {
			if (!_isString(separator) || !separator.length) {
				throw new Error('Constants.separator must be a non empty string');
			}
			CONFIGS.constants.separator = separator;
		},

		/**
		 * @param {string} suffix
		 */
		setSuccessSuffix: function (suffix) {
			if (!_isString(suffix) || !suffix.length) {
				throw new Error('Constants.successSuffix must be a non empty string');
			}
			CONFIGS.constants.successSuffix = suffix;
		},

		/**
		 * @param {string} suffix
		 */
		setFailSuffix: function (suffix) {
			if (!_isString(suffix) || !suffix.length) {
				throw new Error('Constants.failSuffix must be a non empty string');
			}
			CONFIGS.constants.failSuffix = suffix;
		},

		/**
		 * @param {string} suffix
		 */
		setAfterSuffix: function (suffix) {
			if (!_isString(suffix) || !suffix.length) {
				throw new Error('Constants.afterSuffix must be a non empty string');
			}
			CONFIGS.constants.afterSuffix = suffix;
		},

		/**
		 *
		 */
		resetToDefaults: function () {
			CONFIGS.constants.separator = CONSTANTS_DEFAULT_SEPARATOR;
			CONFIGS.constants.successSuffix = CONSTANTS_DEFAULT_SUCCESS_SUFFIX;
			CONFIGS.constants.failSuffix = CONSTANTS_DEFAULT_FAIL_SUFFIX;
			CONFIGS.constants.afterSuffix = CONSTANTS_DEFAULT_AFTER_SUFFIX;
		},

		get: function () {
			return CONFIGS.constants;
		}

	}

};

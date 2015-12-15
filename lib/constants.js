var _forEach = require('lodash/collection/forEach');
var _isArray = require('lodash/lang/isArray');
var _isString = require('lodash/lang/isString');

var cfgs = require('./configs').constants.get();

module.exports = function (constants, prefix) {

	if (!_isArray(constants)) {
		throw new Error('createConstants expects first parameter to be an array of strings');
	}

	prefix = prefix || '';

	if (!_isString(prefix)) {
		throw new Error('createConstants expects second parameter string');
	}

	if (prefix.length > 0) {
		prefix += cfgs.separator;
	}

	var ret = {};
	_forEach(constants, function (constant) {

		if (!_isString(constant)) {
			throw new Error('createConstants expects all constants to be strings');
		}

		ret[constant] = prefix + constant;
		ret[constant + '_' + cfgs.successSuffix] = prefix + constant + cfgs.separator + cfgs.successSuffix;
		ret[constant + '_' + cfgs.failSuffix] = prefix + constant + cfgs.separator + cfgs.failSuffix;
		ret[constant + '_' + cfgs.afterSuffix] = prefix + constant + cfgs.separator + cfgs.afterSuffix;
	});
	return ret;

};

var _forEach = require('lodash-node/modern/collections/forEach');
var _isArray = require('lodash-node/modern/objects/isArray');
var _isString = require('lodash-node/modern/objects/isString');

var v = 0;

module.exports = function(constants){
	if( !_isArray(constants) ){
		throw new Error('Constants expects first parameter to be an array of strings');
	}
	var ret = {};
	_forEach(constants, function(constant){
		if( !_isString(constant) ){
			throw new Error('Constants expects first parameter to be an array of strings');
		}
		ret[constant] = ++v;
	});
	return ret;
}
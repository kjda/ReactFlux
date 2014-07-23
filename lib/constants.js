var _forEach = require('lodash-node/modern/collections/forEach');
var _isArray = require('lodash-node/modern/objects/isArray');
var _isString = require('lodash-node/modern/objects/isString');


module.exports = function(constants, prefix){
	
	if( !_isArray(constants) ){
		throw new Error('Constants expects first parameter to be an array of strings');
	}

	prefix = prefix || '';
	
	if( !_isString(prefix) ){
		throw new Error('Constants expects second parameter string');
	}

	if( prefix.length > 0 ){
		prefix += '_';
	}

	var ret = {};
	_forEach(constants, function(constant){
	
		if( !_isString(constant) ){
			throw new Error('Constants expects first parameter to be an array of strings');
		}
	
		constant = prefix + constant;
		ret[constant] = constant;
		ret[constant + '_SUCCESS'] = constant + '_SUCCESS';
		ret[constant + '_FAIL'] = constant + '_FAIL';	
	});
	return ret;

};
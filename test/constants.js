var ReactFlux = require('../');
var assert = require('chai').assert;



describe("constants", function(){
	
	var constantsWithPrefix = ReactFlux.createConstants(['ONE', 'TWO'], 'PRE');

	var constants = ReactFlux.createConstants(['ONE', 'TWO']);

	it("should create constants without prefix", function(){
		assert.equal(constants.ONE, 'ONE');
		assert.equal(constants.TWO, 'TWO');
	});

	it("should create constants with prefix", function(){
		assert.equal(constantsWithPrefix.ONE, 'PRE_ONE');
		assert.equal(constantsWithPrefix.TWO, 'PRE_TWO');
	});

	it("should create success constants", function(){
		assert.equal(constants.ONE_SUCCESS, 'ONE_SUCCESS');
		assert.equal(constants.TWO_SUCCESS, 'TWO_SUCCESS');
	});

	it("should create failure constants", function(){
		assert.equal(constants.ONE_FAIL, 'ONE_FAIL');
		assert.equal(constants.TWO_FAIL, 'TWO_FAIL');
	});

	it("constant generation should be configurable", function(){
		ReactFlux.configs.constants.setSeparator(':');
		ReactFlux.configs.constants.setSuccessSuffix('OK');
		ReactFlux.configs.constants.setFailSuffix('ERROR');

		var constants = ReactFlux.createConstants(['ONE'], 'NS');
		assert.equal(constants.ONE_OK, 'NS:ONE:OK');
		assert.equal(constants.ONE_ERROR, 'NS:ONE:ERROR');
		
		//reset configs to defaults
		ReactFlux.configs.constants.resetToDefaults();
	});

});
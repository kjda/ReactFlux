var ReactFlux = require('../');
var chai = require('chai');
var assert = chai.assert;



describe("constants", function(){
	
	var constantsWithPrefix = ReactFlux.createConstants(['ONE', 'TWO'], 'PRE');

	var constants = ReactFlux.createConstants(['ONE', 'TWO']);

	it("should create constants without prefix", function(){
		assert.equal(constants.ONE, 'ONE');
		assert.equal(constants.TWO, 'TWO');
	});

	it("should create constants with prefix", function(){
		assert.equal(constantsWithPrefix.PRE_ONE, 'PRE_ONE');
		assert.equal(constantsWithPrefix.PRE_TWO, 'PRE_TWO');
	});

	it("should create success constants", function(){
		assert.equal(constants.ONE_SUCCESS, 'ONE_SUCCESS');
		assert.equal(constants.TWO_SUCCESS, 'TWO_SUCCESS');
	});

	it("should create failure constants", function(){
		assert.equal(constants.ONE_FAIL, 'ONE_FAIL');
		assert.equal(constants.TWO_FAIL, 'TWO_FAIL');
	});

});
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

	it("should accepts an array of constants only", function(){
		assert.throw(function(){
			ReactFlux.createConstants({});
		}, /createConstants expects first parameter to be an array of strings/);
	});

	it("all constants must be strings", function(){
		assert.throw(function(){
			ReactFlux.createConstants(['ONE', null]);
		}, /createConstants expects all constants to be strings/);
	});

	it("prefix should be a string", function(){
		assert.throw(function(){
			ReactFlux.createConstants([], 12);
		}, /createConstants expects second parameter string/);
	});

	

});

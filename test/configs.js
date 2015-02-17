var ReactFlux = require('../');
var assert = require('chai').assert;


describe("configs", function(){

	it("constant generation should be configurable", function(){
		ReactFlux.configs.constants.setSeparator(':');
		ReactFlux.configs.constants.setSuccessSuffix('OK');
		ReactFlux.configs.constants.setFailSuffix('ERROR');
		ReactFlux.configs.constants.setAfterSuffix('DONE');

		var fooConstants = ReactFlux.createConstants(['ONE'], 'FOO');
		assert.equal(fooConstants.ONE_OK, 'FOO:ONE:OK');
		assert.equal(fooConstants.ONE_ERROR, 'FOO:ONE:ERROR');
		assert.equal(fooConstants.ONE_DONE, 'FOO:ONE:DONE');

		ReactFlux.configs.constants.resetToDefaults();

		var barConstants = ReactFlux.createConstants(['TWO'], 'BAR');
		assert.equal(barConstants.TWO_SUCCESS, 'BAR_TWO_SUCCESS');
		assert.equal(barConstants.TWO_FAIL, 'BAR_TWO_FAIL');
		assert.equal(barConstants.TWO_AFTER, 'BAR_TWO_AFTER');
  });



  it("complains if Constants separator is not a string", function(){
		assert.throw(function(){
		  ReactFlux.configs.constants.setSeparator({});
		}, 'Constants.separator must be a non empty string');

		assert.throw(function(){
		  ReactFlux.configs.constants.setSeparator('');
		}, 'Constants.separator must be a non empty string');

  });


  it("complains if successSuffix is not a string", function(){
		assert.throw(function(){
		  ReactFlux.configs.constants.setSuccessSuffix({});
		}, 'Constants.successSuffix must be a non empty string');

		assert.throw(function(){
		  ReactFlux.configs.constants.setSuccessSuffix('');
		}, 'Constants.successSuffix must be a non empty string');

  });

  it("complains if failSuffix is not a string", function(){
		assert.throw(function(){
		  ReactFlux.configs.constants.setFailSuffix({});
		}, 'Constants.failSuffix must be a non empty string');

		assert.throw(function(){
		  ReactFlux.configs.constants.setFailSuffix('');
		}, 'Constants.failSuffix must be a non empty string');

  });

  it("complains if afterSuffix is not a string", function(){
		assert.throw(function(){
		  ReactFlux.configs.constants.setAfterSuffix({});
		}, 'Constants.afterSuffix must be a non empty string');

		assert.throw(function(){
		  ReactFlux.configs.constants.setAfterSuffix('');
		}, 'Constants.afterSuffix must be a non empty string');

  });

});

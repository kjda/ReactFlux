var ReactFlux = require('../');
var assert = require('chai').assert;
var sinon = require("sinon");

describe("actions", function(){

	var constants = ReactFlux.createConstants(['ONE', 'TWO']);
	var actions, action1Spy;

	beforeEach(function(){
		action1Spy = sinon.spy(function(par1){
			return {
				par1: par1
			};
		});

		actions = ReactFlux.createActions({

			action1: [constants.ONE, action1Spy],

			action2: [constants.TWO, function(){

			}]

		});

	});

	it("should create actions", function(){
		assert.typeOf(actions, 'object');
		assert.typeOf(actions.action1, 'function');
		assert.typeOf(actions.action2, 'function');
	});

	it("action callback should be callable", function(){
		actions.action1('arg1', 'arg2');
		assert.isTrue(action1Spy.calledWith('arg1', 'arg2'));
	});

});
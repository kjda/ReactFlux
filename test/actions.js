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

	it("accepts an array as the only possible action definition", function(){
		function throwsError(){
			ReactFlux.createActions({
				action1: function(){}
			});
		}
		assert.throw(throwsError, /Action must be an array/g);
	});

	it("action must be a function", function(){
		function throwsError(){
			ReactFlux.createActions({
				action1: ['ACTION1', 'someOtherValue']
			});
		}
		assert.throw(throwsError, /you did not provide a valid callback for action/g);
	});

	it("creates a default empty callbacl", function(){
		var actions = ReactFlux.createActions({
			action1: ['ACTION1']
		});
		assert.isFunction(actions.action1);
	});

});

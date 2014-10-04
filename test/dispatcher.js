var promise = require('es6-promise').Promise;
var ReactFlux = require('../');
var assert = require('chai').assert;
var sinon = require("sinon");

var constants = ReactFlux.createConstants(['ONE', 'TWO']);

describe("dispatcher", function(){
	
	var action1Spy, action2Spy;
	var storeAction1Spy;
	var storeAction1SuccessSpy;
	var storeAction2FailSpy;
	var store2Action1SuccessSpy;
	var actions;
	var store1, store2;

	beforeEach(function(){
		
		action1Spy = sinon.spy(function(id, username){
			return {
				id: id,
				username: username
			};
		});

		action2Spy = sinon.spy(function(id, username){
			return new Error('error2');
		});

		actions = ReactFlux.createActions({
			action1: [constants.ONE, action1Spy],
			action2: [constants.TWO, action2Spy]
		});
		
		storeAction1Spy = sinon.spy(function(payload){
			
		});

		storeAction1SuccessSpy = sinon.spy(function(payload){
			return;
		});

		store2Action1SuccessSpy = sinon.spy(function(payload){

		});

		storeAction2FailSpy = sinon.spy(function(error){

		});
		
		storeAction1FailSpy = sinon.spy(function(){});

		

		store1 = ReactFlux.createStore({
			getName: function(){
				return "store1";
			}
		}, [
			[constants.TWO_FAIL, storeAction2FailSpy],
			[constants.ONE_SUCCESS, storeAction1SuccessSpy],
			[constants.ONE, storeAction1Spy]
			]);

		store2 = ReactFlux.createStore({
			getName: function(){
				return "store2";
			}
		}, [
			[constants.ONE, sinon.spy(function(){})],
			[constants.TWO_FAIL, sinon.spy(function(){})],
			[constants.ONE_SUCCESS, [store1], store2Action1SuccessSpy]
			]);
	});

	it("should throw an error if constant is empty or undefined", function(){
		function createStore(constant){
			ReactFlux.createStore({}, [
				[constant, function(){}]
			]);
		}
		assert.throws(function(){
			createStore();
		},  /constant/);
		assert.throws(function(){
			createStore('');
		},  /constant/);
	});

	it("should  execute action", function(){
		actions.action1(1, "mustermann");
		assert.isTrue(action1Spy.called);
		actions.action2();
		assert.isTrue(action2Spy.called);
	});

	it("should dispatch action to store", function(){
		actions.action1(1, "mustermann");
		assert.isTrue(storeAction1Spy.called);
	});

	it("should dispatch SUCCESS to store", function(done){
		actions.action1(1, "mustermann");
		setTimeout(function(){
			assert.isTrue(storeAction1SuccessSpy.called);
			done();	
		}, 0);
	});

	it("should dispatch SUCCESS with correct payload", function(done){
		actions.action1(1, "mustermann");
		setTimeout(function(){
			assert.isTrue(storeAction1SuccessSpy.calledWith({id: 1, username: 'mustermann'}));
			done();
		}, 0);
	});

	it("should dispatch FAIL to store", function(done){
		actions.action2();
		setTimeout(function(){
			assert.isTrue(storeAction2FailSpy.called);
			done();	
		}, 0);
	});

	it("should be able to wait for other stores", function(done){
		actions.action1();
		setTimeout(function(){
			assert.isTrue(store2Action1SuccessSpy.calledAfter(storeAction1SuccessSpy));
			done();	
		}, 0);
	});

	it("should be able to dispatch specific messages without going through actions", function(done){
		ReactFlux.dispatch(constants.ONE_SUCCESS);
		setTimeout(function(){
			assert.isTrue( storeAction1SuccessSpy.called );
			assert.isTrue( store2Action1SuccessSpy.called );
			done();
		}, 0);
	});

});
var ReactFlux = require('../');
var assert = require('chai').assert;
var sinon = require("sinon");

var constants = ReactFlux.createConstants(['ONE', 'TWO', 'THREE'], 'DIS');

describe("dispatcher", function(){

	var action1Spy, action2Spy;
	var store1Action1BeforeSpy, store1Action1AfterSpy, store1Action1SuccessSpy;
	var actionHandlerBeforeSpy, actionHandlerAfterSpy, actionHandlerSuccessSpy, actionHandlerFailSpy;
	var store1Action2FailSpy;
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
			action2: [constants.TWO, action2Spy],
			action3: [constants.THREE, function(){ return {};}]
		});

		store1Action1BeforeSpy = sinon.spy(function(){});
		store1Action1AfterSpy = sinon.spy(function(){});
		store1Action1SuccessSpy = sinon.spy(function(){});
		store1Action2FailSpy = sinon.spy(function(){});

		store2Action1SuccessSpy = sinon.spy(function(){});

		actionHandlerBeforeSpy = sinon.spy(function(){});
		actionHandlerAfterSpy = sinon.spy(function(){});
		actionHandlerSuccessSpy = sinon.spy(function(){});
		actionHandlerFailSpy = sinon.spy(function(){});


		store1 = ReactFlux.createStore({
			getName: function(){
				return "store1";
			}
		}, [
			[constants.ONE, store1Action1BeforeSpy],
			[constants.ONE_AFTER, store1Action1AfterSpy],
			[constants.ONE_SUCCESS, store1Action1SuccessSpy],
			[constants.TWO_FAIL, store1Action2FailSpy]
		]);

		store1.addActionHandler(constants.THREE, {
			before: actionHandlerBeforeSpy,
			after: actionHandlerAfterSpy,
			success: actionHandlerSuccessSpy,
			fail: actionHandlerFailSpy
		});

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
		assert.isTrue(store1Action1BeforeSpy.called);
	});

	it("should dispatch AFTER to store", function(done){
		actions.action1(1, "mustermann");
		setTimeout(function(){
			assert.isTrue(store1Action1AfterSpy.called);
			done();
		}, 0);
	});

	it("should dispatch SUCCESS to store", function(done){
		actions.action1(1, "mustermann");
		setTimeout(function(){
			assert.isTrue(store1Action1SuccessSpy.called);
			done();
		}, 0);
	});

	it("should dispatch SUCCESS with correct payload", function(done){
		actions.action1(1, "mustermann");
		setTimeout(function(){
			assert.isTrue(store1Action1SuccessSpy.calledWith({id: 1, username: 'mustermann'}));
			done();
		}, 0);
	});

	it("should dispatch FAIL to store", function(done){
		actions.action2();
		setTimeout(function(){
			assert.isTrue(store1Action2FailSpy.called);
			done();
		}, 0);
	});

	it("should be able to wait for other stores", function(done){
		actions.action1();
		setTimeout(function(){
			assert.isTrue(store2Action1SuccessSpy.calledAfter(store1Action1SuccessSpy));
			done();
		}, 0);
	});

	it("should be able to dispatch specific messages without going through actions", function(done){
		ReactFlux.dispatch(constants.ONE_SUCCESS);
		setTimeout(function(){
			assert.isTrue( store1Action1SuccessSpy.called );
			assert.isTrue( store2Action1SuccessSpy.called );
			done();
		}, 0);
	});

	it("should dispatch BEFORE to actionHandler", function(done){
		actions.action3(1, "mustermann");
			assert.isTrue(actionHandlerBeforeSpy.called);
			done();
	});

	it("should dispatch AFTER to actionHandler", function(done){
		actions.action3(1, "mustermann");
		setTimeout(function(){
			assert.isTrue(actionHandlerAfterSpy.called);
			done();
		}, 0);
	});

	it("should dispatch SUCCESS to actionHandler", function(done){
		actions.action3(1, "mustermann");
		setTimeout(function(){
			assert.isTrue(actionHandlerSuccessSpy.called);
			done();
		}, 0);
	});

	it("should NOT dispatch FAIL to actionHandler when SUCCESS", function(done){
		actions.action3(1, "mustermann");
		setTimeout(function(){
			assert.isFalse(actionHandlerFailSpy.called);
			done();
		}, 0);
	});

	it("register should throw an error if callback is not a function", function(){
		assert.throw(function(){
			ReactFlux.dispatcher.register("SOME_CONST", null);
		}, /Dispatcher.register expects second parameter to be a callback/);
	});

	it("register should throw an error if waitForIndexes is not an array", function(){
		assert.throw(function(){
			ReactFlux.dispatcher.register("SOME_CONST", function(){}, {});
		}, /Dispatcher.register expects third parameter to be null or an array/);
	});

});

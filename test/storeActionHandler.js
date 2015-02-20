var ReactFlux = require('../');
var assert = require('chai').assert;

var StoreActionHandler = require('../lib/storeActionHandler');

describe("storeActionHandler", function(){

	it("should work on store only", function(){
		assert.throw(function(){
			new StoreActionHandler({});
		}, 'StoreActionHandler expects first parameter to be a store');
	});

	it("expects second parameter to be a constant", function(){
		assert.throw(function(){
			var store = ReactFlux.createStore();
			new StoreActionHandler(store, '');
		}, 'StoreActionHandler expects second parameter to be a constant(string)');
	});

	it("should create a default getInitialState", function(){
		var store = ReactFlux.createStore();
		var actionHandler = new StoreActionHandler(store, 'FOO', {});
		assert.isFunction(actionHandler.getInitialState);
	});

	it("should have a setState", function(){
		var store = ReactFlux.createStore();
		var actionHandler = new StoreActionHandler(store, 'FOO', {});
		assert.isFunction(actionHandler.setState);
	});

	it("should have a getState", function(){
		var store = ReactFlux.createStore();
		var actionHandler = new StoreActionHandler(store, 'FOO', {});
		assert.isFunction(actionHandler.getState);
	});

	it("should have a parent", function(){
		var store = ReactFlux.createStore();
		var actionHandler = new StoreActionHandler(store, 'FOO', {});
		assert.isObject(actionHandler.parent)
		assert.isTrue(actionHandler.parent.isStore());
	});

	//@todo: test that setting state work

	it("it should complain if getInitialState is not a function", function(){
		assert.throw(function(){
			var store = ReactFlux.createStore();
			new StoreActionHandler(store, 'FOO', {
				getInitialState: {}
			});
		}, 'StoreActionHandler expects getInitialState to be a function');
	});

	it("it should complain if before,success,error or after is not a function", function(){
		assert.throw(function(){
			var store = ReactFlux.createStore();
			new StoreActionHandler(store, 'FOO', {
				before: {}
			});
		}, 'StoreActionHandler expects "before" to be a function');
	});


});

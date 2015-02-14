var assert = require('chai').assert;
var sinon = require("sinon");
var Flux = require('../');
var sinon = require("sinon");

describe("Mixin", function(){

	it("Flux should provide mixin interface", function(){
		assert.isFunction(Flux.mixin);

		var mixin = Flux.mixin(Flux.createStore());
		assert.isFunction(mixin.componentWillMount, 'mixin.componentWillMount is misiing');
		assert.isFunction(mixin.componentDidMount, 'mixin.componentDidMount is misiing');
		assert.isFunction(mixin.componentWillUnmount, 'mixin.componentWillUnmount is missing');
	});

	it("accepts a store or an array of stores only", function(){
		assert.throws(function(){
			Flux.mixin();
		}, Error, /stores/);
		assert.throws(function(){
			Flux.mixin('');
		}, Error, /stores/);
		assert.throws(function(){
			Flux.mixin({});
		}, Error, /stores/);
	});

	it("calls component.setState", function(done){
		var mixin = Flux.mixin( Flux.createStore() );
		mixin.state = {};
		mixin.setState = function(state){
			mixin.state = state;
		};
		mixin.getStateFromStores = function(){
			return {
				foo: 'bar'
			};
		};
		mixin.isMounted = function(){
			return true;
		};
		mixin.componentWillMount();
		setTimeout(function(){
			assert.equal(mixin.state.foo, 'bar');
			done();
		}, 0);
	});

	it("it should subscribe and unsubscribe for store changes", function(){

		var store = Flux.createStore();
		store.onChange = sinon.spy(function(){
		});
		store.offChange = sinon.spy(function(){
		});

		var mixin = Flux.mixin( store );

		mixin.componentDidMount();
		assert.isTrue(store.onChange.called, 'mixin did not subscribe for store changes');
		assert.isFalse(store.offChange.called);

		mixin.componentWillUnmount();
		assert.isTrue(store.offChange.called, 'mixin did not unsubscribe from store changes');

	});

});

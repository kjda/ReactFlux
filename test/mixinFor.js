var assert = require('chai').assert;
var sinon = require("sinon");
var Flux = require('../');
var sinon = require("sinon");

describe("MixinFor", function(){

	it("Flux should provide mixinFor interface", function(){
		assert.isFunction(Flux.mixinFor);

		var mixinFor = Flux.mixinFor(Flux.createStore());
		assert.isFunction(mixinFor.componentWillMount, 'mixinFor.componentWillMount is misiing');
		assert.isFunction(mixinFor.componentDidMount, 'mixinFor.componentDidMount is misiing');
		assert.isFunction(mixinFor.componentWillUnmount, 'mixinFor.componentWillUnmount is missing');
	});

	it("accepts a store or an array of stores only", function(){
		assert.throws(function(){
			Flux.mixinFor();
		}, Error, /stores/);
		assert.throws(function(){
			Flux.mixinFor('');
		}, Error, /stores/);
		assert.throws(function(){
			Flux.mixinFor({});
		}, Error, /stores/);
	});

	it("should call component.setState", function(done){
		var mixinFor = Flux.mixinFor( Flux.createStore() );
		mixinFor.state = {};
		mixinFor.setState = function(state){
			mixinFor.state = state;
		};
		mixinFor.getStateFromStores = function(){
			return {
				foo: 'bar'
			};
		};
		mixinFor.isMounted = function(){
			return true;
		};
		mixinFor.componentWillMount();
		setTimeout(function(){
			assert.equal(mixinFor.state.foo, 'bar');
			done();
		}, 0);
	});

	it("should call getStateFromStores onChange", function(done){
		var store = Flux.createStore();
		var mixinFor = Flux.mixinFor( store );
		mixinFor.state = {};
		mixinFor.setState = function(state){
			mixinFor.state = state;
		};
		mixinFor.getStateFromStores = sinon.spy(function(){
			return {
				foo: 'bar'
			};
		});
		mixinFor.isMounted = function(){
			return true;
		};
		mixinFor.componentWillMount();
		mixinFor.componentDidMount();
		store.setState({foo: 'bar'});
		setTimeout(function(){
			assert.isTrue( mixinFor.getStateFromStores.calledTwice );
			done();
		}, 0);
	});

	it("should not call getStateFromStores onChange if component is not mounted", function(done){
		var store = Flux.createStore();
		var mixinFor = Flux.mixinFor( store );
		mixinFor.state = {};
		mixinFor.setState = function(state){
			mixinFor.state = state;
		};
		mixinFor.getStateFromStores = sinon.spy(function(){
			return {
				foo: 'bar'
			};
		});
		mixinFor.isMounted = function(){
			return false;
		};
		mixinFor.componentWillMount();
		mixinFor.componentDidMount();
		store.setState({foo: 'bar'});
		setTimeout(function(){
			assert.isTrue( mixinFor.getStateFromStores.calledOnce );
			done();
		}, 0);
	});

	it("it should subscribe and unsubscribe for store changes", function(){

		var store = Flux.createStore();
		store.onChange = sinon.spy(function(){
		});
		store.offChange = sinon.spy(function(){
		});

		var mixinFor = Flux.mixinFor( store );

		mixinFor.componentDidMount();
		assert.isTrue(store.onChange.called, 'mixinFor did not subscribe for store changes');
		assert.isFalse(store.offChange.called);

		mixinFor.componentWillUnmount();
		assert.isTrue(store.offChange.called, 'mixinFor did not unsubscribe from store changes');

	});

});

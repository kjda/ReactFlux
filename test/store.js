var ReactFlux = require('../');
var chai = require('chai');
var assert = chai.assert;
var sinon = require("sinon");

var constants = ReactFlux.createConstants(['ONE','TWO']);


var actions = ReactFlux.createActions({

			action1: [constants.ONE, function(){

			}],

			action2: [constants.TWO, function(){

			}]

		});

var storeDidMountSpy = sinon.spy();
var getInitialStateSpy = sinon.spy(function(){
		return {
			id: 1,
			username: 'mustermann'
		}
	});

var store = ReactFlux.createStore({
	getInitialState: getInitialStateSpy,

	storeDidMount: storeDidMountSpy,

	getId: function(){
		return this.getState().id
	},

	getName: function(){
		return "STOR!111"
	}
}, [
[constants.ONE, function(){

}]
]);


describe("store", function(){

	it("should create store with mixins", function(){
		assert.typeOf(store, 'object');
		assert.typeOf(store.getId, 'function');
		assert.typeOf(actions.action2, 'function');
	});

	it("should call getInitialState", function(){
		assert.isTrue( getInitialStateSpy.called );
	});

	it("should call storeDidMount", function(){
		assert.isTrue( storeDidMountSpy.called );
	});

	it("should call storeDidMount after getInitialState", function(){
		assert.isTrue( storeDidMountSpy.calledAfter( getInitialStateSpy ) );
	});

	it("should have getState function", function(){
		assert.typeOf(store.getState, "function");
	});

	it("getState should work", function(){
		var state = store.getState();
		assert.equal(state.id, 1);
		assert.equal(state.username, "mustermann");
	});

	it("should be able to call mixin methods", function(){
		assert.equal(store.getId(), 1);
	});

	it("should have a working setState", function(){
		store.setState({
			id: 3
		});
		assert.equal(store.getId(), 3);
		assert.equal(store.getState().username, 'mustermann');
	});


	it("should have onChange/offChange", function(){
		assert.typeOf(store.onChange, "function");
		assert.typeOf(store.offChange, "function");
	});

	it("should call onChange when state changes", function(){
		var spy = sinon.spy();
		store.onChange( spy );
		store.setState({id: 2});
		assert.isTrue( spy.called );
	});

	it("offChange should remove listener", function(){
		var spy = sinon.spy();
		store.onChange( spy );
		store.offChange( spy );
		store.setState({id: 2});
		assert.isFalse( spy.called );
	});

});
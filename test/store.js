var ReactFlux = require('../');
var assert = require('chai').assert;
var sinon = require("sinon");

var constants = ReactFlux.createConstants(['ONE','TWO'], 'STORE');


var storeDidMountSpy = sinon.spy();

var FooMixin = {
  bar: sinon.spy()
};

var BarMixin = {
  foo: sinon.spy()
};

var EnhancedFooMixin = {
  mixins: [FooMixin],
  enhancedBar: sinon.spy()
};

var getInitialStateSpy = sinon.spy(function(){
	return {
		id: 1,
		username: 'mustermann'
	};
});

var store = ReactFlux.createStore({

  mixins: [
    EnhancedFooMixin,
    BarMixin
  ],
	
	getInitialState: getInitialStateSpy,

	storeDidMount: storeDidMountSpy,

	getId: function(){
		return this.state.get('id')
	}

}, [
	[constants.ONE, function(){}]
]);

store.addActionHandler(constants.TWO, {
	getInitialState: function(){
		return {
			name: 'TWO_HANDLER'
		};
	},
	before: function(){
	},
	after: function(){
	},
	success: function(){
	},
	fail: function(){
	}
});

describe("store", function(){

	it("should create store with mixins", function(){
		assert.typeOf(store, 'object');
		assert.typeOf(store.getId, 'function');
	});

  it("should use the mixins property", function(){
    assert.typeOf(store.foo, 'function');
    assert.typeOf(store.enhancedBar, 'function');
  });

  it("should recursively use the mixins property", function(){
    assert.typeOf(store.bar, 'function');
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

	it("should have a state", function(){
		assert.typeOf(store.state, "object");
	});

	it("store.state.get() should work", function(){
		assert.equal(store.state.get('id'), 1);
		assert.equal(store.state.get('username'), "mustermann");
	});

	it("store.get() should work", function(){
		assert.equal(store.get('id'), 1);
		assert.equal(store.get('username'), "mustermann");
	});

	it("should be able to call mixin methods", function(){
		assert.equal(store.getId(), 1);
	});

	it("should have a working setState", function(){
		store.setState({
			id: 3
		});
		assert.equal(store.state.get('id'), 3);
		assert.equal(store.state.get('username'), 'mustermann');
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

	it("getActionState should work", function(){
		assert.typeOf(store.getActionState, 'function', 'store.getActionState should be a function');
		var state = store.getActionState(constants.TWO);
		assert.typeOf(state, 'object', 'store.getActionState should return an object');
		assert.equal(state.name, 'TWO_HANDLER', 'store.getActionState should return state object correctly');
		assert.equal(store.getActionState(constants.TWO, 'name'), 'TWO_HANDLER');
	});

});

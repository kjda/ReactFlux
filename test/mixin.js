var assert = require('chai').assert;
var sinon = require("sinon");
var Flux = require('../');
var React = require('react');

describe("Mixin", function(){
	
	it("Flux should provide mixin interface", function(){
		assert.isFunction(Flux.mixin);
		
		var mixin = Flux.mixin(Flux.createStore());
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


	//...

});
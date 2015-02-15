var ReactFlux = require('../');
var assert = require('chai').assert;
var Promise = require('promise');

var constants = ReactFlux.createConstants(['ONE', 'TWO'], 'STORE');

var actions = ReactFlux.createActions({
  one: [constants.ONE, function () {
    return new Promise(function (resolve, reject) {
      setTimeout(resolve, 10);
    });
  }],
  two: [constants.TWO, function () {
    return new Promise(function (resolve, reject) {
      setTimeout(resolve, 0);
    });
  }]
});

describe("progress", function () {

  it("should be false by default", function () {
    assert.isFalse(ReactFlux.progress.of(constants.ONE));
    assert.isFalse(ReactFlux.progress.of(constants.TWO));
  });

  it("should be true when in progress", function ( done ) {
    assert.isFalse(ReactFlux.progress.of(constants.ONE));
    actions.one();
    assert.isTrue(ReactFlux.progress.of(constants.ONE));
    setTimeout(function () {
      try {
        assert.isTrue(ReactFlux.progress.of(constants.ONE));
        done();
      } catch ( e ) {
        done(e);
      }
    }, 0);

  });

  it("should be false when progress is done", function ( done ) {
    actions.two();
    assert.isTrue(ReactFlux.progress.of(constants.TWO));
    setTimeout(function () {
      try {
        assert.isFalse(ReactFlux.progress.of(constants.TWO));
        done();
      } catch ( e ) {
        done(e);
      }
    }, 10);
  });

});

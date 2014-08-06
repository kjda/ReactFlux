var webpack = require('webpack');

var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

module.exports = {
  
  context: __dirname + '/lib/',
  
  watch: true,
  
  entry: './index.js',
  
  output: {
    path:  './dist/',
    filename: 'react-flux.js',
    library: 'ReactFlux',
    libraryTarget: 'umd'
  },
  
  resolve: {
    extensions: ['', '.js'],
  },
  
  module: {
        
  },

  externals: {
    'immutable': true,
    'es6-promise': true,
    'EventEmitter': true     
  },
  
  plugins: [
    new UglifyJsPlugin()
  ]
};
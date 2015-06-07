var webpack = require('webpack');

var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

module.exports = {

	context: __dirname + '/lib/',

	watch: true,

	entry: './index.js',

	output: {
		path: './dist/',
		filename: 'react-flux.js',
		library: 'ReactFlux',
		libraryTarget: 'umd'
	},

	resolve: {
		extensions: ['', '.js'],
	},

	module: {},

	externals: {
		promise: true,
		react: {
			root: 'React',
			commonjs: 'react',
			commonjs2: 'react',
			amd: 'react'
		}
	},

	plugins: [
		new UglifyJsPlugin()
	]
};

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const projectConfig = require('./src/project.json')

module.exports = {
	entry: {
		main: 'src/Portal.js',
	},
	output: {
		publicPath: '',
		filename: 'portal.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.js?$/,
				exclude: [path.resolve(__dirname, 'node_modules')],
				loader: 'babel-loader',
				options: {
					presets: ['stage-3','es2015']
				}
			}
		],
	},
	node: {
		fs: 'empty'
	},
	resolve: {
		modules: [
			__dirname,
			'node_modules',
		],
	},
	plugins: [
        CopyWebpackPlugin([
            {from: path.resolve(__dirname, 'src/index.html')},
            {from: path.resolve(__dirname, 'libs/system.js')},
        ]),
		new CleanWebpackPlugin(['dist'])
	],
	devtool: 'source-map',
	externals: [
	],
    devServer: {
		contentBase: './dist',
        historyApiFallback: true,
        watchOptions: { aggregateTimeout: 300, poll: 1000 },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
		proxy: (function proxy() {
			let proxy = {}
			projectConfig.projects.forEach(element => {
				for (const key in element.proxy) {
					const object = element.proxy;
					if (object.hasOwnProperty(key)) {
						proxy[key] = object[key]
					}
				}
			});
			return proxy
		})()
    },
};

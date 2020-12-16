var path = require('path');

module.exports = {
	entry: "./src/client/client_main.js",
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
		],
	},

	resolve: {
		fallback: {
			crypto: false,
			http: false,
			url: false,
			path: false,
			stream: false,
			zlib: false,
			fs: false,
			querystring: false,
			util: false,
			buffer: false,
			net: false,
		},
	},
};

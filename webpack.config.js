var path = require("path");
var fs = require("fs");

module.exports = {
	entry: "./src/client/client_main.js",
	output: {
		path: path.join(__dirname, "dist"),
		filename: "bundle.js"
	}
};

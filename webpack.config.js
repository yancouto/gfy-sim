var path = require("path");

module.exports = {
	entry: "./src/client/client_main.js",
	output: {
		path: path.join(__dirname, "dist"),
		filename: "bundle.js"
	}
};

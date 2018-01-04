const ClientEngine = require("lance-gg").ClientEngine;
const GFYRenderer = require("../client/GFYRenderer");

class GFYClientEngine extends ClientEngine {
	constructor(gameEngine, options) {
		super(gameEngine, options, GFYRenderer);
		//this.serializer.registerClass(require("../common/Ship"));
		//this.serializer.registerClass(require("../common/Missile"));
	}

	start() {
		super.start();
		console.log("starting ClientEngine");
		this.gameEngine.trace.info("TRACE: starting ClientEngine");
	}
}

module.exports = GFYClientEngine;

'use strict';

const Renderer = require('lance-gg').render.Renderer;


class GFYRenderer extends Renderer {

	constructor(gameEngine, clientEngine) {
		super(gameEngine, clientEngine);
	}


	draw() {
		super.draw();

		let canvas = document.getElementById('canvas');

		let ctx = canvas.getContext('2d');

		ctx.fillStyle = 'rgb(255, 0, 0)';
		ctx.fillRect(10, 10, 50, 100);
	}
}

module.exports = GFYRenderer;

// Useful Rendering stuff
"use strict";

const RU = module.exports = {};

function updateDimensions() {
	RU.W = document.documentElement.clientWidth - 20;
	RU.H = document.documentElement.clientHeight - 20;
	if(RU.canvas) {
		RU.canvas.width = RU.W;
		RU.canvas.height = RU.H;
	}
	console.log("Now " + RU.W + " x " + RU.H);
}

window.addEventListener('resize', updateDimensions);
window.addEventListener('load', function() {
	RU.canvas = document.getElementById("canvas");
	RU.ctx = canvas.getContext('2d');
	console.assert(RU.canvas);
	updateDimensions();
});

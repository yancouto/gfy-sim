// Useful Rendering stuff
"use strict";

const RU = module.exports = {};
RU.W = 300;
RU.H = 300;

function updateDimensions() {
	RU.W = document.documentElement.clientWidth - 20;
	RU.H = document.documentElement.clientHeight - 20;
	if(RU.canvas) {
		RU.canvas.width = RU.W;
		RU.canvas.height = RU.H;
	}
	console.log("Now " + RU.W + " x " + RU.H);
}

window.addEventListener("resize", updateDimensions);
window.addEventListener("load", function() {
	RU.canvas = document.getElementById("canvas");
	RU.ctx = RU.canvas.getContext("2d");
	RU.ctx.font = "48px serif";
	console.assert(RU.canvas);
	updateDimensions();
});

RU.font_height = 48;

RU.setFont = function(size, type) {
	let pc = Math.min(RU.W / 2560, RU.H / 1080);
	let sz = Math.round(pc * size * 120 / 22);
	RU.ctx.font = sz + "px " + (type || "sans-serif");
	RU.font_height = sz;
};

RU.drawCenteredText = function(text, x, y) {
	let sz = RU.ctx.measureText(text);
	RU.ctx.fillText(text, x - sz.width / 2, y - RU.font_height / 2);
};

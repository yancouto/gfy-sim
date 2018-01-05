// Useful Rendering stuff
"use strict";

const RU = module.exports = {};
RU.W = 300;
RU.H = 300;

function update_dimensions() {
	RU.W = document.documentElement.clientWidth - 20;
	RU.H = document.documentElement.clientHeight - 20;
	if(RU.canvas) {
		RU.canvas.width = RU.W;
		RU.canvas.height = RU.H;
	}
	console.log("Now " + RU.W + " x " + RU.H);
}

window.addEventListener("resize", update_dimensions);
window.addEventListener("load", function() {
	RU.canvas = document.getElementById("canvas");
	RU.ctx = RU.canvas.getContext("2d");
	RU.ctx.font = "48px serif";
	RU.font_height = 48;
	console.assert(RU.canvas);
	update_dimensions();
});

RU.set_font = function(size, type) {
	let pc = Math.min(RU.W / 2560, RU.H / 1080);
	RU.font_height = Math.round(pc * size * 120 / 22);
	RU.ctx.font = RU.font_height + "px " + (type || "sans-serif");
};

RU.draw_centered_text = function(text, x, y) {
	let sz = RU.ctx.measureText(text);
	RU.ctx.fillText(text, x - sz.width / 2, y - RU.font_height / 2);
};

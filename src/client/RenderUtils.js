// Useful Rendering stuff
"use strict";

const RU = module.exports = {};
RU.W = 300;
RU.H = 300;

RU.CANVAS_BORDER = 10;

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

RU.ALIGN_LEFT = RU.ALIGN_TOP = 0;
RU.ALIGN_CENTER = 1;
RU.ALIGN_RIGHT = RU.ALIGN_BOTTOM = 2;
// align horizontal and vertical
RU.draw_text_align = function(text, x, y, h_align, v_align) {
	let sz = RU.ctx.measureText(text);
	if(h_align === undefined || h_align === 1)
		x -= sz.width / 2;
	else if(h_align === 2)
		x -= sz.width;
	if(v_align === undefined || v_align === 1)
		y += RU.font_height / 2;
	else if(v_align === 0)
		y += RU.font_height;
	RU.ctx.fillText(text, x, y);
};

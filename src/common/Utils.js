let Utils = module.exports = {};

Utils.on_server = false;

Utils.clamp = function(x, min, max) {
	if(x < min) return min;
	if(x > max) return max;
	return x;
};
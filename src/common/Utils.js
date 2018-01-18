let Utils = module.exports = {};

Utils.game_version = "0.0.1";

Utils.on_server = false;

Utils.clamp = function(x, min, max) {
	if(x < min) return min;
	if(x > max) return max;
	return x;
};

Utils.point_in_rect = function(x, y, xr, yr, wr, hr) {
	return !(x < xr || x > xr + wr || y < yr || y > yr + hr);
};

"use strict";

const Utils = (module.exports = {});

Utils.game_version = "0.0.2";

Utils.on_server = false;

Utils.clamp = function(x, min, max) {
	if (x < min) return min;
	if (x > max) return max;
	return x;
};

Utils.point_in_rect = function(x, y, xr, yr, wr, hr) {
	return !(x < xr || x > xr + wr || y < yr || y > yr + hr);
};

// If name is already in name_list, add some suffix to make it unique
Utils.avoid_duplicate_name = function(name, name_list) {
	if (name_list.indexOf(name) == -1) return name;
	for (let i = 1; ; i++)
		if (name_list.indexOf(name + "_" + i) == -1) return name + "_" + i;
};

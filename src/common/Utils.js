export const game_version = "0.0.2";

export const on_server = false;

export const client_socket = null;

export function clamp(x, min, max) {
	if (x < min) return min;
	if (x > max) return max;
	return x;
}

export function point_in_rect(x, y, xr, yr, wr, hr) {
	return !(x < xr || x > xr + wr || y < yr || y > yr + hr);
}

// If name is already in name_list, add some suffix to make it unique
export function avoid_duplicate_name(name, name_list) {
	if (name_list.indexOf(name) == -1) return name;
	for (let i = 1; ; i++)
		if (name_list.indexOf(name + "_" + i) == -1) return name + "_" + i;
}

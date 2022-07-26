export function setThemeOfday(is_day) {
	document.body.classList.remove('day');
	document.body.classList.remove('night');

	if (is_day) document.body.classList.add('day');
	else document.body.classList.add('night');
}

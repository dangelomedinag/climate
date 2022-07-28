import { dataStore } from '../utils/data_store';

export function setThemeOfday() {
	document.body.classList.remove('day');
	document.body.classList.remove('night');

	const { is_day } = dataStore.value.data.current;

	if (is_day) document.body.classList.add('day');
	else document.body.classList.add('night');
}

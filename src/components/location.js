import { $ } from '../utils';
import { dataStore } from '../utils/data_store';
const textLocation = $('.location');

export default function Location() {
	const { data } = dataStore.value;
	const { name, country, region } = data.location;
	textLocation.textContent = `${name}, ${region}, ${country}.`;
}

// import { $ } from '../utils';
import { dataStore } from '../utils/data_store';

{
	/* <div class="shadow-smooth location">
	Santiago, region metrolitana, chile.
	</div> */
}
/**@type {HTMLElement} */
const div = document.createElement('div');
div.classList.add('location');

export default function Location() {
	const { data } = dataStore.value;
	const { name, country, region } = data.location;
	div.textContent = `${name}, ${region}, ${country}.`;

	return div;
}

import { $, UNITS } from "../utils";
import { dataStore } from "../utils/data_store";


const button_C = $('.btns__c', true);
const button_F = $('.btns__f', true);

function setUnit(new_value) {
	dataStore.update((curr) => {
		curr.unit = new_value;
		return curr;
	});
}

function selectUnit(e) {
	let dataset_unit = e.currentTarget.dataset.unit;

	if (dataset_unit === UNITS.c) button_F.classList.remove('active');
	else button_C.classList.remove('active');

	e.currentTarget.classList.add('active');

	if (dataStore.value.unit === dataset_unit) return;

	setUnit(dataset_unit);
	render();
}

export function ada

button_C.addEventListener('click', selectUnit);
button_F.addEventListener('click', selectUnit);
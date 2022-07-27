import { API } from '../api';
import { $, getInputValue } from '../utils';
import { ErrorSearch } from './DisplayError';
import { close, show } from './SubmitLoader';
import { render } from './render';
import { dataStore } from '../utils/data_store';
import { ToggleTemperature } from './TemperatureToggleButtons';

/**@type {HTMLFormElement} */
const form = $('#form-search');

/**@type {HTMLInputElement} */
const inputSearch = $('#form-input');

/**@type {HTMLElement} */
const autocomplete = document.createElement('section');

let debounce;

/**@param {Array} results */
function autocompleteList(results) {
	const listResolve = new Promise((res) => {
		if (debounce) {
			console.log('clearTimeout');
			clearTimeout(debounce);
			removeAutocomplete();
		}

		autocomplete.innerHTML = '';
		const list = results.map((item) => {
			const optionElement = document.createElement('button');
			optionElement.setAttribute('type', 'button');
			optionElement.setAttribute('data-value', item.name + ' ' + item.country);
			optionElement.classList.add('option');
			optionElement.textContent = `${item.name}, ${item.country}`;
			optionElement.addEventListener('click', () => {
				inputSearch.value = `${item.name}, ${item.country}`;
				removeAutocomplete();
			});
			return optionElement;
		});
		debounce = setTimeout(() => {
			list.forEach((button) => autocomplete.appendChild(button));
			res();
		}, 2000);
	});
	return listResolve;
}

function pushOrShowAutocomplete() {
	console.log('pushOrShowAutocomplete');
	window.addEventListener('click', clickOutside);
	if (autocomplete.classList.contains('hide')) {
		autocomplete.classList.remove('hide');
		return;
	}
	form.appendChild(autocomplete);
}

function removeAutocomplete() {
	console.log('removeAutocomplete');
	autocomplete.remove();
	window.removeEventListener('click', clickOutside);
}
function hideAutocomplete() {
	console.log('hideAutocomplete');
	autocomplete.classList.add('hide');
	window.removeEventListener('click', clickOutside);
}

/**@param {MouseEvent} e */
function clickOutside(e) {
	console.log('clickOutside');
	if (!form.contains(e.target)) {
		hideAutocomplete();
		window.removeEventListener('click', clickOutside);
		inputSearch.addEventListener('focus', () => {
			setTimeout(() => {
				inputSearch.addEventListener(
					'click',
					() => {
						pushOrShowAutocomplete();
					},
					{ once: true }
				);
			}, 200);
		});
	}

	// if (e.target.classList.contains('option')) {
	// 	inputSearch.value = e.target.dataset.value;
	// 	closeSuggestion();
	// 	window.removeEventListener('click', clickOutside);
	// }
}

/* function submitHandler(e) {
	// prevent page reload
	e.preventDefault();

	// if error elements exist, remove of the DOM
	const errorWrapper = document.getElementById('error');
	if (errorWrapper) errorWrapper.remove();

	if (timeoutId) clearTimeout(timeoutId);
	// hide main content of the DOM

	const input = e.target.country;
	const inputValue = getInputValue(input);
	input.blur();

	// get api results
	API.forecast({ q: inputValue, days: 3 })
		.then(handlerResponse)
		.catch(handlerError)
		.finally(() => {
			closeSuggestion();
		});
} */

function handlerResponse(response) {
	// store response globally
	dataStore.update((curr) => {
		curr.data = response;
		return curr;
	});

	render();

	// listener
	ToggleTemperature();
}
/* function handlerError(error) {
	//remove active listener to avoid memory leaks
	removeListenerToggleTemperature();

	console.warn(error.message);

	DisplayError();
} */
/* const openSuggestion = () => {
	section.classList.remove('hide');
	if (timeoutId) clearTimeout(timeoutId);
}; */
/* const closeSuggestion = () => {
	if (timeoutId) clearTimeout(timeoutId);
	section.classList.add('hide');
}; */

/* function clickOutside(e) {
	if (!section.contains(e.target)) {
		closeSuggestion();
		window.removeEventListener('click', clickOutside);
	}

	if (e.target.classList.contains('option')) {
		inputSearch.value = e.target.dataset.value;
		closeSuggestion();
		window.removeEventListener('click', clickOutside);
	}
} */

/* let timeoutId; */

/* function onInput() {
	if (timeoutId) clearTimeout(timeoutId);

	const value = getInputValue(inputSearch);
	if (value.length < 3) {
		closeSuggestion();
		return;
	}

	timeoutId = setTimeout(() => {
		submitText.style.visibility = 'hidden';
		loaderSubmit.classList.remove('hide');
		API.search({ q: value })
			.then((response) => {
				if (response.search.length < 1) {
					closeSuggestion();
					return;
				}

				section.innerHTML = '';
				response.search.forEach((option) => {
					const newOption = document.createElement('button');
					newOption.setAttribute('type', 'button');
					newOption.setAttribute(
						'data-value',
						option.name + ' ' + option.country
					);
					newOption.classList.add('option');
					newOption.textContent = `${option.name}, ${option.country}`;
					section.appendChild(newOption);
				});
				window.addEventListener('click', clickOutside);
			})
			.finally(() => {
				openSuggestion();
				loaderSubmit.classList.add('hide');
				submitText.style.visibility = 'visible';
			});
	}, 500);
} */

/**
 *  @param {SubmitEvent} e
 * 	@return {void}
 * */
function submitHandler(e) {
	e.preventDefault();
	ErrorSearch.remove();

	const value = getInputValue(inputSearch);
	if (!value) return;

	show();
	API.forecast({ q: value, days: 3 })
		.then(handlerResponse)
		.catch((error) => {
			ErrorSearch.render();
			console.log(error);
		})
		.finally(() => {
			close();
			console.log('finally onSubmit');
		});
}

/**
 *  @param {SubmitEvent} e
 * 	@return {void}
 * */
function onInput() {
	if (!inputSearch.validity.valid) return;

	const value = getInputValue(inputSearch);
	if (!value) return;

	show();
	API.search({ q: value })
		.then((response) => {
			console.log(response);
			if (response.search < 1) {
				if (debounce) clearTimeout(debounce);
				throw Error('empty results - ' + value);
			}
			autocompleteList(response.search)
				.then(() => {
					close();
					pushOrShowAutocomplete();
				})
				.catch(() => {
					console.log('abort');
				});
		})
		.catch((error) => {
			console.error(error);
			close();
		})
		.finally(() => {
			console.log('finally onInput');
		});
}

form.addEventListener('submit', submitHandler);
inputSearch.addEventListener('input', onInput);

const btnsTabs = document.querySelectorAll('#tabs button');
btnsTabs.forEach((tabItem) => {
	tabItem.addEventListener('click', (event) => {
		btnsTabs.forEach((x) => {
			x.classList.remove('active');
		});

		event.currentTarget.classList.add('active');
		const dataset_tab = event.currentTarget.dataset.tab;

		// set active tab
		dataStore.update((curr) => {
			curr.tab = dataset_tab;
			return curr;
		});

		render();
	});
});

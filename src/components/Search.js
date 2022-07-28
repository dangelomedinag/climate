import { API } from '../api';
import { $, getInputValue, UNITS } from '../utils';
import { ErrorSearch } from './DisplayError';
import { loadingEnd, loading } from './SubmitLoader';
import { render } from './render';
import { dataStore } from '../utils/data_store';
import { scrollToCurrentHourCard } from './cards-hours';
import { Loader } from './LoaderMain';

/**@type {HTMLFormElement} */
const form = $('#form-search');

/**@type {HTMLInputElement} */
const inputSearch = $('#form-input');

/**@type {HTMLInputElement} */
const buttonSubmit = $('#form-submit');

/**@type {HTMLElement} */
const autocomplete = document.createElement('section');

let debounce;

/**@param {Array} results */
function autocompleteList(results) {
	const listResolve = new Promise((res) => {
		if (debounce) {
			removeAutocomplete();
		}

		debounce = setTimeout(() => {
			autocomplete.innerHTML = '';
			const list = results.map((item) => {
				const optionElement = document.createElement('button');
				optionElement.setAttribute('type', 'button');
				optionElement.setAttribute(
					'data-value',
					item.name + ' ' + item.country
				);
				optionElement.classList.add('option');
				optionElement.textContent = `${item.name}, ${item.country}`;
				optionElement.addEventListener('click', () => {
					inputSearch.value = `${item.name}, ${item.country}`;
					removeAutocomplete();
				});
				return optionElement;
			});
			list.forEach((button) => autocomplete.appendChild(button));
			res();
		}, 800);
	});
	return listResolve;
}

function pushOrShowAutocomplete() {
	// console.log('pushOrShowAutocomplete');
	window.addEventListener('click', clickOutside);
	if (autocomplete.classList.contains('hide')) {
		autocomplete.classList.remove('hide');
		return;
	}
	form.appendChild(autocomplete);
}
function removeAutocomplete() {
	if (debounce) clearTimeout(debounce);
	// console.log('removeAutocomplete');
	autocomplete.remove();
	window.removeEventListener('click', clickOutside);
}
function hideAutocomplete() {
	// console.log('hideAutocomplete');
	autocomplete.classList.add('hide');
	window.removeEventListener('click', clickOutside);
}

/**@param {MouseEvent} e */
function clickOutside(e) {
	// console.log('clickOutside');
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
	const tabsButtons = $('[data-tab]');
	// console.log(tabsButtons);

	tabsButtons.forEach((button) => {
		button.addEventListener('click', (event) => {
			// console.log('click on tab');
			tabsButtons.forEach((element) => {
				element.classList.remove('active');
			});

			event.currentTarget.classList.add('active');
			const dataset_tab = event.currentTarget.dataset.tab;

			// set active tab
			dataStore.update((curr) => {
				curr.tab = dataset_tab;
				return curr;
			});
			render('hours');
			scrollToCurrentHourCard();
		});
	});

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
		render('information', 'hours', 'days');
	}

	button_C.addEventListener('click', selectUnit);
	button_F.addEventListener('click', selectUnit);

	// ToggleTemperature();
}
function handlerError(error) {
	ErrorSearch.render();
	console.error(error);
}
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
	console.log('submit');
	e.preventDefault();
	removeAutocomplete();
	ErrorSearch.remove();
	// hideAutocomplete();

	const value = getInputValue(inputSearch);
	if (!value) return;

	loading();
	Loader.loading();
	API.forecast({ q: value, days: 3 })
		.then(handlerResponse)
		.catch(handlerError)
		.finally(() => {
			loadingEnd();
			Loader.end();
			console.log('finally onSubmit');
		});
}

/**
 *  @param {SubmitEvent} e
 * 	@return {void}
 * */
function onInput() {
	buttonSubmit.querySelector('.submit_text').textContent = 'buscar';
	buttonSubmit.classList.remove('short');

	const value = getInputValue(inputSearch);
	if (!value) {
		console.log('vacio');
		inputSearch.value = '';
		buttonSubmit.classList.remove('short');
		return;
	}

	if (!inputSearch.validity.valid) {
		inputSearch.onblur = () => {
			if (inputSearch.validity.tooShort) {
				buttonSubmit.classList.add('short');
				buttonSubmit.querySelector('.submit_text').textContent =
					'mínimo 3 caracteres';
			}
		};

		loadingEnd();
		removeAutocomplete();

		return;
	}

	loading();
	API.search({ q: value })
		.then((response) => {
			// console.log(response);
			if (response.search < 1) {
				if (debounce) clearTimeout(debounce);
				throw Error('empty results - ' + value);
			}
			/* ver */
			console.log(response.search);
			console.log(value);
			console.log(
				[...response.search].some((l) => {
					l.name.toLowerCase().includes(value) ||
						l.country.toLowerCase().includes(value) ||
						l.region.toLowerCase().includes(value) ||
						l.url.toLowerCase().includes(value);
				})
			);
			/* ver */
			autocompleteList(response.search)
				.then(() => {
					loadingEnd();
					pushOrShowAutocomplete();
				})
				.catch((abort) => {
					console.log('abort', abort);
				});
		})
		.catch(() => {
			// console.error(error);
			loadingEnd();
		})
		.finally(() => {
			console.log('finally onInput');
		});
}

inputSearch.addEventListener('input', onInput);
form.addEventListener('submit', submitHandler);

// const btnsTabs = document.querySelectorAll('#tabs button');
// btnsTabs.forEach((tabItem) => {
// 	tabItem.addEventListener('click', (event) => {
// 		btnsTabs.forEach((x) => {
// 			x.classList.remove('active');
// 		});

// 		event.currentTarget.classList.add('active');
// 		const dataset_tab = event.currentTarget.dataset.tab;

// 		// set active tab
// 		dataStore.update((curr) => {
// 			curr.tab = dataset_tab;
// 			return curr;
// 		});

// 		render();
// 	});
// });

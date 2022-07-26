import { API } from '../api';
import { $, getInputValue } from '../utils';
import { close, show } from './SubmitLoader';

/**@type {HTMLFormElement} */
const form = $('#form-search');

/**@type {HTMLInputElement} */
const inputSearch = $('#form-input');

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

/* function handlerResponse(response) {
	// store response globally
	dataStore.update((curr) => {
		curr.data = response;
		return curr;
	});

	render();

	// listener
	ToggleTemperature();
} */
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

	const value = getInputValue(inputSearch.value);
	if (!value) return;

	show();
	API.forecast({ q: value })
		.then((response) => {
			console.log(response);
		})
		.catch((error) => {
			console.log(error);
		})
		.finally(() => {
			close();
			console.log('finally');
		});
}

form.addEventListener('submit', submitHandler);
// inputSearch.addEventListener('input', onInput);

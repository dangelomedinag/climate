import '../style.css';
import { API } from './api';
import { getInputValue } from './utils';
import { dataStore } from './utils/data_store';
import Information from './components/information';
import Location from './components/location';
import CardsDays from './components/cards-days';
import CardsHours from './components/cards-hours';

const btnScrollTop = document.getElementById('scrollToTop');

function themeDay() {
	const date = new Date(Date.now()).getHours();

	if (date < 8 || date > 17) document.body.classList.toggle('night');
	else document.body.classList.toggle('day');
}

themeDay();

const submitText = document.querySelector('.submit_text');
const loaderSubmit = document.querySelector('.loader.submit');
const loaderMain = document.querySelector('.loader-wrapper');
const section = document.querySelector('section');
const form = document.getElementById('form-search');
const inputSearch = document.getElementById('form-input');
const mainWrapper = document.getElementById('main');
const c_toggle = document.querySelector('.btns__c');
const f_toggle = document.querySelector('.btns__f');

const toggle = document.getElementById('toggle');
if (toggle) {
	toggle.addEventListener('click', () => {
		document.body.classList.toggle('night');
		document.body.classList.toggle('day');
	});
}

const tabsWrapper = document.getElementById('tabs');
const chartWrapper = document.getElementById('chart');

function setUnit(new_value) {
	dataStore.update((curr) => {
		curr.unit = new_value;
		return curr;
	});
}
function setThemeOfday() {
	document.body.classList.remove('day');
	document.body.classList.remove('night');

	if (dataStore.value.data.current.is_day) document.body.classList.add('day');
	else document.body.classList.add('night');
}
function selectUnit(e) {
	let dataset_unit = e.currentTarget.dataset.unit;

	if (dataset_unit === 'c') f_toggle.classList.remove('active');
	else c_toggle.classList.remove('active');

	e.currentTarget.classList.add('active');

	if (dataStore.value.unit === dataset_unit) return;

	setUnit(dataset_unit);
	render();
}

function render() {
	setThemeOfday();
	Location();
	Information();
	CardsHours();
	CardsDays();
	scrollToCurrentHourCard();
}
function scrollToCurrentHourCard() {
	const currentHour = new Date(Date.now()).getHours();
	const currentHourCard =
		chartWrapper.querySelectorAll('.chart__card')[currentHour];

	const act = chartWrapper.querySelector('.current_hour');
	if (act) {
		act.classList.remove('currnte_hour');
	}

	const width = chartWrapper.getBoundingClientRect().width;

	currentHourCard.classList.add('current_hour');
	currentHourCard.classList.add('shadow-smooth');

	// currentHourCard.scrollIntoView({
	// 	behavior: 'auto',
	// 	inline: 'end',
	// 	block: 'center',
	// });
	chartWrapper.scrollTo({
		behavior: 'smooth',
		left: currentHourCard.offsetLeft - width / 2 + 16 * 3,
	});
}
function submitHandler(e) {
	// prevent page reload
	e.preventDefault();

	// if error elements exist, remove of the DOM
	const errorWrapper = document.getElementById('error');
	if (errorWrapper) errorWrapper.remove();

	loaderMain.classList.remove('hide');
	if (timeoutId) clearTimeout(timeoutId);
	// hide main content of the DOM
	mainWrapper.classList.add('hide');

	const input = e.target.country;
	const inputValue = getInputValue(input);
	input.blur();

	// get api results
	API.forecast({ q: inputValue, days: 3 })
		.then(handlerResponse)
		.catch(handlerError)
		.finally(() => {
			closeSuggestion();
			loaderMain.classList.add('hide');
		});
}
function handlerResponse(response) {
	// store response globally
	dataStore.update((curr) => {
		curr.data = response;
		return curr;
	});

	// show DOM elements to hydrate
	mainWrapper.classList.remove('hide');

	render();

	// listener
	c_toggle.addEventListener('click', selectUnit);
	f_toggle.addEventListener('click', selectUnit);
}
function handlerError(error) {
	//remove active listener to avoid memory leaks
	c_toggle.removeEventListener('click', selectUnit);
	f_toggle.removeEventListener('click', selectUnit);

	console.warn(error.message);

	// if error elements exist, avoid re-render error
	const errorWrapper = document.getElementById('error');
	if (errorWrapper) return;

	const div = document.createElement('div');
	div.setAttribute('id', 'error');
	const el = document.createElement('img');
	const elText = document.createElement('h1');
	elText.textContent = 'Sin registros para tu busqueda.';
	el.setAttribute('src', '/zone-not-found.png');
	el.setAttribute('alt', 'personaje con rostro triste busqueda sin exito');
	el.setAttribute('loading', 'lazy');

	const appWrapper = document.getElementById('app');
	div.appendChild(elText);
	div.appendChild(el);

	appWrapper.appendChild(div);
}

const openSuggestion = () => {
	section.classList.remove('hide');
	if (timeoutId) clearTimeout(timeoutId);
};
const closeSuggestion = () => {
	if (timeoutId) clearTimeout(timeoutId);
	section.classList.add('hide');
};

function clickOutside(e) {
	if (!section.contains(e.target)) {
		closeSuggestion();
		window.removeEventListener('click', clickOutside);
	}

	if (e.target.classList.contains('option')) {
		inputSearch.value = e.target.dataset.value;
		closeSuggestion();
		window.removeEventListener('click', clickOutside);
	}
}

let timeoutId;

function onInput() {
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
}

inputSearch.addEventListener('input', onInput);
form.addEventListener('submit', submitHandler);
c_toggle.addEventListener('click', selectUnit);
f_toggle.addEventListener('click', selectUnit);

const btnsTabs = tabsWrapper.querySelectorAll('button');
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

btnScrollTop.addEventListener('click', () => {
	window.scrollTo({ behavior: 'smooth', top: 0 });
});

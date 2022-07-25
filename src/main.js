import { /* getData, */ API } from './api';
import {
	// getUrlForIcon,
	// getFormatDateTime,
	// getDayFromIndex,
	getInputValue,
	TABS,
	UNITS,
} from './utils';
import '../style.css';
import Information from './components/information';
import Location from './components/location';
import CardsDays from './components/cards-days';
import CardsHours from './components/cards-hours';

let unit = UNITS.c;

let tab = TABS.temp;
let selectedUnit = unit === UNITS.c;
let DATA;

const btnScrollTop = document.getElementById('scrollToTop');
btnScrollTop.addEventListener('click', () => {
	window.scrollTo({ behavior: 'smooth', top: 0 });
});

function themeDay() {
	const date = new Date(Date.now()).getHours();
	// console.log({ date });
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

// const infoImg = document.querySelector('.info__img');
// const infoTemp = document.querySelector('.info__temp');

// const dataPrec = document.querySelector('.data__prec');
// const dataHumedity = document.querySelector('.data__humedity');
// const dataWind = document.querySelector('.data__wind');

// const cityCity = document.querySelector('.city__city');
// const cityDay = document.querySelector('.city__day');
// const cityCond = document.querySelector('.city__cond');

// const daysWrapper = document.getElementById('days');
const tabsWrapper = document.getElementById('tabs');
const chartWrapper = document.getElementById('chart');

function setUnit(new_value) {
	unit = new_value;
	selectedUnit = unit === UNITS.c;
}
function setThemeOfday(is_day) {
	document.body.classList.remove('day');
	document.body.classList.remove('night');

	if (is_day) document.body.classList.add('day');
	else document.body.classList.add('night');
}
function selectUnit(e) {
	let dataset_unit = e.currentTarget.dataset.unit;

	if (dataset_unit === 'c') f_toggle.classList.remove('active');
	else c_toggle.classList.remove('active');

	e.currentTarget.classList.add('active');

	if (unit === dataset_unit) return;

	setUnit(dataset_unit);
	render();
}

function render() {
	// console.log(DATA);

	/** @type {{forecastday: Array, precip: number, humidity: number, wind: number, is_day: number, icon: string, code: number,text: string,temp: number,localtime: number,name: string} */
	const mapData = {
		temp: selectedUnit ? DATA.current.temp_c : DATA.current.temp_f,
		precip: DATA.current.precip_in,
		humidity: DATA.current.humidity,
		wind: DATA.current.wind_kph,
		is_day: DATA.current.is_day,
		text: DATA.current.condition.text,
		code: DATA.current.condition.code,
		icon: DATA.current.condition.icon,
		localtime: DATA.location.localtime,
		name: DATA.location.name,
		forecastday: DATA.forecast.forecastday.map((d) => {
			d.day.mintemp = selectedUnit ? d.day.mintemp_c : d.day.mintemp_f;
			d.day.maxtemp = selectedUnit ? d.day.maxtemp_c : d.day.maxtemp_f;
			return d;
		}),
	};
	// console.log(mapData);

	const { is_day } = mapData;

	setThemeOfday(is_day);
	Location(DATA.location);
	Information(mapData);
	CardsHours(DATA, tab, selectedUnit);
	CardsDays(DATA);

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
	DATA = response;

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
		tab = dataset_tab;
		render();
	});
});

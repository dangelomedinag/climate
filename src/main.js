import { /* getData, */ API } from './api';
import {
	getFormatDateTime,
	getInputValue,
	getDayFromIndex,
	TABS,
	UNITS,
} from './utils';
import '../style.css';

let unit = UNITS.c;
let tab = TABS.temp;
let selectedUnit = unit === UNITS.c;
let DATA;

const btnScrollTop = document.getElementById('scrollToTop');
btnScrollTop.addEventListener('click', () => {
	window.scrollTo({ behavior: 'smooth', top: 0 });
});

const submitText = document.querySelector('.submit_text');
const loaderSubmit = document.querySelector('.loader.submit');
const loaderMain = document.querySelector('.loader.main');
const section = document.querySelector('section');
const form = document.getElementById('form-search');
const inputSearch = document.getElementById('form-input');
const mainWrapper = document.getElementById('main');
const c_toggle = document.querySelector('.btns__c');
const f_toggle = document.querySelector('.btns__f');
const textLocation = document.querySelector('.location');

const toggle = document.getElementById('toggle');
if (toggle) {
	toggle.addEventListener('click', () => {
		document.body.classList.toggle('night');
		document.body.classList.toggle('day');
	});
}

const infoImg = document.querySelector('.info__img');
const infoTemp = document.querySelector('.info__temp');

const dataPrec = document.querySelector('.data__prec');
const dataHumedity = document.querySelector('.data__humedity');
const dataWind = document.querySelector('.data__wind');

const cityCity = document.querySelector('.city__city');
const cityDay = document.querySelector('.city__day');
const cityCond = document.querySelector('.city__cond');

const daysWrapper = document.getElementById('days');
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
function createHourCard(data_temp, temp, src, hours) {
	const cardElement = document.createElement('div');
	const tempElement = document.createElement('div');
	const imgElement = document.createElement('img');
	const hourElement = document.createElement('div');

	cardElement.classList.add('chart__card');
	cardElement.setAttribute('data-temp', data_temp);
	imgElement.classList.add('hour__img');
	imgElement.setAttribute('src', src);
	tempElement.classList.add('hour__temp');
	tempElement.textContent = `${temp.data}${temp.unit}`;

	hourElement.classList.add('hour');
	hourElement.textContent = hours;

	cardElement.appendChild(tempElement);
	cardElement.appendChild(imgElement);
	cardElement.appendChild(hourElement);

	chartWrapper.appendChild(cardElement);

	return {
		card: cardElement,
		temp: tempElement,
		img: imgElement,
		hour: hourElement,
	};
}
function createCardDay(day, date, nextDate, activeDay) {
	const { condition, maxtemp_c, mintemp_c, maxtemp_f, mintemp_f } = day;
	const tokenMax = selectedUnit ? maxtemp_c : maxtemp_f;
	const tokenMin = selectedUnit ? mintemp_c : mintemp_f;

	const cardDay = document.querySelector(`[data-dateid="${date}"]`);
	if (cardDay) {
		const eleDay = cardDay.querySelector('.days__day');
		const eleImg = cardDay.querySelector('.days__img');
		const eleMax = cardDay.querySelector('.days__max');
		const eleMin = cardDay.querySelector('.days__min');

		eleDay.textContent = getDayFromIndex(nextDate.getDay());
		eleImg.setAttribute(
			'src',
			condition.code == 1000 ? `/${condition.code}.png` : condition.icon
		);
		eleImg.setAttribute('alt', `representacion visual - ${condition.text}`);
		eleImg.setAttribute('loading', 'lazy');

		eleMax.textContent = `${tokenMax}°.`;
		eleMin.textContent = `${tokenMin}°.`;

		return;
	}

	const eleDiv = document.createElement('div');
	const div = document.createElement('div');
	const img = document.createElement('img');
	const div2 = document.createElement('div');
	const max = document.createElement('span');
	const min = document.createElement('span');

	eleDiv.setAttribute('data-dateid', date);
	eleDiv.classList.add('days__card');
	if (activeDay) eleDiv.classList.add('active');

	div.textContent = getDayFromIndex(nextDate.getDay());
	div.classList.add('days__day');

	img.setAttribute(
		'src',
		condition.code == 1000 ? `/${condition.code}.png` : condition.icon
	);
	img.setAttribute('alt', `representacion visual - ${condition.text}`);
	img.setAttribute('loading', 'lazy');
	img.classList.add('days__img');

	max.textContent = `${tokenMax}°.`;
	max.classList.add('days__max');

	min.textContent = `${tokenMin}°.`;
	min.classList.add('days__min');

	div2.classList.add('days__temp');
	div2.appendChild(max);
	div2.appendChild(min);

	eleDiv.appendChild(div);
	eleDiv.appendChild(img);
	eleDiv.appendChild(div2);

	daysWrapper.appendChild(eleDiv);
}
function render() {
	const {
		forecastday,
		precip,
		humidity,
		wind,
		is_day,
		icon,
		code,
		text,
		temp,
		localtime,
		name,
	} = {
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
		forecastday: DATA.forecast.forecastday,
	};

	const currentDate = new Date(localtime);

	setThemeOfday(is_day);

	textLocation.textContent = `${DATA.location.name}, ${DATA.location.region}, ${DATA.location.country}.`;
	console.log(code);
	infoImg.setAttribute('src', code == 1000 ? `/${code}.png` : icon);
	infoImg.setAttribute('loading', 'lazy');
	infoTemp.textContent = temp;
	dataPrec.textContent = Math.round(precip);
	dataHumedity.textContent = humidity;
	dataWind.textContent = wind;

	cityCity.textContent = name;

	cityDay.textContent = getDayFromIndex(currentDate.getDay());
	cityCond.textContent = text;

	chartWrapper.innerHTML = '';

	forecastday.forEach(({ day, date, hour }) => {
		const nextDate = new Date(date);
		const activeDay = currentDate.getDate() == nextDate.getDate();

		if (activeDay) {
			const configPerItem = hour.map(
				({ time, temp_c, temp_f, condition, precip_in, wind_kph }) => {
					const formatHour = getFormatDateTime(time);
					let config = {
						hours: formatHour,
						src: condition.code == 1000 ? `/${code}.png` : condition.icon,
					};

					switch (tab) {
						case TABS.temp:
							{
								const token = selectedUnit ? temp_c : temp_f;
								config.temp = { data: token, unit: '°' };
							}
							break;
						case TABS.prec:
							{
								config.temp = { data: precip_in, unit: '%' };
							}
							break;
						case TABS.wind:
							{
								config.temp = { data: wind_kph, unit: 'km/h' };
								config.src = '/arrow-up.svg';
							}
							break;
					}
					return [config.temp, config.src, config.hours];
				}
			);

			hour.forEach((_, i) => {
				const elements = createHourCard(i, ...configPerItem[i]);

				if (tab === TABS.wind) {
					elements.img.style.transformOrigin = '25px 25px;';
					elements.img.style.transform = `rotate(${_.wind_degree}deg)`;
				}
			});
		}

		createCardDay(day, date, nextDate, activeDay);
	});

	scrollToCurrentHourCard();
}
function scrollToCurrentHourCard() {
	const currentHour = new Date(Date.now()).getHours();
	const currentHourCard =
		chartWrapper.querySelectorAll('.chart__card')[currentHour - 1];

	chartWrapper.scrollTo({
		left: currentHourCard.offsetLeft,
		behavior: 'smooth',
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

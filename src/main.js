import { getData } from './api';
import { getDayFromIndex, TABS, UNITS } from './utils';
import '../style.css';

let unit = UNITS.c;
let tab = TABS.temp;
let DATA;

const form = document.getElementById('form-country');
const mainWrapper = document.getElementById('main');
const c_toggle = document.querySelector('.btns__c');
const f_toggle = document.querySelector('.btns__f');
const textLocation = document.querySelector('.location');

const toggle = document.getElementById('toggle');
toggle.addEventListener('click', () => {
	document.body.classList.toggle('night');
	document.body.classList.toggle('day');
});

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

async function render() {
	console.log(DATA);
	let info = {
		temp: unit === 'c' ? DATA.current.temp_c : DATA.current.temp_f,
		precip: DATA.current.precip_in,
		humidity: DATA.current.humidity,
		wind: DATA.current.wind_kph,
		is_day: DATA.current.is_day,
		text: DATA.current.condition.text,
		icon: DATA.current.condition.icon,
		localtime: DATA.location.localtime,
		name: DATA.location.name,
	};

	const { precip, humidity, wind, is_day, icon, text, temp, localtime, name } =
		info;

	if (is_day) {
		document.body.classList.add('day');
	} else {
		document.body.classList.add('night');
	}

	textLocation.textContent = `${DATA.location.name}, ${DATA.location.region}, ${DATA.location.country}.`;

	infoImg.setAttribute('src', icon);
	infoImg.setAttribute('loading', 'lazy');
	infoTemp.textContent = temp;
	dataPrec.textContent = Math.round(precip);
	dataHumedity.textContent = humidity;
	dataWind.textContent = wind;

	cityCity.textContent = name;
	const currentDate = new Date(localtime);

	cityDay.textContent = getDayFromIndex(currentDate.getDay());
	cityCond.textContent = text;

	chartWrapper.innerHTML = '';
	daysWrapper.innerHTML = '';

	// const selectedForecast = DATA.forecast.forecastday.filter((f) => {
	// 	const newDate = new Date(f.date).getDate();
	// 	console.log(f.date);
	// 	console.log(newDate + 1);

	// 	return currentDate.getDate() == newDate + 1;
	// });

	// console.log(selectedForecast);

	DATA.forecast.forecastday.forEach(({ day, date, hour }) => {
		const nextDate = new Date(date);
		const activeDay = currentDate.getDate() == nextDate.getDate();

		function createCard(data_temp, temp, src, hours) {
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
		if (activeDay) {
			if (tab === 'temp') {
				hour.forEach((h, i) => {
					let obj = {
						temp: {
							data: unit === 'c' ? h.temp_c : h.temp_f,
							unit: '°',
						},
						src: h.condition.icon,
						hours:
							String(i + 1).length > 1 ? i + 1 + ':00' : '0' + (i + 1) + ':00',
					};

					createCard(i, obj.temp, obj.src, obj.hours);
				});
			} else if (tab === 'precip') {
				hour.forEach((h, i) => {
					let obj = {
						temp: {
							data: h.precip_in,
							unit: '%',
						},
						src: h.condition.icon,
						hours:
							String(i + 1).length > 1 ? i + 1 + ':00' : '0' + (i + 1) + ':00',
					};
					createCard(i, obj.temp, obj.src, obj.hours);
				});
			} else {
				hour.forEach((h, i) => {
					let obj = {
						temp: {
							data: h.wind_kph,
							unit: ' km/h',
						},
						src: '/arrow-up.svg',
						hours:
							String(i + 1).length > 1 ? i + 1 + ':00' : '0' + (i + 1) + ':00',
					};
					const img = createCard(i, obj.temp, obj.src, obj.hours).img;
					img.style.transformOrigin = '25px 25px;';
					img.style.transform = `rotate(${h.wind_degree}deg)`;
				});
			}

			const currentHour = new Date(Date.now()).getHours();
			const currentHourCard =
				chartWrapper.querySelectorAll('.chart__card')[currentHour - 1];

			currentHourCard.scrollIntoView({ behavior: 'smooth', inline: 'start' });
		}

		const { condition, maxtemp_c, mintemp_c, maxtemp_f, mintemp_f } = day;

		daysWrapper.innerHTML += `
			<button data-dateid=${date} ${activeDay ? 'class="active"' : ''}>
				<div class="days__day">${getDayFromIndex(nextDate.getDay())}</div>
				<img class="days__img" src="${condition.icon}" alt="" />
				<div class="days__temp">
					<span class="days__max">${unit === 'c' ? maxtemp_c : maxtemp_f}°.</span>
					<span class="days__min">${unit === 'c' ? mintemp_c : mintemp_f}°.</span>
				</div>
			</button>
			`;
	});
}

function selectTab(e) {
	let dataset_unit = e.currentTarget.dataset.unit;

	if (dataset_unit === 'c') f_toggle.classList.remove('active');
	else c_toggle.classList.remove('active');

	e.currentTarget.classList.add('active');

	if (unit === dataset_unit) return;

	unit = dataset_unit;
	render();
}

form.addEventListener('submit', (e) => {
	e.preventDefault();

	e.target.country.blur();
	const q = e.target.country.value;

	getData({ q })
		.then((response) => {
			const errorWrapper = document.getElementById('error');
			if (errorWrapper) {
				errorWrapper.remove();
			}
			DATA = response;
			mainWrapper.classList.remove('hide');
			render();
		})
		.catch((error) => {
			const div = document.createElement('div');
			div.setAttribute('id', 'error');
			const el = document.createElement('img');
			const elText = document.createElement('h1');
			elText.textContent = 'Sin registros para tu busqueda.';
			el.setAttribute('src', '/zone-not-found.png');
			el.style.opacity = '0.2';
			el.style.display = 'block';
			el.style.minWidth = '0';
			el.style.maxWidth = '500px';
			el.style.width = '100%';
			el.style.padding = '1em';
			const appWrapper = document.getElementById('app');
			div.appendChild(elText);
			div.appendChild(el);
			appWrapper.appendChild(div);
			console.error('error handler', error);
		});
});

c_toggle.addEventListener('click', selectTab);
f_toggle.addEventListener('click', selectTab);

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

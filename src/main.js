import { getData } from './api';
import { getDayFromIndex } from './utils';
import Icon from '../public/arrow-up.svg';
import '../style.css';

const form = document.getElementById('form-country');
const mainWrapper = document.getElementById('main');
const c_toggle = document.querySelector('.btns__c');
const f_toggle = document.querySelector('.btns__f');

// const toggle = document.getElementById('toggle');
// toggle.addEventListener('click', () => {
// 	document.body.classList.toggle('night');
// 	document.body.classList.toggle('day');
// });

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

async function render(data) {
	console.log(data);

	let info = {
		temp: unit === 'c' ? data.current.temp_c : data.current.temp_f,
		precip: data.current.precip_in,
		humidity: data.current.humidity,
		wind: data.current.wind_kph,
		is_day: data.current.is_day,
		text: data.current.condition.text,
		icon: data.current.condition.icon,
		localtime: data.location.localtime,
		name: data.location.name,
	};
	// console.log(data.forecast.forecastday);
	const { precip, humidity, wind, is_day, icon, text, temp, localtime, name } =
		info;

	if (is_day) {
		document.body.classList.add('day');
	} else {
		document.body.classList.add('night');
	}

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

	data.forecast.forecastday.forEach(({ day, date, hour }) => {
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
					// chartWrapper.innerHTML += `
					// <div class="chart__card" data-temp="${i}">
					// 		<div class="hour__temp">${unit === 'c' ? h.temp_c : h.temp_f}°</div>

					// 		<img class="hour__img" src="${h.condition.icon}" />
					// 		<div class="hour">${
					// 			String(i + 1).length > 1 ? i + 1 + ':00' : '0' + (i + 1) + ':00'
					// 		}</div>
					// 	</div>
					// `;
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
					// chartWrapper.innerHTML += `
					// <div class="chart__card" data-temp="${i}">
					// 		<div class="hour__temp">${h.precip_in}%</div>

					// 		<img class="hour__img" src="${h.condition.icon}" />
					// 		<div class="hour">${
					// 			String(i + 1).length > 1 ? i + 1 + ':00' : '0' + (i + 1) + ':00'
					// 		}</div>
					// 	</div>
					// `;
				});
			} else {
				hour.forEach((h, i) => {
					let obj = {
						temp: {
							data: h.wind_kph,
							unit: ' km/h',
						},
						src: Icon,
						hours:
							String(i + 1).length > 1 ? i + 1 + ':00' : '0' + (i + 1) + ':00',
					};
					const img = createCard(i, obj.temp, obj.src, obj.hours).img;
					img.style.transformOrigin = '25px 25px;';
					img.style.transform = `rotate(${h.wind_degree}deg)`;
					// chartWrapper.innerHTML += `
					// <div class="chart__card" data-temp="${i}">
					// 		<div class="hour__temp">${h.wind_kph} km/h.</div>

					// 		<img src="${Icon}" class="hour__img" style="transform-origin: 25px 25px; transform: rotate(${
					// 	h.wind_degree
					// }deg);" />

					// 		<div class="hour">${
					// 			String(i + 1).length > 1 ? i + 1 + ':00' : '0' + (i + 1) + ':00'
					// 		}</div>
					// 	</div>
					// `;
				});
			}

			const currentHour = new Date(Date.now()).getHours();
			// console.log(chartWrapper.childNodes);
			const currentHourCard =
				chartWrapper.querySelectorAll('.chart__card')[currentHour - 1];

			// console.log(currentHourCard);

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

let unit = 'c';
let tab = 'temp';

form.addEventListener('submit', (e) => {
	e.preventDefault();

	e.target.country.blur();
	const q = e.target.country.value;

	getData({ q }).then((response) => {
		mainWrapper.classList.remove('hide');
		render(response);

		c_toggle.addEventListener('click', (e) => {
			if (unit === e.currentTarget.dataset.unit) return;

			f_toggle.classList.remove('active');
			e.currentTarget.classList.add('active');

			unit = 'c';
			render(response);
		});

		f_toggle.addEventListener('click', (e) => {
			if (unit === e.currentTarget.dataset.unit) return;
			c_toggle.classList.remove('active');
			e.currentTarget.classList.add('active');

			unit = 'f';
			render(response);
		});

		const btnsTabs = tabsWrapper.querySelectorAll('button');

		btnsTabs.forEach((ele) => {
			ele.addEventListener('click', (event) => {
				btnsTabs.forEach((x) => {
					x.classList.remove('active');
				});
				event.currentTarget.classList.add('active');
				const tabSelected = event.currentTarget.dataset.tab;
				tab = tabSelected;
				render(response);
			});
		});

		const btnsDays = daysWrapper.querySelectorAll('button');

		btnsDays.forEach((ele) => {
			ele.addEventListener('click', (e) => {
				btnsDays.forEach((x) => {
					x.classList.remove('active');
				});
				console.log('click on card', ele.dataset.dateid);
				e.currentTarget.classList.add('active');
			});
		});
	});
});

/* getData({ q: 'quebec' }).then((e) => {
	render(e);

	c_toggle.addEventListener('click', (event) => {
		f_toggle.classList.toggle('active');
		event.target.classList.toggle('active');
		unit = 'c';
		render(e);
	});

	f_toggle.addEventListener('click', (event) => {
		c_toggle.classList.toggle('active');
		event.target.classList.toggle('active');
		unit = 'f';
		render(e);
	});

	const btnsTabs = tabsWrapper.querySelectorAll('button');

	btnsTabs.forEach((ele) => {
		ele.addEventListener('click', (event) => {
			btnsTabs.forEach((x) => {
				x.classList.remove('active');
			});
			event.currentTarget.classList.add('active');
			const tabSelected = event.currentTarget.dataset.tab;
			tab = tabSelected;
			render(e);
		});
	});

	const btnsDays = daysWrapper.querySelectorAll('button');

	btnsDays.forEach((ele) => {
		ele.addEventListener('click', (e) => {
			btnsDays.forEach((x) => {
				x.classList.remove('active');
			});
			console.log('click on card', ele.dataset.dateid);
			e.currentTarget.classList.add('active');
		});
	});
}); */

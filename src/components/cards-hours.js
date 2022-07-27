import { getFormatDateTime, getUrlForIcon, TABS, UNITS } from '../utils';
import { dataStore } from '../utils/data_store';

/**@type {HTMLElement} */
const chart = document.createElement('div');
chart.setAttribute('id', 'chart');

function createCard(data_temp, temp, src, hours) {
	if (chart.children.length >= 24) {
		const { tab } = dataStore.value;
		const cards = chart.querySelector(`[data-temp="${data_temp}"]`);

		const hourtempdiv = cards.querySelector('.hour__temp');
		hourtempdiv.textContent = `${temp.data}${temp.unit}`;
		const hourimg = cards.querySelector('.hour__img');
		hourimg.setAttribute('src', src);

		if (tab !== TABS.wind) {
			hourimg.style.transformOrigin = 'center';
			hourimg.style.transform = 'rotate(0deg)';
		}

		const hourdiv = cards.querySelector('.hour');
		hourdiv.textContent = hours;

		return {
			card: cards,
			temp: hourtempdiv,
			img: hourimg,
			hour: hourdiv,
		};
	}

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

	chart.appendChild(cardElement);

	return {
		card: cardElement,
		temp: tempElement,
		img: imgElement,
		hour: hourElement,
	};
}

export default function CardsHours() {
	const { data, unit, tab } = dataStore.value;
	const selectedUnit = unit === UNITS.c;
	const currentDate = new Date(Date.now());

	data.forecast.forecastday.forEach(({ date, hour }) => {
		const nextDate = new Date(date);
		const activeDay = currentDate.getDate() == nextDate.getDate();

		if (activeDay) {
			const configPerItem = hour.map(
				({ time, temp_c, temp_f, condition, precip_in, wind_kph }) => {
					const formatHour = getFormatDateTime(time);
					let config = {
						tab: tab,
						hours: formatHour,
						src: getUrlForIcon(condition.icon),
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
					return [config.temp, config.src, config.hours, config.tab];
				}
			);

			hour.forEach((_, i) => {
				const elements = createCard(i, ...configPerItem[i]);

				if (tab === TABS.wind) {
					elements.img.style.transformOrigin = '25px 25px;';
					elements.img.style.transform = `rotate(${_.wind_degree}deg)`;
				}
			});
		}
	});

	return chart;
}

export function scrollToCurrentHourCard() {
	const currentHour = new Date(Date.now()).getHours();
	const currentHourCard = chart.querySelectorAll('.chart__card')[currentHour];

	const act = chart.querySelector('.current_hour');
	if (act) {
		act.classList.remove('currnte_hour');
	}

	const width = chart.getBoundingClientRect().width;
	const emUnit = 16;

	currentHourCard.classList.add('current_hour');
	currentHourCard.classList.add('shadow-smooth');

	chart.scrollTo({
		behavior: 'smooth',
		left: currentHourCard.offsetLeft - width / 2 + emUnit * 3,
	});
}

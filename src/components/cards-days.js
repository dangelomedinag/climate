import { getDayFromIndex, getUrlForIcon } from '../utils';

const daysWrapper = document.getElementById('days');

let cards = [];

function createCard(day, date, nextDate, activeDay) {
	const { condition, maxtemp, mintemp } = day;

	// if(cards.filter(c=>date === c)[0]) {
	// 	const eleDay = cardDay.querySelector('.days__day');
	// 	const eleImg = cardDay.querySelector('.days__img');
	// 	const eleMax = cardDay.querySelector('.days__max');
	// 	const eleMin = cardDay.querySelector('.days__min');

	// 	eleDay.textContent = getDayFromIndex(nextDate.getDay());
	// 	eleImg.setAttribute('src', getUrlForIcon(condition.icon));
	// 	eleImg.setAttribute('alt', `representacion visual - ${condition.text}`);
	// 	eleImg.setAttribute('loading', 'lazy');

	// 	eleMax.textContent = `${maxtemp}°.`;
	// 	eleMin.textContent = `${mintemp}°.`;

	// 	return;

	// }
	console.log(cards.filter((c) => date === c.dataset.dateid)[0]);
	const cardDay = document.querySelector(`[data-dateid="${date}"]`);
	if (cardDay) {
		const eleDay = cardDay.querySelector('.days__day');
		const eleImg = cardDay.querySelector('.days__img');
		const eleMax = cardDay.querySelector('.days__max');
		const eleMin = cardDay.querySelector('.days__min');

		eleDay.textContent = getDayFromIndex(nextDate.getDay());
		eleImg.setAttribute('src', getUrlForIcon(condition.icon));
		eleImg.setAttribute('alt', `representacion visual - ${condition.text}`);
		eleImg.setAttribute('loading', 'lazy');

		eleMax.textContent = `${maxtemp}°.`;
		eleMin.textContent = `${mintemp}°.`;

		return;
	}

	const cardContainer = document.createElement('div');
	const temperature = document.createElement('div');
	const img = document.createElement('img');
	const maxminContainer = document.createElement('div');
	const max = document.createElement('span');
	const min = document.createElement('span');

	cardContainer.setAttribute('data-dateid', date);
	cardContainer.classList.add('days__card');
	if (activeDay) cardContainer.classList.add('active');

	temperature.textContent = getDayFromIndex(nextDate.getDay());
	temperature.classList.add('days__day');

	img.setAttribute('src', getUrlForIcon(condition.icon));
	img.setAttribute('alt', `representacion visual - ${condition.text}`);
	img.setAttribute('loading', 'lazy');
	img.classList.add('days__img');

	max.textContent = `${maxtemp}°.`;
	max.classList.add('days__max');

	min.textContent = `${mintemp}°.`;
	min.classList.add('days__min');

	maxminContainer.classList.add('days__temp');
	maxminContainer.appendChild(max);
	maxminContainer.appendChild(min);

	cardContainer.appendChild(temperature);
	cardContainer.appendChild(img);
	cardContainer.appendChild(maxminContainer);

	daysWrapper.appendChild(cardContainer);
	cards.push(cardContainer);
}

export default function CardsDays(data) {
	data.forecast.forecastday.forEach(({ day, date }) => {
		const currentDate = new Date(Date.now());
		const nextDate = new Date(date);
		const activeDay = currentDate.getDate() == nextDate.getDate();

		createCard(day, date, nextDate, activeDay);
	});
}

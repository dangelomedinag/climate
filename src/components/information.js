import { getDayFromIndex, getUrlForIcon } from '../utils';

const infoImg = document.querySelector('.info__img');
const infoTemp = document.querySelector('.info__temp');
const dataPrec = document.querySelector('.data__prec');
const dataHumedity = document.querySelector('.data__humedity');
const dataWind = document.querySelector('.data__wind');
const cityCity = document.querySelector('.city__city');
const cityDay = document.querySelector('.city__day');
const cityCond = document.querySelector('.city__cond');

export default function Information({
	icon,
	temp,
	precip,
	humidity,
	wind,
	name,
	text,
}) {
	const date = new Date(Date.now());

	infoImg.setAttribute('src', getUrlForIcon(icon));
	infoImg.setAttribute('loading', 'lazy');
	infoTemp.textContent = `${temp.toFixed(1)}°`;
	dataPrec.textContent = Math.round(precip);
	dataHumedity.textContent = humidity;
	dataWind.textContent = wind;

	cityCity.textContent = name;

	cityDay.textContent = getDayFromIndex(date.getDay());
	cityCond.textContent = text;
}

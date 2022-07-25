import { $, getDayFromIndex, getUrlForIcon, UNITS } from '../utils';
import { dataStore } from '../utils/data_store';

const infoImg = $('.info__img');
const infoTemp = $('.info__temp');
const dataPrec = $('.data__prec');
const dataHumedity = $('.data__humedity');
const dataWind = $('.data__wind');
const cityCity = $('.city__city');
const cityDay = $('.city__day');
const cityCond = $('.city__cond');

export default function Information() {
	const { unit, data } = dataStore.value;
	const { temp_c, temp_f, precip_in, humidity, wind_kph, condition } =
		data.current;
	const temp = unit === UNITS.c ? temp_c : temp_f;
	const date = new Date(Date.now());

	infoImg.setAttribute('src', getUrlForIcon(condition.icon));
	infoImg.setAttribute('loading', 'lazy');
	infoTemp.textContent = `${temp.toFixed(1)}°`;
	dataPrec.textContent = Math.round(precip_in);
	dataHumedity.textContent = humidity;
	dataWind.textContent = wind_kph;

	cityCity.textContent = data.location.name;

	cityDay.textContent = getDayFromIndex(date.getDay());
	cityCond.textContent = condition.text;
}

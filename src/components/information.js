import { getDayFromIndex, getUrlForIcon, UNITS } from '../utils';
import { dataStore } from '../utils/data_store';

let template = `
<div class="wrapper_img">
	<img
		src=""
		class="info__img"
		alt="representacion visual de condicon climatica"
		loading="lazy"
	/>
	<div>
		<h2 class="info__temp"></h2>
		<div class="info__btns">
			<button data-unit="c" class="btns btns__c active">°c</button>
			<button data-unit="f" class="btns btns__f">°f</button>
		</div>
	</div>
</div>
<div class="container">
	<div class="wrapper_data">
		<p class="data__p">
			Prob. de precipitaciones: <span class="data__prec"></span>%.
		</p>
		<p class="data__p">
			Humedad: <span class="data__humedity"></span>%.
		</p>
		<p class="data__p">
			Viento: a <span class="data__wind"></span> km/h.
		</p>
	</div>
	<div class="wrapper_city">
		<h2 class="info__p city__city"></h2>
		<p class="info__p city__day"></p>
		<p class="info__p city__cond"></p>
	</div>
</div>`;

/**@type {HTMLElement} */
const div = document.createElement('div');
div.setAttribute('id', 'info');

div.innerHTML = template;

export default function Information() {
	const infoImg = div.querySelector('.info__img');
	const infoTemp = div.querySelector('.info__temp');
	const dataPrec = div.querySelector('.data__prec');
	const dataHumedity = div.querySelector('.data__humedity');
	const dataWind = div.querySelector('.data__wind');
	const cityCity = div.querySelector('.city__city');
	const cityDay = div.querySelector('.city__day');
	const cityCond = div.querySelector('.city__cond');

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

	return div;
}

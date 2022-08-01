import { $ } from '../utils';
import { setThemeOfday } from '.';
import CardsDays from './cards-days';
import CardsHours, { scrollToCurrentHourCard } from './cards-hours';
import Information from './information';
import Location from './location';
import ScrollTop from './buttonToTop';
import { Tabs } from './Tabs';

/**@type {HTMLElement} */
const app = $('#app');

/**@type {HTMLElement} */
const mainWrapper = document.createElement('main');
mainWrapper.setAttribute('id', 'main');

const Map = [
	['location', Location],
	['information', Information],
	['tabs', Tabs],
	['hours', CardsHours],
	['days', CardsDays],
];

export function render(...dependencies) {
	if (dependencies.length > 0) {
		Map.forEach(([key, fn]) => {
			const currDep = dependencies.filter((dep) => dep === key);
			if (currDep[0]) {
				/**@type {HTMLElement} */
				const element = fn();
				const childrens = Array.from(element.children);

				element.innerHTML = '';
				childrens.forEach((el) => {
					element.appendChild(el);
				});
			}
		});
		return;
	}

	mainWrapper.innerHTML = '';

	setThemeOfday();
	mainWrapper.appendChild(Location());
	mainWrapper.appendChild(Information());
	mainWrapper.appendChild(Tabs());
	mainWrapper.appendChild(CardsHours());
	mainWrapper.appendChild(CardsDays());
	mainWrapper.appendChild(ScrollTop());

	app.appendChild(mainWrapper);
	scrollToCurrentHourCard();
}

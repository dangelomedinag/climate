import { setThemeOfday } from '.';
import { $ } from '../utils';
import CardsDays from './cards-days';
import CardsHours from './cards-hours';
import Information from './information';
import Location from './location';
/**@type {HTMLElement} */
const mainWrapper = $('#main');

export function render() {
	mainWrapper.classList.remove('hide');
	setThemeOfday();
	Location();
	Information();
	CardsHours();
	CardsDays();
}

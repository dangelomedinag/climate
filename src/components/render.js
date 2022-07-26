import { setThemeOfday } from '.';
import CardsDays from './cards-days';
import CardsHours from './cards-hours';
import Information from './information';
import Location from './location';

export function render() {
	setThemeOfday();
	Location();
	Information();
	CardsHours();
	CardsDays();
}

import { TABS, UNITS } from '.';
import { store } from '../store';

const createStore = new store({
	data: undefined,
	tab: TABS.temp,
	unit: UNITS.c,
});

export const dataStore = createStore;

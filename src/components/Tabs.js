import { TABS } from '../utils';
// import { dataStore } from '../utils/data_store';
// import { render } from './render';

{
	/* <div class="shadow-smooth" id="tabs">
	<button data-tab="temp" class="active">Temperatura</button>
	<button data-tab="precip">Precipitaciones</button>
	<button data-tab="wind">Viento</button>
</div> */
}

/** @type {HTMLElement} */
const tabs = document.createElement('div');
tabs.setAttribute('id', 'tabs');

/* const temperature = document.createElement("button")
tabs.setAttribute("data-tab", TABS.temp)

const precipitations = document.createElement("button")
tabs.setAttribute("data-tab", TABS.prec)

const wind = document.createElement("button")
tabs.setAttribute("data-tab", TABS.wind)

tabs.appendChild(temperature)
tabs.appendChild(precipitations)
tabs.appendChild(wind) */

Object.values(TABS).forEach((tab) => {
	/** @type {HTMLElement} */
	const item = document.createElement('button');
	item.setAttribute('data-tab', tab);

	function getLabel(tab) {
		switch (tab) {
			case TABS.temp: {
				item.classList.add('active');
				return 'temperatura';
			}
			case TABS.prec:
				return 'precipitaciones';
			case TABS.wind:
				return 'viento';
		}
	}

	item.textContent = getLabel(tab);

	/* item.addEventListener('click', (event) => {
		tabs.childNodes.forEach((element) => {
			element.classList.remove('active');
		});

		event.currentTarget.classList.add('active');
		const dataset_tab = event.currentTarget.dataset.tab;
		console.log(dataset_tab);

		// set active tab
		dataStore.update((curr) => {
			curr.tab = dataset_tab;
			return curr;
		});

	}); */

	tabs.appendChild(item);
});

export function Tabs() {
	return tabs;
}

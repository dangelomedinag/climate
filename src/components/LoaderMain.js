import { $ } from '../utils';

/**@type {HTMLElement} */
const app = $('#app');

/**@type {HTMLElement} */
const div = document.createElement('div');
div.classList.add('loader-wrapper');

/**@type {HTMLElement} */
const loader = document.createElement('div');
loader.classList.add('loader');
loader.classList.add('main');
loader.textContent = 'Loading...';

div.append(loader);

function loading() {
	const main = $('main');
	if (main) {
		main.before(div);
		return;
	}
	app.appendChild(div);
}

function normal() {
	div.remove();
}

export const Loader = {
	loading,
	end: normal,
};

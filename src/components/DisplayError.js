import { $ } from '../utils';

/**@type {HTMLElement} */
const appWrapper = $('#app');

/**@type {HTMLElement} */
const mainWrapper = $('#main');

const divError = document.createElement('div');
const image = document.createElement('img');
const title = document.createElement('h1');

divError.setAttribute('id', 'error');
title.textContent = 'Sin registros para tu busqueda.';
image.setAttribute('src', '/zone-not-found.png');
image.setAttribute('alt', 'personaje con rostro triste busqueda sin exito');
image.setAttribute('loading', 'lazy');

function displayError() {
	mainWrapper.classList.add('hide');

	// if error elements exist, avoid re-render error
	const errorWrapper = $('#error');
	if (errorWrapper) return;

	divError.appendChild(title);
	divError.appendChild(image);

	appWrapper.appendChild(divError);
}

function removeError() {
	const errorWrapper = $('#error');
	if (errorWrapper) {
		errorWrapper.remove();
	}
}

export const ErrorSearch = {
	render: () => displayError(),
	remove: () => removeError(),
};

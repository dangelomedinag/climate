import { $ } from '../utils';

export function DisplayError() {
	// if error elements exist, avoid re-render error
	const errorWrapper = $('#error');
	if (errorWrapper) return;

	const divError = document.createElement('div');
	const image = document.createElement('img');
	const title = document.createElement('h1');

	divError.setAttribute('id', 'error');
	title.textContent = 'Sin registros para tu busqueda.';
	image.setAttribute('src', '/zone-not-found.png');
	image.setAttribute('alt', 'personaje con rostro triste busqueda sin exito');
	image.setAttribute('loading', 'lazy');

	divError.appendChild(title);
	divError.appendChild(image);

	const appWrapper = $('#app');
	appWrapper.appendChild(divError);
}

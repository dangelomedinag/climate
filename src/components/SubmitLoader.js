import { $ } from '../utils';

/* <div class="loader submit">Loading...</div> */

/** @type {HTMLElement} */
const submitButton = $('#form-submit');
/** @type {HTMLElement} */
const submitText = $('.submit_text');

/** @type {HTMLElement} */
const loader = document.createElement('div');
loader.classList.add('loader');
loader.classList.add('submit');

export function show() {
	submitButton.appendChild(loader);
	submitText.style.visibility = 'hidden';
}
export function close() {
	loader.remove();
	submitText.style.visibility = 'visible';
}

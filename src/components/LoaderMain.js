{
	/* <div class="loader-wrapper hide">
	<div class="loader main">Loading...</div>
</div> */
}

/**@type {HTMLElement} */
const div = document.createElement('div');
const loader = document.createElement('div');
loader.classList.add('loader');
loader.classList.add('main');
loader.textContent = 'Loading...';

div.append(loader);

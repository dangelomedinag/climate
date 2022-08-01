const scrollTop = document.createElement('button');
scrollTop.setAttribute('id', 'scrollToTop');
scrollTop.classList.add('shadow-smooth');
scrollTop.addEventListener('click', () => {
	window.scrollTo({ behavior: 'smooth', top: 0 });
});
const iconString = `
<div>volver</div>
<svg
	class="svgicon"
	xmlns="http://www.w3.org/2000/svg"
	fill="none"
	viewBox="0 0 24 24"
	stroke="currentColor"
	stroke-width="1"
	>
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		d="M7 11l5-5m0 0l5 5m-5-5v12"
	/>
</svg>
<div>arriba </div>`;

scrollTop.innerHTML = iconString;

export default function ScrollTop() {
	return scrollTop;
}

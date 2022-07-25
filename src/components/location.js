const textLocation = document.querySelector('.location');

export default function Location({ name, country, region }) {
	textLocation.textContent = `${name}, ${region}, ${country}.`;
}

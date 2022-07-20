export function getDayFromIndex(indexDay) {
	switch (indexDay.toString()) {
		case '1':
			return 'lunes';
		case '2':
			return 'martes';
		case '3':
			return 'miercoles';
		case '4':
			return 'jueves';
		case '5':
			return 'viernes';
		case '6':
			return 'sabado';
		case '0':
			return 'domingo';
	}
}

export const TABS = Object.freeze({
	temp: 'temp',
	prec: 'precip',
	wind: 'wind',
});

export const UNITS = Object.freeze({
	c: 'c',
	f: 'f',
});

export function getInputValue(inputElement) {
	const value = inputElement.value.toLowerCase().trim();
	return value;
}

export function getFormatDateTime(
	date,
	opts = { format: '24h', type: 'short' }
) {
	const dateObj = new Date(date);

	let hours = dateObj.getHours();
	let minutes = dateObj.getMinutes();
	const format = hours >= 12 ? 'pm' : 'am';

	minutes = minutes < 10 ? '0' + minutes : minutes;

	if (opts?.format === '24h') {
		hours = hours < 10 ? '0' + hours : hours;

		return hours + ':' + minutes;
	}

	if (opts?.format === '12h') {
		hours = hours % 12;
		hours = hours ? hours : 12;

		if (opts?.type === 'long') {
			return `${hours}:${minutes} ${format}`;
		}

		return `${hours}:${minutes}`;
	}
}

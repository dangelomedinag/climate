const { VITE_RAPIDAPI_KEY, VITE_RAPIDAPI_HOST } = import.meta.env;

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': VITE_RAPIDAPI_KEY,
		'X-RapidAPI-Host': VITE_RAPIDAPI_HOST,
	},
};

export async function getData(params) {
	const API_URL = new URL(
		'https://weatherapi-com.p.rapidapi.com/forecast.json'
	);

	API_URL.searchParams.set('q', 'Santiago');
	API_URL.searchParams.set('lang', 'es');
	API_URL.searchParams.set('days', 3);

	if (params?.q) API_URL.searchParams.set('q', params.q);
	if (params?.lang) API_URL.searchParams.set('lang', params.lang);
	if (params?.days) API_URL.searchParams.set('days', params.days);
	if (params?.dt) API_URL.searchParams.set('dt', params.dt);

	console.log(API_URL.href);

	try {
		const data = await fetch(API_URL, options);
		const response = await data.json();

		return { ...response, url: API_URL };
	} catch (err) {
		console.error(err);
	}
}

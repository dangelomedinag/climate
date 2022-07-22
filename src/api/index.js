const { VITE_RAPIDAPI_KEY, VITE_RAPIDAPI_HOST } = import.meta.env;

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': VITE_RAPIDAPI_KEY,
		'X-RapidAPI-Host': VITE_RAPIDAPI_HOST,
	},
};

const BASE = new URL('https://weatherapi-com.p.rapidapi.com');

const ENDPOINTS = Object.freeze({
	FORECAST: {
		url: new URL('forecast.json', BASE),
		params: {
			q: { defaultValue: null, validate: [['minlength', 3]] },
			lang: { defaultValue: 'es', validate: [['typeof', 'string']] },
			days: { defaultValue: null, validate: [['typeof', 'number']] },
			dt: {
				defaultValue: null,
				validate: [['typeof', 'string']],
				invalidate: 'days',
			},
		},
	},
	SEARCH: {
		url: new URL('search.json', BASE),
		params: { q: { defaultValue: null, validate: [['minlength', 3]] } },
	},
});

export async function getData(endpoint, params) {
	const API_URL = endpoint.url;

	let totalResults = [];
	Object.entries(endpoint.params).forEach(
		([param, { defaultValue, validate, invalidate }]) => {
			if (params[param]) {
				const results = validate.map(([prop, value]) => {
					if (prop === 'minlength') {
						return {
							valid: params[param].length >= value,
							key: param,
							rule: { property: prop, compare: value },
							error: `params.${param} no cumple la condicion [${prop}-${value}].`,
						};
					}
					if (prop === 'typeof') {
						return {
							valid: typeof params[param] === value,
							key: param,
							rule: { property: prop, compare: value },
							error: `params.${param} no cumple la condicion [${prop}-${value}].`,
						};
					}
					if (prop === 'instanceof') {
						if (value === 'Date')
							return {
								valid: params[param] instanceof Date,
								key: param,
								rule: { property: prop, compare: value },
								error: `params.${param} no cumple la condicion [${prop}-${value}].`,
							};
					}
				});
				totalResults.push(...results);
			}

			if (params[param] && !defaultValue) {
				API_URL.searchParams.set(param, params[param]);
			} else if (!params[param] && defaultValue) {
				API_URL.searchParams.set(param, defaultValue);
			}

			if (invalidate) {
				if (params[param] && params[invalidate]) {
					API_URL.searchParams.delete(param);
				}
			}
		}
	);

	const errors = totalResults.some(({ valid }) => !valid);

	if (errors) {
		const getErrors = totalResults.filter((r) => !r.valid).map((e) => e.error);

		throw Error(getErrors.join(' | '));
	}

	const data = await fetch(API_URL, options);

	if (data.status > 299) {
		const json = await data.json();
		throw new Error(json.error.message);
	}
	const response = await data.json();

	if (Array.isArray(response)) {
		return { search: response, url: API_URL };
	}

	return { ...response, url: API_URL };
}

export const API = {
	forecast(params) {
		return getData(ENDPOINTS.FORECAST, params);
	},
	search(params) {
		return getData(ENDPOINTS.SEARCH, params);
	},
};

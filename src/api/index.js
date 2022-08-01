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

let translate = [
	['francia', 'france'],
	// ['rusia', 'russia'],
	['españa', 'spain'],
	['alemania', 'germany'],
	['Alemania', 'Germany'],
	['Andorra', 'Andorra'],
	['Arabia Saudí', 'Saudi Arabia'],
	['Arabia Saudi', 'Saudi Arabia'],
	// ["Argentina", "Argentina"],
	// ["Austria", "Austria"],
	['Bélgica', 'Belgium'],
	['Belgica', 'Belgium'],
	// ["Bolivia", "Bolivia"],
	['Brasil', 'Brazil'],
	['Canadá', 'Canada'],
	// ["Canada", "Canada"],
	// ["Chile", "Chile"],
	// ["China", "China"],
	['Chipre', 'Cyprus'],
	// ["Colombia", "Colombia"],
	// ["Costa Rica", "Costa Rica"],
	['Croacia', 'Croatia'],
	// ["Cuba", "Cuba"],
	['Dinamarca', 'Denmark'],
	// ["Ecuador", "Ecuador"],
	['Egipto', 'Egypt'],
	['El Salvador', 'El Salvador'],
	['Escocia', 'Scotland'],
	['Estados Unidos', 'E.E.U.U.'],
	['United States', 'The USA'],
	['Filipinas', 'the Philippines'],
	['Finlandia', 'Finland'],
	['Francia', 'France'],
	['Gran Bretaña', 'Great Britain'],
	['Grecia', 'Greece'],
	// ["Guatemala", "Guatemala"],
	['Honduras', 'Honduras'],
	['Hungría', 'Hungary'],
	['Hungria', 'Hungary'],
	['India', 'India'],
	['Indonesia', 'Indonesia'],
	['Inglaterra', 'England'],
	['Irán', 'Iran'],
	['Iran', 'Iran'],
	['Iraq', 'Iraq'],
	['Irlanda', 'Ireland'],
	['Israel', 'Israel'],
	['Italia', 'Italy'],
	['Jamaica', 'Jamaica'],
	['Japón', 'Japan'],
	['Japon', 'Japan'],
	['Luxemburgo', 'Luxembourg'],
	['Marruecos', 'Morocco'],
	['México', 'Mexico'],
	['Mexico', 'Mexico'],
	['Noruega', 'Norway'],
	['Nueva Zelanda', 'New Zealand'],
	['País de Gales', 'Wales'],
	['Países Bajos', 'Netherlands'],
	['Holanda', 'Holland'],
	['Panamá', 'Panama'],
	['Panama', 'Panama'],
	['Paraguay', 'Paraguay'],
	['Perú', 'Peru'],
	// ["Peru","Peru"],
	['Polonia', 'Poland'],
	// ["Portugal","Portugal"],
	// ["Puerto Rico","Puerto Rico"],
	['Reino Unido', 'United Kingdom'],
	['uk', 'United Kingdom'],
	['República Checa', 'Czech Republic'],
	['Republica Checa', 'Czech Republic'],
	['República Dominicana', 'Dominican Republic'],
	['Republica Dominicana', 'Dominican Republic'],
	['Rusia', 'Russia'],
	['Serbia', 'Serbia'],
	['Sudáfrica', 'South Africa'],
	['Sudafrica', 'South Africa'],
	['Suecia', 'Sweden'],
	['Suiza', 'Switzerland'],
	['Tailandia', 'Thailand'],
	['Túnez', 'Tunisia'],
	['Tunez', 'Tunisia'],
	['Turquía', 'Turkey'],
	['Turquia', 'Turkey'],
	['Ucrania', 'Ukraine'],
	// ["Uruguay","Uruguay"],
	// ["Venezuela","Venezuela"],
];
export async function getData(endpoint, params) {
	/**@type {URL} */
	const API_URL = endpoint.url;

	let totalResults = [];
	Object.entries(endpoint.params).forEach(
		([param, { defaultValue, validate, invalidate }]) => {
			if (params[param]) {
				if (param === 'q') {
					// console.log('params[param]:', params[param]);

					translate.forEach(([from, to]) => {
						const word = params[param].toLowerCase().trim();
						if (word.includes(from)) {
							params[param] = params[param]
								.replace(from, to)
								.toLowerCase()
								.trim();
						}
					});
				}

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

	const res = { ...response };
	if (res.location) {
		// console.log({
		// 	name: res.location.name,
		// 	region: res.location.region,
		// 	country: res.location.country,
		// });

		const q = new URL(API_URL.href).searchParams.get('q').toString();
		// console.log({ q });
		const split = q.split(' ');
		const exist = split.some((w) => {
			let nn = res.location.name.toLowerCase().trim();
			let rr = res.location.region.toLowerCase().trim();
			let cc = res.location.country.toLowerCase().trim();
			// console.log(
			// 	nn.includes(w.toLowerCase().replace(',', '').trim()),
			// 	rr.includes(w.toLowerCase().replace(',', '').trim()),
			// 	cc.includes(w.toLowerCase().replace(',', '').trim())
			// );

			return (
				nn.includes(w.toLowerCase().replace(',', '').trim()) ||
				rr.includes(w.toLowerCase().replace(',', '').trim()) ||
				cc.includes(w.toLowerCase().replace(',', '').trim())
			);
		});

		// console.log(exist);
		if (!exist) {
			// const json = await data.json();
			throw new Error('no matching with words');
		}

		// sads5
	}

	// existInSearch();

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

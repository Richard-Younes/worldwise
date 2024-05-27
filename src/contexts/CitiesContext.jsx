/** @format */

import {
	createContext,
	useContext,
	useEffect,
	useReducer,
	useState,
} from 'react';

const Base_URL = 'http://localhost:9000';

const CitiesContext = createContext();

const initialState = {
	cities: [],
	isLoading: false,
	currentCity: {},
	error: '',
};

function reducer(state, action) {
	switch (action.type) {
		case 'loading':
			return { ...state, isLoading: true };

		case 'cities/loaded':
			return { ...state, cities: action.payload, isLoading: false };

		case 'city/loaded':
			return { ...state, isLoading: false, currentCity: action.payload };

		case 'city/created':
			return {
				...state,
				isLoading: false,
				cities: [...state.cities, action.payload],
				currentCity: action.payload,
			};

		case 'city/deleted':
			return {
				...state,
				isLoading: false,
				cities: state.cities.filter(city => city.id !== action.payload),
				currentCity: {},
			};

		case 'rejected':
			return { ...state, isLoading: false, error: action.payload };

		default:
			throw new Error('Invalid action type');
	}
}

function CitiesProvider({ children }) {
	const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
		reducer,
		initialState
	);

	// const [cities, setCities] = useState([]);
	// const [isLoading, setIsLoading] = useState(false);
	// const [currentCity, setCurrentCity] = useState({});

	useEffect(function () {
		async function fetchCities() {
			dispatch({ type: 'loading' });
			try {
				const response = await fetch(`${Base_URL}/cities`);
				const data = await response.json();
				dispatch({ type: 'cities/loaded', payload: data });
			} catch {
				dispatch({ type: 'rejected', payload: 'Failed to fetch data' });
			}
		}

		fetchCities();
	}, []);

	async function getCity(id) {
		if (Number(id) === currentCity.id) return;

		dispatch({ type: 'loading' });

		try {
			const response = await fetch(`${Base_URL}/cities/${id}`);
			const data = await response.json();
			dispatch({ type: 'city/loaded', payload: data });
		} catch {
			dispatch({ type: 'rejected', payload: 'Failed to fetch data' });
		}
	}

	async function createCity(newCity) {
		dispatch({ type: 'loading' });
		try {
			const response = await fetch(`${Base_URL}/cities`, {
				method: 'POST',
				body: JSON.stringify(newCity),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const data = await response.json();
			dispatch({ type: 'city/created', payload: data });
		} catch {
			dispatch({
				type: 'rejected',
				payload: 'There was an error creating the city',
			});
		}
	}

	async function deleteCity(id) {
		dispatch({ type: 'loading' });
		try {
			const response = await fetch(`${Base_URL}/cities/${id}`, {
				method: 'DELETE',
			});

			dispatch({ type: 'city/deleted', payload: id });
		} catch {
			dispatch({
				type: 'rejected',
				payload: 'There was an errir deleting city',
			});
		}
	}

	return (
		<CitiesContext.Provider
			value={{
				cities,
				isLoading,
				currentCity,
				error,
				getCity,
				createCity,
				deleteCity,
			}}>
			{children}
		</CitiesContext.Provider>
	);
}

function useCities() {
	const context = useContext(CitiesContext);
	if (context === undefined) {
		throw new Error('Cities context was used outside the CitiesProvider');
	}
	return context;
}

export { CitiesProvider, useCities };

/** @format */

import { createContext, useContext, useEffect, useState } from 'react';

const Base_URL = 'http://localhost:9000';

const CitiesContext = createContext();

function CitiesProvider({ children }) {
	const [cities, setCities] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentCity, setCurrentCity] = useState({});

	useEffect(function () {
		async function fetchCities() {
			try {
				setIsLoading(true);
				const response = await fetch(`${Base_URL}/cities`);
				const data = await response.json();
				setCities(data);
			} catch {
				alert('Failed to fetch data');
			} finally {
				setIsLoading(false);
			}
		}

		fetchCities();
	}, []);

	async function getCity(id) {
		try {
			setIsLoading(true);
			const response = await fetch(`${Base_URL}/cities/${id}`);
			const data = await response.json();
			setCurrentCity(data);
		} catch {
			alert('Failed to fetch data');
		} finally {
			setIsLoading(false);
		}
	}

	async function createCity(newCity) {
		try {
			setIsLoading(true);

			const response = await fetch(`${Base_URL}/cities`, {
				method: 'POST',
				body: JSON.stringify(newCity),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const data = await response.json();
			setCities(cities => [...cities, data]);
		} catch {
			alert('Failed to fetch data');
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<CitiesContext.Provider
			value={{
				cities,
				isLoading,
				currentCity,
				getCity,
				createCity,
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

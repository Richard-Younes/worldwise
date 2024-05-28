/** @format */
import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { CitiesProvider } from './contexts/CitiesContext';
import { AuthProvider } from './contexts/FakeAuthContext';
import ProtectedRoute from './pages/ProtectedRoute';

import CityList from './components/CityList';
import CountryList from './components/CountryList';
import City from './components/City';
import Form from './components/Form';
import SpinnerFullPage from './components/SpinnerFullPage';

// import Product from './pages/Product';
// import Pricing from './pages/Pricing';
// import Homepage from './pages/Homepage';
// import PageNotFound from './pages/PageNotFound';
// import Login from './pages/Login';
// import AppLayout from './pages/AppLayout';

// Lazy Loading the pages (better performance)
// 1) use the lazy function from react
// 2) use the Suspense component to wrap the Routes component
// 3) use the fallback prop of the Suspense component to display a loading spinner

const Homepage = lazy(() => import('./pages/Homepage'));
const Product = lazy(() => import('./pages/Product'));
const Pricing = lazy(() => import('./pages/Pricing'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));
const Login = lazy(() => import('./pages/Login'));
const AppLayout = lazy(() => import('./pages/AppLayout'));

function App() {
	return (
		<AuthProvider>
			<CitiesProvider>
				<BrowserRouter>
					<Suspense fallback={<SpinnerFullPage />}>
						<Routes>
							<Route index element={<Homepage />} />
							<Route path='product' element={<Product />} />
							<Route path='pricing' element={<Pricing />} />
							<Route path='/login' element={<Login />} />
							<Route
								path='/app'
								element={
									<ProtectedRoute>
										<AppLayout />
									</ProtectedRoute>
								}>
								<Route index element={<Navigate to='cities' replace />} />
								<Route path='cities' element={<CityList />} />

								<Route path='cities/:id' element={<City />} />

								<Route path='countries' element={<CountryList />} />
								<Route path='form' element={<Form />} />
							</Route>
							<Route path='*' element={<PageNotFound />} />
						</Routes>
					</Suspense>
				</BrowserRouter>
			</CitiesProvider>
		</AuthProvider>
	);
}

export default App;

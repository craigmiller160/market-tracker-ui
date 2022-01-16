import { BrowserRouter, Outlet, useRoutes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import './App.scss';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { Breakpoints } from './utils/Breakpoints';
import { ScreenContext, ScreenContextValue } from './ScreenContext';
import { routes } from '../routes';
import { AppRoutes } from './AppRoutes';

const createScreenContextValue = (
	breakpoints: Breakpoints
): ScreenContextValue => ({
	breakpoints
});

export const App = () => {
	const breakpoints = useBreakpoint();
	const screenContextValue = createScreenContextValue(breakpoints);
	return (
		<ScreenContext.Provider value={screenContextValue}>
			<Provider store={store}>
				<BrowserRouter basename="/">
					<AppRoutes />
					{/*<Routes>*/}
					{/*	<Route*/}
					{/*		path="/"*/}
					{/*		element={<Navigate to="/market-tracker" />}*/}
					{/*	/>*/}
					{/*	<Route*/}
					{/*		path="/market-tracker/*"*/}
					{/*		element={*/}
					{/*			<Layout className="MarketTrackerApp">*/}
					{/*				<Navbar />*/}
					{/*				<Content />*/}
					{/*			</Layout>*/}
					{/*		}*/}
					{/*	/>*/}
					{/*</AppRoutes>*/}
				</BrowserRouter>
			</Provider>
		</ScreenContext.Provider>
	);
};

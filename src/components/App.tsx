import { Navbar } from './Navbar';
import { Content } from './Content';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import './App.scss';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { Breakpoints } from './utils/Breakpoints';
import { ScreenContextValue, ScreenContext } from './ScreenContext';
import { Navigate, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';

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
					<Routes>
						<Route
							path="/"
							element={<Navigate to="/market-tracker" />}
						/>
						<Route
							path="/market-tracker/*"
							element={
								<Layout className="MarketTrackerApp">
									<Navbar />
									<Content />
								</Layout>
							}
						/>
					</Routes>
				</BrowserRouter>
			</Provider>
		</ScreenContext.Provider>
	);
};

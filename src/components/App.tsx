import { BrowserRouter, Outlet, useRoutes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import './App.scss';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { Breakpoints } from './utils/Breakpoints';
import { ScreenContext, ScreenContextValue } from './ScreenContext';
import { routes } from '../routes';
import { AppRoutes } from './AppRoutes';
import { Navbar } from './Navbar';
import { Content } from './Content';

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
					<Navbar />
					<Content />
				</BrowserRouter>
			</Provider>
		</ScreenContext.Provider>
	);
};

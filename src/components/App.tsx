import { Navbar } from './Navbar';
import { Content } from './Content';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import { Layout } from 'antd';
import './App.scss';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { Breakpoints } from './utils/Breakpoints';
import { ScreenContextValue, ScreenContext } from './ScreenContext';

const createScreenContextValue = (
	breakpoints: Breakpoints
): ScreenContextValue => ({
	breakpoints
});

// TODO build in redirect from / to /market-tracker
export const App = () => {
	const breakpoints = useBreakpoint();
	const screenContextValue = createScreenContextValue(breakpoints);
	return (
		<ScreenContext.Provider value={screenContextValue}>
			<Provider store={store}>
				<BrowserRouter basename="/market-tracker">
					<Layout className="MarketTrackerApp">
						<Navbar />
						<Content />
					</Layout>
				</BrowserRouter>
			</Provider>
		</ScreenContext.Provider>
	);
};

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import './App.scss';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { Breakpoints } from './utils/Breakpoints';
import { ScreenContext, ScreenContextValue } from './ScreenContext';
import { RootLayout } from './RootLayout';

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
					<RootLayout />
				</BrowserRouter>
			</Provider>
		</ScreenContext.Provider>
	);
};

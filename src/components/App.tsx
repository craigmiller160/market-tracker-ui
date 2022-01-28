import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import './App.scss';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { Breakpoints } from './utils/Breakpoints';
import { ScreenContext, ScreenContextValue } from './ScreenContext';
import { RootLayout } from './RootLayout';
import { ConfigProvider } from 'antd';

const createScreenContextValue = (
	breakpoints: Breakpoints
): ScreenContextValue => ({
	breakpoints
});

const nonce = '**CSP_NONCE**';

export const App = () => {
	const breakpoints = useBreakpoint();
	const screenContextValue = createScreenContextValue(breakpoints);
	return (
		<ConfigProvider csp={{ nonce }}>
			<ScreenContext.Provider value={screenContextValue}>
				<Provider store={store}>
					<BrowserRouter basename="/">
						<RootLayout />
					</BrowserRouter>
				</Provider>
			</ScreenContext.Provider>
		</ConfigProvider>
	);
};

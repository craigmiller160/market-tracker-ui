import { Provider } from 'react-redux';
import { store } from '../store';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { Breakpoints } from './utils/Breakpoints';
import { ScreenContext, ScreenContextValue } from './ScreenContext';
import { RootLayout } from './RootLayout';
import { ConfigProvider } from 'antd';
import { MarketTrackerKeycloakBridge } from './keycloak/MarketTrackerKeycloakBridge';

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
			<Provider store={store}>
				<MarketTrackerKeycloakBridge>
					<ScreenContext.Provider value={screenContextValue}>
						<RootLayout />
					</ScreenContext.Provider>
				</MarketTrackerKeycloakBridge>
			</Provider>
		</ConfigProvider>
	);
};

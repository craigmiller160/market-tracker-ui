import { Provider } from 'react-redux';
import { store } from '../store';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { type Breakpoints } from './utils/Breakpoints';
import { ScreenContext, type ScreenContextValue } from './ScreenContext';
import { RootLayout } from './RootLayout';
import { ConfigProvider } from 'antd';
import { MarketTrackerKeycloakBridge } from './keycloak/MarketTrackerKeycloakBridge';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../queries/queryClient';

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
			<QueryClientProvider client={queryClient}>
				<Provider store={store}>
					<MarketTrackerKeycloakBridge>
						<ScreenContext.Provider value={screenContextValue}>
							<RootLayout />
						</ScreenContext.Provider>
					</MarketTrackerKeycloakBridge>
				</Provider>
			</QueryClientProvider>
		</ConfigProvider>
	);
};

import { store, type StoreType } from '../../src/store';
import {
	ScreenContext,
	type ScreenContextValue
} from '../../src/components/ScreenContext';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { RootLayout } from '../../src/components/RootLayout';
import { marketSettingsSlice } from '../../src/store/marketSettings/slice';
import { authSlice } from '../../src/store/auth/slice';
import { notificationSlice } from '../../src/store/notification/slice';
import {
	type KeycloakAuth,
	KeycloakAuthContext
} from '@craigmiller160/react-keycloak';
import { MarketTrackerKeycloakBridge } from '../../src/components/keycloak/MarketTrackerKeycloakBridge';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface RenderConfig {
	readonly initialPath: string;
	readonly screenContextValue: ScreenContextValue;
}

interface RenderResult {
	readonly store: StoreType;
}

const resetStore = () => {
	store.dispatch(marketSettingsSlice.actions.reset());
	store.dispatch(notificationSlice.actions.reset());
	store.dispatch(authSlice.actions.reset());
};

const keycloakAuth: KeycloakAuth = {
	status: 'authorized',
	isPostAuthorization: true,
	isPreAuthorization: false,
	logout: vi.fn()
};

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			cacheTime: 0,
			retry: false
		}
	}
});

export const renderApp = (
	renderConfig?: Partial<RenderConfig>
): RenderResult => {
	window.history.replaceState({}, '', renderConfig?.initialPath ?? '/');
	const screenContextValue: ScreenContextValue =
		renderConfig?.screenContextValue ?? {
			breakpoints: {
				lg: true
			}
		};

	resetStore();

	render(
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<KeycloakAuthContext.Provider value={keycloakAuth}>
					<MarketTrackerKeycloakBridge>
						<ScreenContext.Provider value={screenContextValue}>
							<BrowserRouter basename="/">
								<RootLayout />
							</BrowserRouter>
						</ScreenContext.Provider>
					</MarketTrackerKeycloakBridge>
				</KeycloakAuthContext.Provider>
			</QueryClientProvider>
		</Provider>
	);
	return {
		store
	};
};

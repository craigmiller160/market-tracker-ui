import { RootState } from '../../src/store';
import {
	ScreenContext,
	ScreenContextValue
} from '../../src/components/ScreenContext';
import { EnhancedStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { RootLayout } from '../../src/components/RootLayout';
import { store } from '../../src/store';
import { marketSettingsSlice } from '../../src/store/marketSettings/slice';
import { authSlice } from '../../src/store/auth/slice';
import { notificationSlice } from '../../src/store/notification/slice';

interface RenderConfig {
	readonly initialPath: string;
	readonly screenContextValue: ScreenContextValue;
}

interface RenderResult {
	readonly store: EnhancedStore<RootState>;
}

const resetStore = () => {
	store.dispatch(marketSettingsSlice.actions.reset());
	store.dispatch(notificationSlice.actions.reset());
	store.dispatch(authSlice.actions.reset());
};

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
			<ScreenContext.Provider value={screenContextValue}>
				<BrowserRouter basename="/">
					<RootLayout />
				</BrowserRouter>
			</ScreenContext.Provider>
		</Provider>
	);
	return {
		store
	};
};

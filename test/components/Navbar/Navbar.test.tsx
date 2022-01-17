import { render, waitFor } from '@testing-library/react';
import { RootLayout } from '../../../src/components/RootLayout';
import { ajaxApi } from '../../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import { RootState } from '../../../src/store';
import { Provider } from 'react-redux';
import { createStore } from '../../../src/store/createStore';
import { EnhancedStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import {
	ScreenContext,
	ScreenContextValue
} from '../../../src/components/ScreenContext';

const mockApi = new MockAdapter(ajaxApi.instance);

interface RenderConfig {
	readonly preloadedState: Partial<RootState>;
	readonly initialPath: string;
	readonly screenContextValue: ScreenContextValue;
}

interface RenderResult {
	readonly store: EnhancedStore<RootState>;
}

const doRender = async (
	renderConfig?: Partial<RenderConfig>
): Promise<RenderResult> => {
	const store: EnhancedStore<RootState> = createStore(
		renderConfig?.preloadedState
	);
	window.history.replaceState({}, '', renderConfig?.initialPath ?? '/');
	const screenContextValue: ScreenContextValue =
		renderConfig?.screenContextValue ?? {
			breakpoints: {
				lg: true
			}
		};
	await waitFor(() =>
		render(
			<Provider store={store}>
				<ScreenContext.Provider value={screenContextValue}>
					<BrowserRouter basename="/">
						<RootLayout />
					</BrowserRouter>
				</ScreenContext.Provider>
			</Provider>
		)
	);
	return {
		store
	};
};

describe('Navbar', () => {
	beforeEach(() => {
		mockApi.reset();
	});

	// TODO delete this
	it('practice', async () => {
		await doRender();
	});

	it('renders for desktop', () => {
		throw new Error();
	});

	it('renders for mobile', () => {
		throw new Error();
	});

	it('shows correct items for un-authenticated user, including welcome page', () => {
		throw new Error();
	});

	it('shows correct items for authenticated user', () => {
		throw new Error();
	});

	it('navigates to portfolios page', () => {
		throw new Error();
	});

	it('navigates to watchlists page', () => {
		throw new Error();
	});

	it('sends login request', () => {
		throw new Error();
	});

	it('sends logout request', () => {
		throw new Error();
	});
});

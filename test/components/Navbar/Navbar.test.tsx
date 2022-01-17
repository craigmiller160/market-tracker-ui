import { render, waitFor, screen } from '@testing-library/react';
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
import '@testing-library/jest-dom/extend-expect';
import { AuthUser } from '../../../src/types/auth';
import userEvent from '@testing-library/user-event';

const authUser: AuthUser = {
	userId: 1
};

const SELECTED_CLASS = 'ant-menu-item-selected';

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

const mockUserAuthSuccess = () =>
	mockApi.onGet('/oauth/user').reply(200, authUser);

describe('Navbar', () => {
	beforeEach(() => {
		mockApi.reset();
	});

	it('renders for desktop', async () => {
		await doRender();
		expect(screen.queryByTestId('desktop-navbar')).toBeInTheDocument();
	});

	it('renders for mobile', async () => {
		await doRender({
			screenContextValue: {
				breakpoints: {
					lg: false,
					md: true
				}
			}
		});
		expect(screen.queryByTestId('mobile-navbar')).toBeInTheDocument();
	});

	it('shows correct items for un-authenticated user', async () => {
		await doRender();
		expect(screen.queryByText('Market Tracker')).toBeInTheDocument();
		expect(screen.queryByText('Login')).toBeInTheDocument();

		expect(screen.queryByText('Portfolios')).not.toBeInTheDocument();
		expect(screen.queryByText('Watchlists')).not.toBeInTheDocument();
		expect(screen.queryByText('Logout')).not.toBeInTheDocument();
	});

	it('shows correct items for authenticated user', async () => {
		mockUserAuthSuccess();
		await doRender();
		expect(screen.queryByText('Market Tracker')).toBeInTheDocument();
		expect(screen.queryByText('Portfolios')).toBeInTheDocument();
		expect(screen.queryByText('Watchlists')).toBeInTheDocument();
		expect(screen.queryByText('Logout')).toBeInTheDocument();

		expect(screen.queryByText('Login')).not.toBeInTheDocument();
	});

	it('starts on watchlists page due to route, then navigates to portfolios page', async () => {
		mockUserAuthSuccess();
		await doRender({
			initialPath: '/market-tracker/watchlists'
		});

		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/watchlists'
		);
		expect(screen.getByText('Watchlists').closest('li')?.className).toEqual(
			expect.stringContaining(SELECTED_CLASS)
		);
		expect(
			screen.getByText('Portfolios').closest('li')?.className
		).not.toEqual(expect.stringContaining(SELECTED_CLASS));

		userEvent.click(screen.getByText('Portfolios'));

		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/portfolios'
		);
		expect(
			screen.getByText('Watchlists').closest('li')?.className
		).not.toEqual(expect.stringContaining(SELECTED_CLASS));
		expect(screen.getByText('Portfolios').closest('li')?.className).toEqual(
			expect.stringContaining(SELECTED_CLASS)
		);
	});

	it('starts on portfolios page due to route, then navigates to watchlists page', () => {
		throw new Error();
	});

	it('sends login request', () => {
		throw new Error();
	});

	it('sends logout request', () => {
		throw new Error();
	});
});

import { act, screen } from '@testing-library/react';
import { ajaxApi } from '../../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom/extend-expect';
import { AuthCodeLogin } from '../../../src/types/auth';
import userEvent from '@testing-library/user-event';
import * as Option from 'fp-ts/es6/Option';
import { mockLocation, restoreLocation } from '../../testutils/mockLocation';
import { sleep } from '../../../src/function/Sleep';
import { createRenderApp } from '../../testutils/RenderApp';

const authCodeLogin: AuthCodeLogin = {
	url: 'theUrl'
};

const SELECTED_CLASS = 'ant-menu-item-selected';

const mockApi = new MockAdapter(ajaxApi.instance);

const renderApp = createRenderApp(mockApi);

describe('Navbar', () => {
	let location: Option.Option<Location> = Option.none;
	beforeEach(() => {
		mockApi.reset();
	});

	afterEach(() => {
		Option.map(restoreLocation)(location);
	});

	it('renders for desktop', async () => {
		await renderApp();
		expect(screen.queryByTestId('desktop-navbar')).toBeInTheDocument();
	});

	it('renders for mobile', async () => {
		await renderApp({
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
		await renderApp({
			isAuthorized: false
		});
		expect(screen.queryByText('Market Tracker')).toBeInTheDocument();
		expect(screen.queryByText('Login')).toBeInTheDocument();

		expect(screen.queryByText('Portfolios')).not.toBeInTheDocument();
		expect(screen.queryByText('Watchlists')).not.toBeInTheDocument();
		expect(screen.queryByText('Logout')).not.toBeInTheDocument();
	});

	it('shows correct items for authenticated user', async () => {
		await renderApp();
		expect(screen.queryByText('Market Tracker')).toBeInTheDocument();
		expect(screen.queryByText('Portfolios')).toBeInTheDocument();
		expect(screen.queryByText('Watchlists')).toBeInTheDocument();
		expect(screen.queryByText('Logout')).toBeInTheDocument();

		expect(screen.queryByText('Login')).not.toBeInTheDocument();
	});

	it('starts on watchlists page due to route, then navigates to portfolios page', async () => {
		await renderApp({
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

	it('starts on portfolios page due to route, then navigates to watchlists page', async () => {
		await renderApp({
			initialPath: '/market-tracker/portfolios'
		});

		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/portfolios'
		);
		expect(screen.getByText('Portfolios').closest('li')?.className).toEqual(
			expect.stringContaining(SELECTED_CLASS)
		);
		expect(
			screen.getByText('Watchlists').closest('li')?.className
		).not.toEqual(expect.stringContaining(SELECTED_CLASS));

		userEvent.click(screen.getByText('Watchlists'));

		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/watchlists'
		);
		expect(
			screen.getByText('Portfolios').closest('li')?.className
		).not.toEqual(expect.stringContaining(SELECTED_CLASS));
		expect(screen.getByText('Watchlists').closest('li')?.className).toEqual(
			expect.stringContaining(SELECTED_CLASS)
		);
	});

	it('sends login request', async () => {
		mockApi.onPost('/oauth/authcode/login').reply(200, authCodeLogin);
		await renderApp({
			isAuthorized: false
		});
		location = Option.some(mockLocation());
		await act(async () => {
			await userEvent.click(screen.getByText('Login'));
		});
		expect(mockApi.history.post).toHaveLength(1);
		expect(window.location.assign).toHaveBeenCalledWith('theUrl');
	});

	it('sends logout request', async () => {
		mockApi.onGet('/oauth/logout').reply(200);
		await renderApp();
		await act(async () => {
			await userEvent.click(screen.getByText('Logout'));
			await sleep(100);
		});
		expect(screen.queryByText('Login')).toBeInTheDocument();
	});
});

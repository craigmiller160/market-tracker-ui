import { act, screen, within } from '@testing-library/react';
import { ajaxApi } from '../../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom/extend-expect';
import { AuthCodeLogin } from '../../../src/types/auth';
import userEvent from '@testing-library/user-event';
import * as Option from 'fp-ts/es6/Option';
import { mockLocation, restoreLocation } from '../../testutils/mockLocation';
import * as Sleep from '@craigmiller160/ts-functions/es/Sleep';
import { renderApp } from '../../testutils/RenderApp';
import { marketSettingsSlice } from '../../../src/store/marketSettings/slice';
import {
	menuItemIsNotSelected,
	menuItemIsSelected
} from '../../testutils/menuUtils';
import { ApiServer, newApiServer } from '../../testutils/server';

const authCodeLogin: AuthCodeLogin = {
	url: 'theUrl'
};

const SELECTED_CLASS = 'ant-menu-item-selected';

const mockApi = new MockAdapter(ajaxApi.instance);

const sleep100 = Sleep.sleep(100);

describe('Navbar', () => {
	let apiServer: ApiServer;
	let location: Option.Option<Location> = Option.none;
	beforeEach(() => {
		mockApi.reset();
		mockApi.onGet('/oauth/user').passThrough();
		apiServer = newApiServer();
	});

	afterEach(() => {
		Option.map(restoreLocation)(location);
		apiServer.server.shutdown();
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

		expect(screen.queryByText('Markets')).not.toBeInTheDocument();
		expect(screen.queryByText('Search')).not.toBeInTheDocument();
		expect(screen.queryByText('Portfolios')).not.toBeInTheDocument();
		expect(screen.queryByText('Watchlists')).not.toBeInTheDocument();
		expect(screen.queryByText('Recognition')).not.toBeInTheDocument();
		expect(screen.queryByText('Logout')).not.toBeInTheDocument();
	});

	it('shows correct items for authenticated user in prod', async () => {
		process.env.NODE_ENV = 'production';
		await renderApp();
		expect(screen.queryByText('Market Tracker')).toBeInTheDocument();
		expect(screen.queryByText('Markets')).toBeInTheDocument();
		expect(screen.queryByText('Recognition')).toBeInTheDocument();
		expect(screen.queryByText('Logout')).toBeInTheDocument();
		expect(screen.queryByText('Search')).toBeInTheDocument();

		const navbar = screen.getByTestId('desktop-navbar');

		expect(within(navbar).queryByText('Today')).toBeInTheDocument();
		expect(within(navbar).queryByText('1 Week')).toBeInTheDocument();
		expect(within(navbar).queryByText('1 Month')).toBeInTheDocument();
		expect(within(navbar).queryByText('3 Months')).toBeInTheDocument();
		expect(within(navbar).queryByText('1 Year')).toBeInTheDocument();
		expect(within(navbar).queryByText('5 Years')).toBeInTheDocument();

		menuItemIsSelected('Markets');
		menuItemIsSelected('Today');

		expect(screen.queryByText('Portfolios')).not.toBeInTheDocument();
		expect(screen.queryByText('Watchlists')).not.toBeInTheDocument();
		expect(screen.queryByText('Login')).not.toBeInTheDocument();
	});

	it('shows correct items for authenticated user', async () => {
		await renderApp();
		expect(screen.queryByText('Market Tracker')).toBeInTheDocument();
		expect(screen.queryByText('Markets')).toBeInTheDocument();
		expect(screen.queryByText('Search')).toBeInTheDocument();
		expect(screen.queryByText('Portfolios')).toBeInTheDocument();
		expect(screen.queryByText('Watchlists')).toBeInTheDocument();
		expect(screen.queryByText('Recognition')).toBeInTheDocument();
		expect(screen.queryByText('Logout')).toBeInTheDocument();

		const navbar = screen.getByTestId('desktop-navbar');

		expect(within(navbar).queryByText('Today')).toBeInTheDocument();
		expect(within(navbar).queryByText('1 Week')).toBeInTheDocument();
		expect(within(navbar).queryByText('1 Month')).toBeInTheDocument();
		expect(within(navbar).queryByText('3 Months')).toBeInTheDocument();
		expect(within(navbar).queryByText('1 Year')).toBeInTheDocument();
		expect(within(navbar).queryByText('5 Years')).toBeInTheDocument();

		menuItemIsSelected('Markets');
		menuItemIsSelected('Today');

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

	it('starts on portfolios page due to route, then navigates to search page', async () => {
		await renderApp({
			initialPath: '/market-tracker/portfolios'
		});

		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/portfolios'
		);
		expect(screen.getByText('Portfolios').closest('li')?.className).toEqual(
			expect.stringContaining(SELECTED_CLASS)
		);
		userEvent.click(screen.getByText('Search'));

		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/search'
		);
		const navbar = screen.getByTestId('desktop-navbar');
		expect(
			within(navbar).getByText('Search').closest('li')?.className
		).toEqual(expect.stringContaining(SELECTED_CLASS));
	});

	it('starts on portfolios page due to route, then navigates to recognition page', async () => {
		await renderApp({
			initialPath: '/market-tracker/portfolios'
		});

		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/portfolios'
		);
		expect(screen.getByText('Portfolios').closest('li')?.className).toEqual(
			expect.stringContaining(SELECTED_CLASS)
		);

		userEvent.click(screen.getByText('Recognition'));

		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/recognition'
		);
		expect(
			screen.getByText('Recognition').closest('li')?.className
		).toEqual(expect.stringContaining(SELECTED_CLASS));
	});

	it('starts on recognition page due to route, then navigates to watchlists page', async () => {
		await renderApp({
			initialPath: '/market-tracker/recognition'
		});

		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/recognition'
		);
		expect(
			screen.getByText('Recognition').closest('li')?.className
		).toEqual(expect.stringContaining(SELECTED_CLASS));

		userEvent.click(screen.getByText('Watchlists'));

		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/watchlists'
		);
		expect(screen.getByText('Watchlists').closest('li')?.className).toEqual(
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

	it('starts on portfolios page due to route, then navigates to markets page', async () => {
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
			screen.getByText('Markets').closest('li')?.className
		).not.toEqual(expect.stringContaining(SELECTED_CLASS));

		userEvent.click(screen.getByText('Markets'));

		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/markets'
		);
		expect(
			screen.getByText('Portfolios').closest('li')?.className
		).not.toEqual(expect.stringContaining(SELECTED_CLASS));
		expect(screen.getByText('Markets').closest('li')?.className).toEqual(
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
			await sleep100();
		});
		expect(screen.queryByText('Login')).toBeInTheDocument();
	});

	it('selects 1 Week', async () => {
		await renderApp();
		menuItemIsSelected('Today');

		userEvent.click(screen.getByText('1 Week'));
		menuItemIsNotSelected('Today');
		menuItemIsSelected('1 Week');
	});

	it('selects 1 Month', async () => {
		await renderApp();
		menuItemIsSelected('Today');

		userEvent.click(screen.getByText('1 Month'));
		menuItemIsNotSelected('Today');
		menuItemIsSelected('1 Month');
	});

	it('selects Today', async () => {
		const { store } = await renderApp();
		store.dispatch(marketSettingsSlice.actions.setTime('time.oneWeek'));
		menuItemIsSelected('1 Week');
		menuItemIsNotSelected('Today');

		userEvent.click(screen.getByText('Today'));
		menuItemIsNotSelected('1 Week');
		menuItemIsSelected('Today');
	});

	it('selects 3 Months', async () => {
		await renderApp();
		menuItemIsSelected('Today');

		userEvent.click(screen.getByText('3 Months'));
		menuItemIsNotSelected('Today');
		menuItemIsSelected('3 Months');
	});

	it('selects 1 Year', async () => {
		await renderApp();
		menuItemIsSelected('Today');

		userEvent.click(screen.getByText('1 Year'));
		menuItemIsNotSelected('Today');
		menuItemIsSelected('1 Year');
	});

	it('selects 5 Years', async () => {
		await renderApp();
		menuItemIsSelected('Today');

		userEvent.click(screen.getByText('5 Years'));
		menuItemIsNotSelected('Today');
		menuItemIsSelected('5 Years');
	});
});

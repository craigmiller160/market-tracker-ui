import { screen, waitFor, within } from '@testing-library/react';
import { ajaxApiFpTs } from '../../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import * as Option from 'fp-ts/es6/Option';
import { restoreLocation } from '../../testutils/mockLocation';
import { renderApp } from '../../testutils/RenderApp';
import { marketSettingsSlice } from '../../../src/store/marketSettings/slice';
import {
	menuItemIsNotSelected,
	menuItemIsSelected
} from '../../testutils/menuUtils';
import { ApiServer, newApiServer } from '../../testutils/server';

const SELECTED_CLASS = 'ant-menu-item-selected';

const mockApi = new MockAdapter(ajaxApiFpTs.instance);

describe('Navbar', () => {
	let apiServer: ApiServer;
	const location: Option.Option<Location> = Option.none;
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
					sm: false,
					xs: true
				}
			}
		});
		expect(screen.queryByTestId('mobile-navbar')).toBeInTheDocument();
	});

	it('shows correct items for authenticated user in prod', async () => {
		process.env.NODE_ENV = 'production';
		await renderApp();
		expect(screen.queryByText('Market Tracker')).toBeInTheDocument();
		await waitFor(() =>
			expect(screen.queryByText('Watchlists')).toBeInTheDocument()
		);
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

		menuItemIsSelected('Watchlists');
		menuItemIsSelected('Today');

		expect(screen.queryByText('Login')).not.toBeInTheDocument();
	});

	it('shows correct items for authenticated user', async () => {
		await renderApp();
		expect(screen.queryByText('Market Tracker')).toBeInTheDocument();
		await waitFor(() =>
			expect(screen.queryByText('Watchlists')).toBeInTheDocument()
		);
		expect(screen.queryByText('Search')).toBeInTheDocument();
		expect(screen.queryByText('Recognition')).toBeInTheDocument();
		expect(screen.queryByText('Logout')).toBeInTheDocument();

		const navbar = screen.getByTestId('desktop-navbar');

		expect(within(navbar).queryByText('Today')).toBeInTheDocument();
		expect(within(navbar).queryByText('1 Week')).toBeInTheDocument();
		expect(within(navbar).queryByText('1 Month')).toBeInTheDocument();
		expect(within(navbar).queryByText('3 Months')).toBeInTheDocument();
		expect(within(navbar).queryByText('1 Year')).toBeInTheDocument();
		expect(within(navbar).queryByText('5 Years')).toBeInTheDocument();

		menuItemIsSelected('Watchlists');
		menuItemIsSelected('Today');

		expect(screen.queryByText('Login')).not.toBeInTheDocument();
	});

	it('starts on recognition page due to route, then navigates to search page', async () => {
		await renderApp({
			initialPath: '/market-tracker/recognition'
		});
		await waitFor(() =>
			expect(screen.queryByText('Watchlists')).toBeInTheDocument()
		);

		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/recognition'
		);
		expect(
			screen.getByText('Recognition').closest('li')?.className
		).toEqual(expect.stringContaining(SELECTED_CLASS));
		await userEvent.click(screen.getByText('Search'));

		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/search'
		);
		const navbar = screen.getByTestId('desktop-navbar');
		expect(
			within(navbar).getByText('Search').closest('li')?.className
		).toEqual(expect.stringContaining(SELECTED_CLASS));
	});

	it('starts on recognition page due to route, then navigates to watchlists page', async () => {
		await renderApp({
			initialPath: '/market-tracker/recognition'
		});
		await waitFor(() =>
			expect(screen.queryByText('Watchlists')).toBeInTheDocument()
		);

		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/recognition'
		);
		expect(
			screen.getByText('Recognition').closest('li')?.className
		).toEqual(expect.stringContaining(SELECTED_CLASS));

		await userEvent.click(screen.getByText('Watchlists'));

		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/watchlists'
		);
		expect(screen.getByText('Watchlists').closest('li')?.className).toEqual(
			expect.stringContaining(SELECTED_CLASS)
		);
	});

	it('starts on recognition page due to route, then navigates to watchlists page', async () => {
		await renderApp({
			initialPath: '/market-tracker/recognition'
		});
		await waitFor(() =>
			expect(screen.queryByText('Watchlists')).toBeInTheDocument()
		);

		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/recognition'
		);
		expect(
			screen.getByText('Recognition').closest('li')?.className
		).toEqual(expect.stringContaining(SELECTED_CLASS));
		expect(
			screen.getByText('Watchlists').closest('li')?.className
		).not.toEqual(expect.stringContaining(SELECTED_CLASS));

		await userEvent.click(screen.getByText('Watchlists'));

		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/watchlists'
		);
		expect(screen.getByText('Watchlists').closest('li')?.className).toEqual(
			expect.stringContaining(SELECTED_CLASS)
		);
	});

	it('selects 1 Week', async () => {
		await renderApp();
		await waitFor(() =>
			expect(screen.queryByText('Watchlists')).toBeInTheDocument()
		);
		menuItemIsSelected('Today');

		await userEvent.click(screen.getByText('1 Week'));
		menuItemIsNotSelected('Today');
		menuItemIsSelected('1 Week');
	});

	it('selects 1 Month', async () => {
		await renderApp();
		await waitFor(() =>
			expect(screen.queryByText('Watchlists')).toBeInTheDocument()
		);
		menuItemIsSelected('Today');

		await userEvent.click(screen.getByText('1 Month'));
		menuItemIsNotSelected('Today');
		menuItemIsSelected('1 Month');
	});

	it('selects Today', async () => {
		const { store } = await renderApp();
		await waitFor(() =>
			expect(screen.queryByText('Watchlists')).toBeInTheDocument()
		);
		store.dispatch(marketSettingsSlice.actions.setTime('time.oneWeek'));
		await waitFor(() => menuItemIsSelected('1 Week'));
		menuItemIsNotSelected('Today');

		await userEvent.click(screen.getByText('Today'));
		menuItemIsNotSelected('1 Week');
		menuItemIsSelected('Today');
	});

	it('selects 3 Months', async () => {
		await renderApp();
		await waitFor(() =>
			expect(screen.queryByText('Watchlists')).toBeInTheDocument()
		);
		menuItemIsSelected('Today');

		await userEvent.click(screen.getByText('3 Months'));
		menuItemIsNotSelected('Today');
		menuItemIsSelected('3 Months');
	});

	it('selects 1 Year', async () => {
		await renderApp();
		await waitFor(() =>
			expect(screen.queryByText('Watchlists')).toBeInTheDocument()
		);
		menuItemIsSelected('Today');

		await userEvent.click(screen.getByText('1 Year'));
		menuItemIsNotSelected('Today');
		menuItemIsSelected('1 Year');
	});

	it('selects 5 Years', async () => {
		await renderApp();
		await waitFor(() =>
			expect(screen.queryByText('Watchlists')).toBeInTheDocument()
		);
		menuItemIsSelected('Today');

		await userEvent.click(screen.getByText('5 Years'));
		menuItemIsNotSelected('Today');
		menuItemIsSelected('5 Years');
	});
});

import { screen, waitFor } from '@testing-library/react';
import { ajaxApi } from '../../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import { renderApp } from '../../testutils/RenderApp';
import '@testing-library/jest-dom/extend-expect';
import { ApiServer, newApiServer } from '../../testutils/server';

const mockApi = new MockAdapter(ajaxApi.instance);

describe('AppRoutes', () => {
	let apiServer: ApiServer;
	beforeEach(() => {
		apiServer = newApiServer();
		mockApi.reset();
		mockApi.onGet('/oauth/user').passThrough();
	});

	afterEach(() => {
		apiServer.server.shutdown();
	});

	it('shows correct initial route for un-authenticated user', async () => {
		apiServer.actions.clearDefaultUser();
		await renderApp();
		await waitFor(() =>
			expect(window.location.href).toEqual(
				'http://localhost/market-tracker/welcome'
			)
		);
		expect(
			screen.queryByText('Welcome to Market Tracker')
		).toBeInTheDocument();
	});

	it('shows correct initial route for authenticated user', async () => {
		await renderApp();
		await waitFor(() =>
			expect(window.location.href).toEqual(
				'http://localhost/market-tracker/markets'
			)
		);
		expect(screen.queryByText('All Markets')).toBeInTheDocument();
	});

	it('correctly redirects for totally wrong route', async () => {
		await renderApp({
			initialPath: '/auth-management/'
		});
		await waitFor(() =>
			expect(window.location.href).toEqual(
				'http://localhost/market-tracker/markets'
			)
		);
		expect(screen.queryByText('All Markets')).toBeInTheDocument();
	});

	it('renders markets route', async () => {
		await renderApp({
			initialPath: '/market-tracker/markets'
		});
		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/markets'
		);
		await waitFor(() =>
			expect(screen.queryByText('All Markets')).toBeInTheDocument()
		);
	});

	it('renders portfolios route', async () => {
		await renderApp({
			initialPath: '/market-tracker/portfolios'
		});
		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/portfolios'
		);
		await waitFor(() =>
			expect(screen.queryByText('Portfolios Page')).toBeInTheDocument()
		);
	});

	it('renders watchlists route', async () => {
		await renderApp({
			initialPath: '/market-tracker/watchlists'
		});
		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/watchlists'
		);
		await waitFor(() =>
			expect(
				screen.queryByText('Investment Watchlists')
			).toBeInTheDocument()
		);
	});

	it('renders recognition route', async () => {
		await renderApp({
			initialPath: '/market-tracker/recognition'
		});
		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/recognition'
		);
		await waitFor(() =>
			expect(
				screen.queryByText('Data Source Recognition')
			).toBeInTheDocument()
		);
	});

	it('will not render portfolios route in prod', async () => {
		process.env.NODE_ENV = 'production';
		await renderApp({
			initialPath: '/market-tracker/portfolios'
		});
		await waitFor(() =>
			expect(window.location.href).toEqual(
				'http://localhost/market-tracker/markets'
			)
		);
		expect(screen.queryByText('All Markets')).toBeInTheDocument();
	});
});

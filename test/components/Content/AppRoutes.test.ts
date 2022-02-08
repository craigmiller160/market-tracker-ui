import { screen } from '@testing-library/react';
import { ajaxApi } from '../../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import { createRenderApp } from '../../testutils/RenderApp';
import '@testing-library/jest-dom/extend-expect';

const mockApi = new MockAdapter(ajaxApi.instance);
const renderApp = createRenderApp(mockApi);

describe('AppRoutes', () => {
	beforeEach(() => {
		mockApi.reset();
	});

	it('shows correct initial route for un-authenticated user', async () => {
		await renderApp({
			isAuthorized: false
		});
		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/welcome'
		);
		expect(
			screen.queryByText('Welcome to Market Tracker')
		).toBeInTheDocument();
	});

	it('shows correct initial route for authenticated user', async () => {
		await renderApp();
		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/markets'
		);
		expect(screen.queryByText('All Markets')).toBeInTheDocument();
	});

	it('correctly redirects for totally wrong route', async () => {
		await renderApp({
			initialPath: '/auth-management/'
		});
		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/markets'
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
		expect(screen.queryByText('All Markets')).toBeInTheDocument();
	});

	it('renders portfolios route', async () => {
		await renderApp({
			initialPath: '/market-tracker/portfolios'
		});
		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/portfolios'
		);
		expect(screen.queryByText('Portfolios Page')).toBeInTheDocument();
	});

	it('renders watchlists route', async () => {
		await renderApp({
			initialPath: '/market-tracker/watchlists'
		});
		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/watchlists'
		);
		expect(screen.queryByText('Watchlists Page')).toBeInTheDocument();
	});

	it('renders recognition route', async () => {
		await renderApp({
			initialPath: '/market-tracker/recognition'
		});
		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/recognition'
		);
		expect(screen.queryByText('Recognition')).toBeInTheDocument();
	});

	it('will not render portfolios route in prod', async () => {
		process.env.NODE_ENV = 'production';
		await renderApp({
			initialPath: '/market-tracker/portfolios'
		});
		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/markets'
		);
		expect(screen.queryByText('All Markets')).toBeInTheDocument();
	});

	it('will not render watchlists route in prod', async () => {
		process.env.NODE_ENV = 'production';
		await renderApp({
			initialPath: '/market-tracker/watchlists'
		});
		expect(window.location.href).toEqual(
			'http://localhost/market-tracker/markets'
		);
		expect(screen.queryByText('All Markets')).toBeInTheDocument();
	});
});

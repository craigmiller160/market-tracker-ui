import { RootState } from '../../src/store';
import {
	ScreenContext,
	ScreenContextValue
} from '../../src/components/ScreenContext';
import { EnhancedStore } from '@reduxjs/toolkit';
import { match } from 'ts-pattern';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { RootLayout } from '../../src/components/RootLayout';
import { AuthUser } from '../../src/types/auth';
import MockAdapter from 'axios-mock-adapter';
import { store } from '../../src/store';

const authUser: AuthUser = {
	userId: 1
};

interface RenderConfig {
	readonly initialPath: string;
	readonly screenContextValue: ScreenContextValue;
	readonly isAuthorized: boolean;
}

interface RenderResult {
	readonly store: EnhancedStore<RootState>;
}

const mockUserAuthSuccess = (mockApi: MockAdapter) =>
	mockApi.onGet('/oauth/user').reply(200, authUser);
const mockUserAuthFailure = (mockApi: MockAdapter) =>
	mockApi.onGet('/oauth/user').reply(401);

export const createRenderApp =
	(mockApi: MockAdapter) =>
	async (renderConfig?: Partial<RenderConfig>): Promise<RenderResult> => {
		window.history.replaceState({}, '', renderConfig?.initialPath ?? '/');
		const screenContextValue: ScreenContextValue =
			renderConfig?.screenContextValue ?? {
				breakpoints: {
					lg: true
				}
			};

		match(renderConfig?.isAuthorized)
			.with(false, () => mockUserAuthFailure(mockApi))
			.otherwise(() => mockUserAuthSuccess(mockApi));

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

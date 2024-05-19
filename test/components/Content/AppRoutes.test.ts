import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { marketTrackerApiFpTs } from '../../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import { renderApp } from '../../testutils/RenderApp';

const mockApi = new MockAdapter(marketTrackerApiFpTs.instance);

describe('AppRoutes', () => {
    beforeEach(() => {
        mockApi.reset();
        mockApi.onGet('/oauth/user').passThrough();
    });

    it('shows correct initial route for authenticated user', async () => {
        renderApp();
        await waitFor(
            () =>
                expect(window.location.href).toEqual(
                    'http://localhost:3000/investments'
                ),
            {
                timeout: 2000
            }
        );
        await waitFor(() =>
            expect(screen.queryAllByText('Investment Info')).toHaveLength(2)
        );
    });

    it('correctly redirects for totally wrong route', async () => {
        renderApp({
            initialPath: '/auth-management/'
        });
        await waitFor(
            () =>
                expect(window.location.href).toEqual(
                    'http://localhost:3000/investments'
                ),
            {
                timeout: 2000
            }
        );
        expect(screen.getAllByText('Investment Info')).toHaveLength(2);
    });

    it('renders investment info route', async () => {
        renderApp({
            initialPath: '/investments'
        });
        await waitFor(
            () =>
                expect(window.location.href).toEqual(
                    'http://localhost:3000/investments'
                ),
            {
                timeout: 2000
            }
        );
        await waitFor(() =>
            expect(screen.queryAllByText('Investment Info')).toHaveLength(2)
        );
    });

    it('renders recognition route', async () => {
        renderApp({
            initialPath: '/recognition'
        });
        await waitFor(
            () =>
                expect(window.location.href).toEqual(
                    'http://localhost:3000/recognition'
                ),
            {
                timeout: 2000
            }
        );
        await screen.findByText('Data Source Recognition');
    });
});

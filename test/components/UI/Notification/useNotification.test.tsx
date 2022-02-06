import { act, screen } from '@testing-library/react';
import { createRenderApp } from '../../../testutils/RenderApp';
import { ajaxApi } from '../../../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { notificationSlice } from '../../../../src/store/notification/slice';

const mockApi = new MockAdapter(ajaxApi.instance);
const renderApp = createRenderApp(mockApi);

const getCloseBtn = (): Element => {
	return document.querySelector('.ant-notification-notice-close')!;
};

describe('Notification', () => {
	it('shows success notification, and hides on click of X', async () => {
		const { store } = await renderApp();
		await act(async () => {
			store.dispatch(notificationSlice.actions.reset());
			store.dispatch(notificationSlice.actions.addSuccess('Hello World'));
		});

		expect(screen.queryByText('Success')).toBeInTheDocument();
		expect(screen.queryByText('Hello World')).toBeInTheDocument();

		const closeBtn = getCloseBtn();
		await act(async () => {
			userEvent.click(closeBtn);
		});
		console.log(store.getState().notification.notifications);

		expect(screen.queryByText('Success')).not.toBeInTheDocument();
		expect(screen.queryByText('Hello World')).not.toBeInTheDocument();

		expect(store.getState()).toEqual(
			expect.objectContaining({
				alert: {
					type: 'success',
					message: 'Hello World',
					show: false
				}
			})
		);
	});

	it('shows error notification, and hides on click of X', async () => {
		const { store } = await renderApp();
		await act(async () => {
			store.dispatch(notificationSlice.actions.reset());
			store.dispatch(notificationSlice.actions.addError('Hello World'));
		});

		expect(screen.queryByText('Error')).toBeInTheDocument();
		expect(screen.queryByText('Hello World')).toBeInTheDocument();

		const closeBtn = getCloseBtn();
		userEvent.click(closeBtn);

		expect(screen.queryByText('Error')).not.toBeInTheDocument();
		expect(screen.queryByText('Hello World')).not.toBeInTheDocument();

		expect(store.getState()).toEqual(
			expect.objectContaining({
				alert: {
					type: 'error',
					message: 'Hello World',
					show: false
				}
			})
		);
	});
});

import { screen } from '@testing-library/react';
import { createRenderApp } from '../../../testutils/RenderApp';
import { ajaxApi } from '../../../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import { alertSlice } from '../../../../src/store/alert/slice';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';

const mockApi = new MockAdapter(ajaxApi.instance);
const renderApp = createRenderApp(mockApi);

const getCloseBtn = (): Element => {
	const wrapper = screen.getByTestId('alert-wrapper');
	const closeBtn = wrapper.querySelector('button.ant-alert-close-icon');
	expect(closeBtn).not.toBeNull();
	return closeBtn!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
};

describe('Alert', () => {
	it('shows success alert, and hides on click of X', async () => {
		const { store } = await renderApp();
		store.dispatch(alertSlice.actions.showSuccess('Hello World'));
		expect(screen.queryByText('Success')).toBeInTheDocument();
		expect(screen.queryByText('Hello World')).toBeInTheDocument();

		const closeBtn = getCloseBtn();
		userEvent.click(closeBtn);

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

	it('shows error alert, and hides on click of X', async () => {
		const { store } = await renderApp();
		store.dispatch(alertSlice.actions.showError('Hello World'));
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

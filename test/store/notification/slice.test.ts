import { notificationSlice } from '../../../src/store/notification/slice';

describe('notification slice', () => {
	it('addSuccess', () => {
		const result = notificationSlice.reducer(
			notificationSlice.getInitialState(),
			notificationSlice.actions.addSuccess('Hello World')
		);
		expect(result).toEqual({
			notifications: [
				{
					id: expect.any(String),
					isShown: false,
					type: 'success',
					message: 'Success',
					description: 'Hello World'
				}
			]
		});
	});

	it('addError', () => {
		const result = notificationSlice.reducer(
			notificationSlice.getInitialState(),
			notificationSlice.actions.addError('Hello World')
		);
		expect(result).toEqual({
			notifications: [
				{
					id: expect.any(String),
					isShown: false,
					type: 'error',
					message: 'Error',
					description: 'Hello World'
				}
			]
		});
	});

	describe('markShown', () => {
		it('finds match', () => {
			throw new Error();
		});

		it('cannot find match', () => {
			throw new Error();
		});
	});

	describe('hide', () => {
		it('finds match', () => {
			throw new Error();
		});

		it('cannot find match', () => {
			throw new Error();
		});
	});
});

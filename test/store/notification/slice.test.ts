import {
	notificationSlice,
	Notification,
	StateType
} from '../../../src/store/notification/slice';
import { nanoid } from '@reduxjs/toolkit';

const notifications: ReadonlyArray<Notification> = [
	{
		id: nanoid(),
		isShown: false,
		type: 'success',
		message: 'Success',
		description: 'Hello World'
	}
];
const state: StateType = {
	notifications
};

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
			const result = notificationSlice.reducer(
				state,
				notificationSlice.actions.markShown(notifications[0].id)
			);
			expect(result).toEqual({
				notifications: [
					{
						...notifications[0],
						isShown: true
					}
				]
			});
		});

		it('cannot find match', () => {
			const result = notificationSlice.reducer(
				state,
				notificationSlice.actions.markShown(nanoid())
			);
			expect(result).toEqual(state);
		});
	});

	describe('hide', () => {
		it('finds match', () => {
			const result = notificationSlice.reducer(
				state,
				notificationSlice.actions.hide(notifications[0].id)
			);
			expect(result).toEqual({
				notifications: []
			});
		});

		it('cannot find match', () => {
			const result = notificationSlice.reducer(
				state,
				notificationSlice.actions.hide(nanoid())
			);
			expect(result).toEqual(state);
		});
	});
});

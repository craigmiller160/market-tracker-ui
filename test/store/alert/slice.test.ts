import {
	alertSlice,
	StateType as AlertStateType
} from '../../../src/store/alert/slice';

describe('alertSlice', () => {
	it('showSuccess', () => {
		const initState: AlertStateType = {
			...alertSlice.getInitialState(),
			type: 'error'
		};
		const result = alertSlice.reducer(
			initState,
			alertSlice.actions.showSuccess('Hello World')
		);
		expect(result).toEqual({
			show: true,
			type: 'success',
			message: 'Hello World'
		});
	});

	it('showError', () => {
		const result = alertSlice.reducer(
			alertSlice.getInitialState(),
			alertSlice.actions.showError('Hello World')
		);
		expect(result).toEqual({
			show: true,
			type: 'error',
			message: 'Hello World'
		});
	});

	it('hide', () => {
		const initState: AlertStateType = {
			...alertSlice.getInitialState(),
			show: true
		};
		const result = alertSlice.reducer(initState, alertSlice.actions.hide());
		expect(result).toEqual({
			show: false,
			type: 'success',
			message: ''
		});
	});

	it('reset', () => {
		const result = alertSlice.reducer(
			{
				show: true,
				type: 'error',
				message: 'foo'
			},
			alertSlice.actions.reset()
		);
		expect(result).toEqual(alertSlice.getInitialState());
	});
});

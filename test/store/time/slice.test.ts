import { timeSlice } from '../../../src/store/time/slice';

describe('time slice', () => {
	it('setTime', () => {
		const result = timeSlice.reducer(
			timeSlice.getInitialState(),
			timeSlice.actions.setTime('time.fiveYears')
		);
		expect(result).toEqual({
			menuKey: 'time.fiveYears',
			value: 'fiveYears'
		});
	});

	it('reset', () => {
		const result = timeSlice.reducer(
			{
				menuKey: 'abc',
				value: 'def'
			},
			timeSlice.actions.reset()
		);
		expect(result).toEqual(timeSlice.getInitialState());
	});
});

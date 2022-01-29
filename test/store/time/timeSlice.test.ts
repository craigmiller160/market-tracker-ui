import { timeSlice } from '../../../src/store/time/timeSlice';

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
});

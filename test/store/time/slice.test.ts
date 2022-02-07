import { timeSlice } from '../../../src/store/time/slice';
import { MarketTime, marketTimeToMenuKey } from '../../../src/types/MarketTime';

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
				menuKey: marketTimeToMenuKey(MarketTime.FIVE_YEARS),
				value: MarketTime.FIVE_YEARS
			},
			timeSlice.actions.reset()
		);
		expect(result).toEqual(timeSlice.getInitialState());
	});
});

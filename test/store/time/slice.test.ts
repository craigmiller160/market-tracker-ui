import { timeSlice } from '../../../src/store/time/slice';
import { MarketTime, marketTimeToMenuKey } from '../../../src/types/MarketTime';

describe('time slice', () => {
	it('setTime', () => {
		const result = timeSlice.reducer(
			timeSlice.getInitialState(),
			timeSlice.actions.setTime(
				marketTimeToMenuKey(MarketTime.FIVE_YEARS)
			)
		);
		expect(result).toEqual({
			menuKey: marketTimeToMenuKey(MarketTime.FIVE_YEARS),
			value: MarketTime.FIVE_YEARS
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

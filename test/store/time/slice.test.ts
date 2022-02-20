import { marketSettingsSlice } from '../../../src/store/marketSettings/slice';
import { MarketTime, marketTimeToMenuKey } from '../../../src/types/MarketTime';

describe('time slice', () => {
	it('setTime', () => {
		const result = marketSettingsSlice.reducer(
			marketSettingsSlice.getInitialState(),
			marketSettingsSlice.actions.setTime(
				marketTimeToMenuKey(MarketTime.FIVE_YEARS)
			)
		);
		expect(result).toEqual({
			menuKey: marketTimeToMenuKey(MarketTime.FIVE_YEARS),
			value: MarketTime.FIVE_YEARS
		});
	});

	it('reset', () => {
		const result = marketSettingsSlice.reducer(
			{
				menuKey: marketTimeToMenuKey(MarketTime.FIVE_YEARS),
				value: MarketTime.FIVE_YEARS
			},
			marketSettingsSlice.actions.reset()
		);
		expect(result).toEqual(marketSettingsSlice.getInitialState());
	});
});

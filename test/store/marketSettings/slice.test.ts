import { marketSettingsSlice } from '../../../src/store/marketSettings/slice';
import { MarketTime, marketTimeToMenuKey } from '../../../src/types/MarketTime';
import { MarketStatus } from '../../../src/types/MarketStatus';

describe('marketSettings slice', () => {
	it('setTime', () => {
		const result = marketSettingsSlice.reducer(
			{
				...marketSettingsSlice.getInitialState(),
				status: MarketStatus.OPEN
			},
			marketSettingsSlice.actions.setTime(
				marketTimeToMenuKey(MarketTime.FIVE_YEARS)
			)
		);
		expect(result).toEqual({
			time: {
				menuKey: marketTimeToMenuKey(MarketTime.FIVE_YEARS),
				value: MarketTime.FIVE_YEARS
			},
			status: MarketStatus.UNKNOWN
		});
	});

	it('reset', () => {
		const result = marketSettingsSlice.reducer(
			{
				time: {
					menuKey: marketTimeToMenuKey(MarketTime.FIVE_YEARS),
					value: MarketTime.FIVE_YEARS
				},
				status: MarketStatus.OPEN
			},
			marketSettingsSlice.actions.reset()
		);
		expect(result).toEqual(marketSettingsSlice.getInitialState());
	});

	it('setStatus', () => {
		throw new Error();
	});
});

import { marketSettingsSlice } from '../../../src/store/marketSettings/slice';
import { MarketTime, marketTimeToMenuKey } from '../../../src/types/MarketTime';
import { MarketStatus } from '../../../src/types/MarketStatus';

describe('marketSettings slice', () => {
	describe('setTime', () => {
		it('changes the time and sets status to UNKNOWN', () => {
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

		it('time value does not change, status stays the same', () => {
			const result = marketSettingsSlice.reducer(
				{
					...marketSettingsSlice.getInitialState(),
					status: MarketStatus.OPEN
				},
				marketSettingsSlice.actions.setTime(
					marketTimeToMenuKey(MarketTime.ONE_DAY)
				)
			);
			expect(result).toEqual({
				time: {
					menuKey: marketTimeToMenuKey(MarketTime.ONE_DAY),
					value: MarketTime.ONE_DAY
				},
				status: MarketStatus.OPEN
			});
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
});

import { test } from 'vitest';
import { MarketTime } from '../../../../../src/types/MarketTime';

test.each<MarketTime>([MarketTime.ONE_DAY, MarketTime.ONE_WEEK])(
	'validate mergeTotalInvestmentData',
	(time) => {
		throw new Error();
	}
);

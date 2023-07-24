import { TradierCalendar } from '../../../../src/types/tradier/calendar';
import * as Time from '@craigmiller160/ts-functions/Time';

export const defaultTradierCalendar: TradierCalendar = {
	calendar: {
		month: 0,
		year: 0,
		days: {
			day: [
				{
					date: Time.format('yyyy-MM-dd')(new Date()),
					status: 'open'
				}
			]
		}
	}
};

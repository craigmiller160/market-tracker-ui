import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import * as Option from 'fp-ts/Option';

export enum MarketTime {
	ONE_DAY = 'oneDay',
	ONE_WEEK = 'oneWeek',
	ONE_MONTH = 'oneMonth',
	THREE_MONTHS = 'threeMonths',
	ONE_YEAR = 'oneYear',
	FIVE_YEARS = 'fiveYears'
}

export const marketTimeToMenuKey = (marketTime: MarketTime): string =>
	`time.${marketTime}`;

export const menuKeyToMarketTime = (menuKey: string): MarketTime =>
	pipe(
		menuKey.split('.'),
		RArray.lookup(1),
		Option.chain((key) =>
			pipe(
				Object.entries(MarketTime),
				// eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
				RArray.findFirst(([, value]) => value === key)
			)
		),
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		Option.map(([key]) => MarketTime[key] as string),
		Option.getOrElse(() => {
			throw new Error(
				`Critical error, invalid menu key for MarketTime: ${menuKey}`
			);
		})
	);

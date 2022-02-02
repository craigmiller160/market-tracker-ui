import { pipe } from 'fp-ts/es6/function';
import * as Time from '@craigmiller160/ts-functions/es/Time';

const HISTORY_DATE_FORMAT = 'yyyy-MM-dd';
export const formatHistoryDate = Time.format(HISTORY_DATE_FORMAT);

const getHistoryStartDate = (intervalFn: (d: Date) => Date): string =>
	pipe(new Date(), intervalFn, formatHistoryDate);

export const getOneWeekHistoryStartDate = (): string =>
	getHistoryStartDate(Time.subDays(6));

export const getOneMonthHistoryStartDate = (): string =>
	getHistoryStartDate(Time.subMonths(1));

export const getThreeMonthHistoryStartDate = (): string =>
	getHistoryStartDate(Time.subMonths(3));

export const getOneYearHistoryStartDate = (): string =>
	getHistoryStartDate(Time.subYears(1));

export const getFiveYearHistoryStartDate = (): string =>
	getHistoryStartDate(Time.subYears(5));

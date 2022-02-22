import { flow, pipe } from 'fp-ts/es6/function';
import * as Time from '@craigmiller160/ts-functions/es/Time';

export const HISTORY_DATE_FORMAT = 'yyyy-MM-dd';
const TIMESALES_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";
const DISPLAY_DATE_FORMAT = 'MMM dd, yyyy';
export const formatHistoryDate = Time.format(HISTORY_DATE_FORMAT);
export const formatDisplayDate = Time.format(DISPLAY_DATE_FORMAT);
const formatInEST = Time.formatTZ('America/New_York');
export const formatTimesalesDate = formatInEST(TIMESALES_FORMAT);
// TODO much better but won't handle daylight savings time changes
export const setTodayStartTime: (d: Date) => Date = Time.setUtc({
	hours: 5,
	minutes: 0,
	seconds: 0,
	milliseconds: 0
});
// TODO much better but won't handle daylight savings time changes
export const setTodayEndTime: (d: Date) => Date = flow(
	Time.setUtc({
		hours: 4,
		minutes: 0,
		seconds: 0,
		milliseconds: 0
	}),
	Time.addDays(1)
);

const getStartDate = (intervalFn: (d: Date) => Date): Date =>
	pipe(new Date(), intervalFn, Time.addDays(1));

const getHistoryStartDate = (intervalFn: (d: Date) => Date): string =>
	pipe(getStartDate(intervalFn), formatHistoryDate);

const getDisplayStartDate = (intervalFn: (d: Date) => Date): string =>
	pipe(getStartDate(intervalFn), formatDisplayDate);

export const getTodayHistoryDate = (): string => formatHistoryDate(new Date());

export const getTodayDisplayDate = (): string => formatDisplayDate(new Date());

export const getTodayStart = (): string =>
	pipe(new Date(), setTodayStartTime, formatTimesalesDate);

export const getTodayEnd = (): string =>
	pipe(new Date(), setTodayEndTime, formatTimesalesDate);

export const getOneWeekHistoryStartDate = (): string =>
	getHistoryStartDate(Time.subWeeks(1));

export const getOneWeekDisplayStartDate = (): string =>
	getDisplayStartDate(Time.subWeeks(1));

export const getOneMonthHistoryStartDate = (): string =>
	getHistoryStartDate(Time.subMonths(1));

export const getOneMonthDisplayStartDate = (): string =>
	getDisplayStartDate(Time.subMonths(1));

export const getThreeMonthHistoryStartDate = (): string =>
	getHistoryStartDate(Time.subMonths(3));

export const getThreeMonthDisplayStartDate = (): string =>
	getDisplayStartDate(Time.subMonths(3));

export const getOneYearHistoryStartDate = (): string =>
	getHistoryStartDate(Time.subYears(1));

export const getOneYearDisplayStartDate = (): string =>
	getDisplayStartDate(Time.subYears(1));

export const getFiveYearHistoryStartDate = (): string =>
	getHistoryStartDate(Time.subYears(5));

export const getFiveYearDisplayStartDate = (): string =>
	getDisplayStartDate(Time.subYears(5));

import { flow, pipe } from 'fp-ts/function';
import * as Time from '@craigmiller160/ts-functions/es/Time';

export const HISTORY_DATE_FORMAT = 'yyyy-MM-dd';
const TIMESALES_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";
const DISPLAY_DATE_FORMAT = 'MMM dd, yyyy';
export const formatHistoryDate = Time.format(HISTORY_DATE_FORMAT);
export const formatDisplayDate = Time.format(DISPLAY_DATE_FORMAT);
const formatInEST = Time.formatTZ('America/New_York');
export const formatTimesalesDate = formatInEST(TIMESALES_FORMAT);
export const setTodayStartTime: (d: Date) => Date = Time.set({
	hours: 0,
	minutes: 0,
	seconds: 0,
	milliseconds: 0
});
export const setTodayEndTime: (d: Date) => Date = flow(
	Time.set({
		hours: 23,
		minutes: 0,
		seconds: 0,
		milliseconds: 0
	})
);

export const getTodayHistoryDate = (): string => formatHistoryDate(new Date());

export const getTodayDisplayDate = (): string => formatDisplayDate(new Date());

export const getTodayStart = (): Date => setTodayStartTime(new Date());
export const getTodayStartString = (): string =>
	pipe(getTodayStart(), formatTimesalesDate);

export const getTodayEnd = (): Date => setTodayEndTime(new Date());
export const getTodayEndString = (): string =>
	pipe(getTodayEnd(), formatTimesalesDate);

export const getOneWeekStartDate = (): Date => Time.subWeeks(1)(new Date());

export const getOneWeekHistoryStartDate = (): string =>
	pipe(getOneWeekStartDate(), formatHistoryDate);

export const getOneWeekDisplayStartDate = (): string =>
	pipe(getOneWeekStartDate(), formatDisplayDate);

export const getOneMonthStartDate = (): Date => Time.subMonths(1)(new Date());

export const getOneMonthHistoryStartDate = (): string =>
	pipe(getOneMonthStartDate(), formatHistoryDate);

export const getOneMonthDisplayStartDate = (): string =>
	pipe(getOneMonthStartDate(), formatDisplayDate);

export const getThreeMonthStartDate = (): Date => Time.subMonths(3)(new Date());

export const getThreeMonthHistoryStartDate = (): string =>
	pipe(getThreeMonthStartDate(), formatHistoryDate);

export const getThreeMonthDisplayStartDate = (): string =>
	pipe(getThreeMonthStartDate(), formatDisplayDate);

export const getOneYearStartDate = (): Date => Time.subYears(1)(new Date());

export const getOneYearHistoryStartDate = (): string =>
	pipe(getOneYearStartDate(), formatHistoryDate);

export const getOneYearDisplayStartDate = (): string =>
	pipe(getOneYearStartDate(), formatDisplayDate);

export const getFiveYearStartDate = (): Date => Time.subYears(5)(new Date());

export const getFiveYearHistoryStartDate = (): string =>
	pipe(getFiveYearStartDate(), formatHistoryDate);

export const getFiveYearDisplayStartDate = (): string =>
	pipe(getFiveYearStartDate(), formatDisplayDate);

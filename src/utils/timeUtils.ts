import { pipe } from 'fp-ts/es6/function';
import * as Time from '@craigmiller160/ts-functions/es/Time';

const HISTORY_DATE_FORMAT = 'yyyy-MM-dd';
const TIMESALES_FORMAT = 'yyyy-MM-dd HH:mm';
const DISPLAY_DATE_FORMAT = 'MMM dd, yyyy';
export const formatHistoryDate = Time.format(HISTORY_DATE_FORMAT);
export const formatDisplayDate = Time.format(DISPLAY_DATE_FORMAT);
export const formatTimesalesDate = Time.format(TIMESALES_FORMAT);

const getStartDate = (intervalFn: (d: Date) => Date): Date =>
	pipe(new Date(), intervalFn, Time.addDays(1));

const getHistoryStartDate = (intervalFn: (d: Date) => Date): string =>
	pipe(getStartDate(intervalFn), formatHistoryDate);

const getDisplayStartDate = (intervalFn: (d: Date) => Date): string =>
	pipe(getStartDate(intervalFn), formatDisplayDate);

export const getTodayHistoryDate = (): string => formatHistoryDate(new Date());

export const getTodayDisplayDate = (): string => formatDisplayDate(new Date());

export const getTodayTimesalesDate = (): string =>
	formatTimesalesDate(new Date());

export const getTomorrowTimesalesDate = (): string =>
	pipe(new Date(), Time.addDays(1), formatTimesalesDate);

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

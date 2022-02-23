import {
	formatDisplayDate,
	formatHistoryDate,
	formatTimesalesDate,
	getFiveYearDisplayStartDate,
	getFiveYearHistoryStartDate,
	getOneMonthDisplayStartDate,
	getOneMonthHistoryStartDate,
	getOneWeekDisplayStartDate,
	getOneWeekHistoryStartDate,
	getOneYearDisplayStartDate,
	getOneYearHistoryStartDate,
	getThreeMonthDisplayStartDate,
	getThreeMonthHistoryStartDate,
	getTodayEnd,
	getTodayStart,
	getTodayDisplayDate,
	getTodayHistoryDate,
	setTodayEndTime,
	setTodayStartTime,
	getTodayStartString,
	getTodayEndString,
	getOneWeekStartDate,
	getOneMonthStartDate,
	getThreeMonthStartDate,
	getOneYearStartDate,
	getFiveYearStartDate
} from '../../src/utils/timeUtils';
import { pipe } from 'fp-ts/es6/function';
import * as Time from '@craigmiller160/ts-functions/es/Time';

const compareFormat = Time.format('yyyy-MM-dd HH:mm:ss');

describe('timeUtils', () => {
	it('setTodayStartTime', () => {
		const date = new Date();
		const actual = setTodayStartTime(date);
		const actualText = Time.format('yyyy-MM-dd HH:mm:ss')(actual);
		const expectedTextDate = Time.format('yyyy-MM-dd')(date);
		expect(actualText).toEqual(`${expectedTextDate} 00:00:00`);
	});

	it('setTodayEndTime', () => {
		const date = new Date();
		const actual = setTodayEndTime(date);
		const actualText = Time.format('yyyy-MM-dd HH:mm:ss')(actual);
		const expectedTextDate = Time.format('yyyy-MM-dd')(date);
		expect(actualText).toEqual(`${expectedTextDate} 23:00:00`);
	});

	it('getTodayHistoryDate', () => {
		const expected = formatHistoryDate(new Date());
		const actual = getTodayHistoryDate();
		expect(actual).toEqual(expected);
	});

	it('getTodayDisplayDate', () => {
		const expected = formatDisplayDate(new Date());
		const actual = getTodayDisplayDate();
		expect(actual).toEqual(expected);
	});

	it('getOneWeekStartDate', () => {
		const expected = pipe(new Date(), Time.subWeeks(1));
		const actual = getOneWeekStartDate();
		expect(compareFormat(actual)).toEqual(compareFormat(expected));
	});

	it('getOneWeekHistoryStartDate', () => {
		const expected = pipe(new Date(), Time.subWeeks(1), formatHistoryDate);
		const actual = getOneWeekHistoryStartDate();
		expect(actual).toEqual(expected);
	});

	it('getOneWeekDisplayStartDate', () => {
		const expected = pipe(new Date(), Time.subWeeks(1), formatDisplayDate);
		const actual = getOneWeekDisplayStartDate();
		expect(actual).toEqual(expected);
	});

	it('getOneMonthStartDate', () => {
		const expected = pipe(new Date(), Time.subMonths(1));
		const actual = getOneMonthStartDate();
		expect(compareFormat(actual)).toEqual(compareFormat(expected));
	});

	it('getOneMonthHistoryStartDate', () => {
		const expected = pipe(new Date(), Time.subMonths(1), formatHistoryDate);
		const actual = getOneMonthHistoryStartDate();
		expect(actual).toEqual(expected);
	});

	it('getOneMonthDisplayStartDate', () => {
		const expected = pipe(new Date(), Time.subMonths(1), formatDisplayDate);
		const actual = getOneMonthDisplayStartDate();
		expect(actual).toEqual(expected);
	});

	it('getThreeMonthStartDate', () => {
		const expected = pipe(new Date(), Time.subMonths(3));
		const actual = getThreeMonthStartDate();
		expect(actual).toEqual(expected);
	});

	it('getThreeMonthHistoryStartDate', () => {
		const expected = pipe(new Date(), Time.subMonths(3), formatHistoryDate);
		const actual = getThreeMonthHistoryStartDate();
		expect(actual).toEqual(expected);
	});

	it('getThreeMonthDisplayStartDate', () => {
		const expected = pipe(new Date(), Time.subMonths(3), formatDisplayDate);
		const actual = getThreeMonthDisplayStartDate();
		expect(actual).toEqual(expected);
	});

	it('getOneYearStartDate', () => {
		const expected = pipe(new Date(), Time.subYears(1));
		const actual = getOneYearStartDate();
		expect(actual).toEqual(expected);
	});

	it('getOneYearHistoryStartDate', () => {
		const expected = pipe(new Date(), Time.subYears(1), formatHistoryDate);
		const actual = getOneYearHistoryStartDate();
		expect(actual).toEqual(expected);
	});

	it('getOneYearDisplayStartDate', () => {
		const expected = pipe(new Date(), Time.subYears(1), formatDisplayDate);
		const actual = getOneYearDisplayStartDate();
		expect(actual).toEqual(expected);
	});

	it('getFiveYearStartDate', () => {
		const expected = pipe(new Date(), Time.subYears(5));
		const actual = getFiveYearStartDate();
		expect(actual).toEqual(expected);
	});

	it('getFiveYearHistoryStartDate', () => {
		const expected = pipe(new Date(), Time.subYears(5), formatHistoryDate);
		const actual = getFiveYearHistoryStartDate();
		expect(actual).toEqual(expected);
	});

	it('getFiveYearDisplayStartDate', () => {
		const expected = pipe(new Date(), Time.subYears(5), formatDisplayDate);
		const actual = getFiveYearDisplayStartDate();
		expect(actual).toEqual(expected);
	});

	it('getTodayStart', () => {
		const expected = pipe(
			new Date(),
			Time.set({
				hours: 0,
				minutes: 0,
				seconds: 0,
				milliseconds: 0
			})
		);
		const actual = getTodayStart();
		expect(actual).toEqual(expected);
	});

	it('getTodayStartString', () => {
		const expected = pipe(
			new Date(),
			Time.set({
				hours: 0,
				minutes: 0,
				seconds: 0,
				milliseconds: 0
			}),
			formatTimesalesDate
		);
		const actual = getTodayStartString();
		expect(actual).toEqual(expected);
	});

	it('getTodayEnd', () => {
		const expected = pipe(
			new Date(),
			Time.set({
				hours: 23,
				minutes: 0,
				seconds: 0,
				milliseconds: 0
			})
		);
		const actual = getTodayEnd();
		expect(actual).toEqual(expected);
	});

	it('getTodayEndString', () => {
		const expected = pipe(
			new Date(),
			Time.set({
				hours: 23,
				minutes: 0,
				seconds: 0,
				milliseconds: 0
			}),
			formatTimesalesDate
		);
		const actual = getTodayEndString();
		expect(actual).toEqual(expected);
	});
});

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
	setTodayStartTime
} from '../../src/utils/timeUtils';
import { flow, pipe } from 'fp-ts/es6/function';
import * as Time from '@craigmiller160/ts-functions/es/Time';

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

	it('getOneWeekHistoryStartDate', () => {
		const expected = pipe(
			new Date(),
			flow(Time.subWeeks(1), Time.addDays(1)),
			formatHistoryDate
		);
		const actual = getOneWeekHistoryStartDate();
		expect(actual).toEqual(expected);
	});

	it('getOneWeekDisplayStartDate', () => {
		const expected = pipe(
			new Date(),
			flow(Time.subWeeks(1), Time.addDays(1)),
			formatDisplayDate
		);
		const actual = getOneWeekDisplayStartDate();
		expect(actual).toEqual(expected);
	});

	it('getOneMonthHistoryStartDate', () => {
		const expected = pipe(
			new Date(),
			flow(Time.subMonths(1), Time.addDays(1)),
			formatHistoryDate
		);
		const actual = getOneMonthHistoryStartDate();
		expect(actual).toEqual(expected);
	});

	it('getOneMonthDisplayStartDate', () => {
		const expected = pipe(
			new Date(),
			flow(Time.subMonths(1), Time.addDays(1)),
			formatDisplayDate
		);
		const actual = getOneMonthDisplayStartDate();
		expect(actual).toEqual(expected);
	});

	it('getThreeMonthHistoryStartDate', () => {
		const expected = pipe(
			new Date(),
			flow(Time.subMonths(3), Time.addDays(1)),
			formatHistoryDate
		);
		const actual = getThreeMonthHistoryStartDate();
		expect(actual).toEqual(expected);
	});

	it('getThreeMonthDisplayStartDate', () => {
		const expected = pipe(
			new Date(),
			flow(Time.subMonths(3), Time.addDays(1)),
			formatDisplayDate
		);
		const actual = getThreeMonthDisplayStartDate();
		expect(actual).toEqual(expected);
	});

	it('getOneYearHistoryStartDate', () => {
		const expected = pipe(
			new Date(),
			flow(Time.subYears(1), Time.addDays(1)),
			formatHistoryDate
		);
		const actual = getOneYearHistoryStartDate();
		expect(actual).toEqual(expected);
	});

	it('getOneYearDisplayStartDate', () => {
		const expected = pipe(
			new Date(),
			flow(Time.subYears(1), Time.addDays(1)),
			formatDisplayDate
		);
		const actual = getOneYearDisplayStartDate();
		expect(actual).toEqual(expected);
	});

	it('getFiveYearHistoryStartDate', () => {
		const expected = pipe(
			new Date(),
			flow(Time.subYears(5), Time.addDays(1)),
			formatHistoryDate
		);
		const actual = getFiveYearHistoryStartDate();
		expect(actual).toEqual(expected);
	});

	it('getFiveYearDisplayStartDate', () => {
		const expected = pipe(
			new Date(),
			flow(Time.subYears(5), Time.addDays(1)),
			formatDisplayDate
		);
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
			}),
			formatTimesalesDate
		);
		const actual = getTodayStart();
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
			}),
			formatTimesalesDate
		);
		const actual = getTodayEnd();
		expect(actual).toEqual(expected);
	});
});

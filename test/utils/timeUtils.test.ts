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
import { pipe, identity } from 'fp-ts/es6/function';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { match } from 'ts-pattern';

const compareFormat = Time.format('yyyy-MM-dd HH:mm:ss');
const UTC_OFFSET_4 = 240;
const UTC_OFFSET_5 = 300;

describe('timeUtils', () => {
	it('setTodayStartTime', () => {
		const date = new Date();
		const actual = setTodayStartTime(date);
		const actualText = compareFormat(actual);
		const expectedTextDate = Time.format('yyyy-MM-dd')(date);

		const expectedTime = match(date.getTimezoneOffset())
			.with(UTC_OFFSET_4, () => '01:00:00')
			.with(UTC_OFFSET_5, () => '00:00:00')
			.run();

		expect(actualText).toEqual(`${expectedTextDate} ${expectedTime}`);
	});

	it('setTodayEndTime', () => {
		const date = new Date();
		const actual = setTodayEndTime(date);
		const actualText = compareFormat(actual);

		const [expectedDate, expectedTime] = match(date.getTimezoneOffset())
			.with(UTC_OFFSET_4, () => {
				const dateText = pipe(
					date,
					Time.addDays(1),
					Time.format('yyyy-MM-dd')
				);
				return [dateText, '00:00:00'];
			})
			.run();

		expect(actualText).toEqual(`${expectedDate} ${expectedTime}`);
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
		expect(compareFormat(actual)).toEqual(compareFormat(expected));
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
		expect(compareFormat(actual)).toEqual(compareFormat(expected));
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
		expect(compareFormat(actual)).toEqual(compareFormat(expected));
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
		const expectedHours = match(new Date().getTimezoneOffset())
			.with(UTC_OFFSET_4, () => 1)
			.run();

		const expected = pipe(
			new Date(),
			Time.set({
				hours: expectedHours,
				minutes: 0,
				seconds: 0,
				milliseconds: 0
			})
		);
		const actual = getTodayStart();
		expect(compareFormat(actual)).toEqual(compareFormat(expected));
	});

	it('getTodayStartString', () => {
		const expectedHours = match(new Date().getTimezoneOffset())
			.with(UTC_OFFSET_4, () => 1)
			.run();
		const expected = pipe(
			new Date(),
			Time.set({
				hours: expectedHours,
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
		const adjustDate: (d: Date) => Date = match(
			new Date().getTimezoneOffset()
		)
			.with(UTC_OFFSET_4, () => Time.addDays(1))
			.otherwise(() => identity);
		const expectedHours = match(new Date().getTimezoneOffset())
			.with(UTC_OFFSET_4, () => 0)
			.run();

		const expected = pipe(
			new Date(),
			adjustDate,
			Time.set({
				hours: expectedHours,
				minutes: 0,
				seconds: 0,
				milliseconds: 0
			})
		);
		const actual = getTodayEnd();
		expect(compareFormat(actual)).toEqual(compareFormat(expected));
	});

	it('getTodayEndString', () => {
		const adjustDate: (d: Date) => Date = match(
			new Date().getTimezoneOffset()
		)
			.with(UTC_OFFSET_4, () => Time.addDays(1))
			.otherwise(() => identity);
		const expectedHours = match(new Date().getTimezoneOffset())
			.with(UTC_OFFSET_4, () => 0)
			.run();

		const expected = pipe(
			new Date(),
			adjustDate,
			Time.set({
				hours: expectedHours,
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

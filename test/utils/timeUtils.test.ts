import {
	formatHistoryDate,
	getFiveYearHistoryStartDate,
	getOneMonthHistoryStartDate,
	getOneWeekHistoryStartDate,
	getOneYearHistoryStartDate,
	getThreeMonthHistoryStartDate,
	getTodayHistoryStartDate
} from '../../src/utils/timeUtils';
import { flow, pipe } from 'fp-ts/es6/function';
import * as Time from '@craigmiller160/ts-functions/es/Time';

describe('timeUtils', () => {
	it('getTodayHistoryStartDate', () => {
		const expected = formatHistoryDate(new Date());
		const actual = getTodayHistoryStartDate();
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

	it('getOneMonthHistoryStartDate', () => {
		const expected = pipe(
			new Date(),
			flow(Time.subMonths(1), Time.addDays(1)),
			formatHistoryDate
		);
		const actual = getOneMonthHistoryStartDate();
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

	it('getOneYearHistoryStartDate', () => {
		const expected = pipe(
			new Date(),
			flow(Time.subYears(1), Time.addDays(1)),
			formatHistoryDate
		);
		const actual = getOneYearHistoryStartDate();
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
});

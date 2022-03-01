import marketDataJson from './marketsPageInvestments.json';
import altInvestmentIdsJson from './altInvestmentIds.json';
import {
	MarketInvestmentInfo,
	MarketInvestmentInfoArray,
	marketInvestmentInfoArrayV
} from '../types/data/MarketInvestmentInfo';
import { pipe } from 'fp-ts/es6/function';
import * as TypeValidation from '@craigmiller160/ts-functions/es/TypeValidation';
import { MonoidT, TryT } from '@craigmiller160/ts-functions/es/types';
import * as Monoid from 'fp-ts/es6/Monoid';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import { match } from 'ts-pattern';
import * as Either from 'fp-ts/es6/Either';
import { MarketInvestmentType } from '../types/data/MarketInvestmentType';
import {
	AltInvestmentIds,
	altInvestmentIdsV
} from '../types/data/AltInvestmentIds';

export type InvestmentsByType = {
	[key in MarketInvestmentType]: MarketInvestmentInfoArray;
};

export const allMarketInvestmentInfo: TryT<MarketInvestmentInfoArray> =
	TypeValidation.decode(marketInvestmentInfoArrayV)(marketDataJson);
export const altInvestmentIds: TryT<AltInvestmentIds> =
	TypeValidation.decode(altInvestmentIdsV)(altInvestmentIdsJson);

const groupByTypeMonoid: MonoidT<InvestmentsByType> = {
	empty: {
		[MarketInvestmentType.USA_ETF]: [],
		[MarketInvestmentType.INTERNATIONAL_ETF]: [],
		[MarketInvestmentType.CRYPTO]: []
	},
	concat: (invest1, invest2) => ({
		[MarketInvestmentType.USA_ETF]: invest1[
			MarketInvestmentType.USA_ETF
		].concat(invest2[MarketInvestmentType.USA_ETF]),
		[MarketInvestmentType.INTERNATIONAL_ETF]: invest1[
			MarketInvestmentType.INTERNATIONAL_ETF
		].concat(invest2[MarketInvestmentType.INTERNATIONAL_ETF]),
		[MarketInvestmentType.CRYPTO]: invest1[
			MarketInvestmentType.CRYPTO
		].concat(invest2[MarketInvestmentType.CRYPTO])
	})
};

const createInvestmentsByType = (
	usaEtfs: ReadonlyArray<MarketInvestmentInfo>,
	intEtfs: ReadonlyArray<MarketInvestmentInfo>,
	crypto: ReadonlyArray<MarketInvestmentInfo>
): InvestmentsByType => ({
	[MarketInvestmentType.USA_ETF]: usaEtfs,
	[MarketInvestmentType.INTERNATIONAL_ETF]: intEtfs,
	[MarketInvestmentType.CRYPTO]: crypto
});

const infoToInvestmentByType = (
	info: MarketInvestmentInfo
): InvestmentsByType =>
	match(info)
		.with({ type: MarketInvestmentType.USA_ETF }, (_) =>
			createInvestmentsByType([_], [], [])
		)
		.with({ type: MarketInvestmentType.INTERNATIONAL_ETF }, (_) =>
			createInvestmentsByType([], [_], [])
		)
		.with({ type: MarketInvestmentType.CRYPTO }, (_) =>
			createInvestmentsByType([], [], [_])
		)
		.run();

const groupInvestmentsByType = (
	infoArray: MarketInvestmentInfoArray
): InvestmentsByType =>
	pipe(
		infoArray,
		RArray.map(infoToInvestmentByType),
		Monoid.concatAll(groupByTypeMonoid)
	);

export const marketInvestmentsByType: TryT<InvestmentsByType> = pipe(
	allMarketInvestmentInfo,
	Either.map(groupInvestmentsByType)
);

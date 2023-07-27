import marketDataJson from './marketsPageInvestments.json';
import altInvestmentIdsJson from './altInvestmentIds.json';
import {
	MarketInvestmentInfo,
	MarketInvestmentInfoArray,
	marketInvestmentInfoArrayV
} from '../types/data/MarketInvestmentInfo';
import { pipe } from 'fp-ts/function';
import * as TypeValidation from '@craigmiller160/ts-functions/TypeValidation';
import { MonoidT, TryT } from '@craigmiller160/ts-functions/types';
import * as Monoid from 'fp-ts/Monoid';
import * as RArray from 'fp-ts/ReadonlyArray';
import { match } from 'ts-pattern';
import * as Either from 'fp-ts/Either';
import * as Option from 'fp-ts/Option';
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
		.with({ marketType: MarketInvestmentType.USA_ETF }, (_) =>
			createInvestmentsByType([_], [], [])
		)
		.with({ marketType: MarketInvestmentType.INTERNATIONAL_ETF }, (_) =>
			createInvestmentsByType([], [_], [])
		)
		.with({ marketType: MarketInvestmentType.CRYPTO }, (_) =>
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

export const getAltIdForSymbol = (symbol: string): TryT<string> =>
	pipe(
		altInvestmentIds,
		Either.map((altIds) => altIds.symbolToId[symbol]),
		Either.map(Option.fromNullable),
		Either.map(Option.getOrElse(() => symbol))
	);

export const getSymbolForAltId = (id: string): TryT<string> =>
	pipe(
		altInvestmentIds,
		Either.map((altIds) => altIds.idToSymbol[id]),
		Either.map(Option.fromNullable),
		Either.map(Option.getOrElse(() => id))
	);

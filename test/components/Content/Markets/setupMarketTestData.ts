/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CoinGeckoMarketChart } from '../../../../src/types/coingecko/marketchart';
import { CoinGeckoPrice } from '../../../../src/types/coingecko/price';
import MockAdapter from 'axios-mock-adapter';
import { MarketInvestmentInfo } from '../../../../src/types/data/MarketInvestmentInfo';
import { MarketTime } from '../../../../src/types/MarketTime';
import { TradierCalendarStatus } from '../../../../src/types/tradier/calendar';
import * as Try from '@craigmiller160/ts-functions/es/Try';
import { match, P } from 'ts-pattern';
import { PredicateT } from '@craigmiller160/ts-functions/es/types';
import { getTodayEnd } from '../../../../src/utils/timeUtils';
import { pipe } from 'fp-ts/function';
import { getAltIdForSymbol } from '../../../../src/data/MarketPageInvestmentParsing';
import { isCrypto, isStock } from '../../../../src/types/data/InvestmentType';
import {
	BASE_HISTORY_1_PRICE,
	BASE_HISTORY_2_PRICE,
	BASE_LAST_PRICE,
	getHistoryStart,
	mockCalenderRequest,
	mockTradierHistoryRequest,
	mockTradierQuoteRequest,
	mockTradierTimesaleRequest
} from '../../../testutils/testDataUtils';

const createCoinGeckoMarketChart = (
	modifier: number
): CoinGeckoMarketChart => ({
	prices: [
		[new Date().getTime(), BASE_HISTORY_1_PRICE + modifier],
		[new Date().getTime(), BASE_HISTORY_2_PRICE + modifier]
	]
});

const createCoinGeckoPrice = (
	id: string,
	modifier: number
): CoinGeckoPrice => ({
	[id]: {
		usd: BASE_LAST_PRICE + modifier
	}
});

export interface MockApiConfig {
	readonly time: MarketTime;
	readonly status?: TradierCalendarStatus;
	readonly tradierTimesaleBaseMillis?: number;
}

const isStockInfo: PredicateT<MarketInvestmentInfo> = (info) =>
	isStock(info.type);
const isCryptoInfo: PredicateT<MarketInvestmentInfo> = (info) =>
	isCrypto(info.type);
const isNotToday: PredicateT<MarketTime> = (time) =>
	MarketTime.ONE_DAY !== time;
const isToday: PredicateT<MarketTime> = (time) => MarketTime.ONE_DAY === time;

const mockCoinGeckoPriceRequest = (
	mockApi: MockAdapter,
	symbol: string,
	modifier: number
) => {
	const id = pipe(getAltIdForSymbol(symbol), Try.getOrThrow);
	mockApi
		.onGet(`/coingecko/simple/price?ids=${id}&vs_currencies=usd`)
		.reply(200, createCoinGeckoPrice(id, modifier));
};

const millisToSecs = (millis: number): number => millis / 1000;

const mockCoinGeckoHistoryRequest = (
	mockApi: MockAdapter,
	symbol: string,
	time: MarketTime,
	modifier: number
) => {
	const id = pipe(getAltIdForSymbol(symbol), Try.getOrThrow);
	const startSecs = pipe(
		getHistoryStart(time).getTime(),
		millisToSecs,
		Math.floor
	).toString();
	const endSecs = pipe(
		getTodayEnd().getTime(),
		millisToSecs,
		Math.floor
	).toString();

	const startPattern = `${startSecs.substring(0, 8)}\\d\\d`;
	const endPattern = `${endSecs.substring(0, 8)}\\d\\d`;

	const urlPattern = RegExp(
		`\\/coingecko\\/coins\\/${id}\\/market_chart\\/range\\?vs_currency=usd&from=${startPattern}&to=${endPattern}`
	);

	mockApi.onGet(urlPattern).reply(200, createCoinGeckoMarketChart(modifier));
};

export const createSetupMockApiCalls =
	(
		mockApi: MockAdapter,
		investmentInfo: ReadonlyArray<MarketInvestmentInfo>
	) =>
	(config: MockApiConfig) => {
		mockCalenderRequest(mockApi, config.status ?? 'open');

		investmentInfo.forEach((info, index) => {
			match({ info, time: config.time })
				.with(
					{ info: P.when(isStockInfo), time: P.when(isNotToday) },
					() => {
						mockTradierQuoteRequest(mockApi, info.symbol, index);
						mockTradierHistoryRequest(
							mockApi,
							info.symbol,
							config.time,
							index
						);
					}
				)
				.with(
					{ info: P.when(isStockInfo), time: P.when(isToday) },
					() => {
						mockTradierQuoteRequest(mockApi, info.symbol, index);
						mockTradierTimesaleRequest(
							mockApi,
							info.symbol,
							index,
							config.tradierTimesaleBaseMillis
						);
					}
				)
				.with({ info: P.when(isCryptoInfo) }, () => {
					mockCoinGeckoPriceRequest(mockApi, info.symbol, index);
					mockCoinGeckoHistoryRequest(
						mockApi,
						info.symbol,
						config.time,
						index
					);
				})
				.run();
		});
	};

import { TradierQuotes } from '../../../../src/types/tradier/quotes';
import { TradierHistory } from '../../../../src/types/tradier/history';
import { TradierSeries } from '../../../../src/types/tradier/timesales';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { CoinGeckoMarketChart } from '../../../../src/types/coingecko/marketchart';
import { CoinGeckoPrice } from '../../../../src/types/coingecko/price';

const TIMESTAMP_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";
const formatTimestamp = Time.format(TIMESTAMP_FORMAT);

const createTradierQuote = (
	symbol: string,
	modifier: number
): TradierQuotes => ({
	quotes: {
		quote: {
			symbol,
			description: '',
			open: 0,
			high: 0,
			low: 0,
			bid: 0,
			ask: 0,
			close: 0,
			last: 100 + modifier,
			prevclose: 30 + modifier
		}
	}
});

const createTradierHistory = (modifier: number): TradierHistory => ({
	history: {
		day: [
			{
				date: '2022-01-01',
				open: 50 + modifier,
				high: 0,
				low: 0,
				close: 0
			}
		]
	}
});

const createTradierTimesale = (
	modifier: number,
	timestampMillis: number = new Date().getTime()
): TradierSeries => {
	const secondTimestampMillis = timestampMillis + 60_000;
	const firstTime = formatTimestamp(new Date(timestampMillis));
	const secondTime = formatTimestamp(new Date(secondTimestampMillis));
	return {
		series: {
			data: [
				{
					time: firstTime,
					timestamp: timestampMillis,
					price: 40 + modifier,
					open: 0,
					high: 0,
					low: 0,
					close: 0,
					volume: 0,
					vwap: 0
				},
				{
					time: secondTime,
					timestamp: secondTimestampMillis,
					price: 45 + modifier,
					open: 0,
					high: 0,
					low: 0,
					close: 0,
					volume: 0,
					vwap: 0
				}
			]
		}
	};
};

const createCoinGeckoMarketChart = (
	modifier: number
): CoinGeckoMarketChart => ({
	prices: [[new Date().getTime(), 50 + modifier]]
});

const createCoinGeckoPrice = (id: string, modifier: number): CoinGeckoPrice => ({
	[id]: {
		usd: 100 + modifier
	}
})
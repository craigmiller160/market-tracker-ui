import { TradierQuotes } from '../../../../src/types/tradier/quotes';
import { TradierHistory } from '../../../../src/types/tradier/history';
import { TradierSeries } from '../../../../src/types/tradier/timesales';

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

const createTradierTimesale = (modifier: number): TradierSeries => ({
	series: {
		data: [
			{
				time: '2022-01-01T01:00:00',
				timestamp: timestamp > 0 ? timestamp - 100 : timestamp,
				price: 40 + modifier,
				open: 0,
				high: 0,
				low: 0,
				close: 0,
				volume: 0,
				vwap: 0
			},
			{
				time: '2022-01-01T01:01:01',
				timestamp: timestamp > 0 ? timestamp - 100 : timestamp,
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
})

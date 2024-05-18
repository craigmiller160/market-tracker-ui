import { test } from 'vitest';
import { server } from '../testutils/msw-server';

/*
 * https://localhost:3000/market-tracker/api/tradier/markets/quotes?symbols=VTI,VXUS
 * {
    "quotes": {
        "quote": [
            {
                "symbol": "VTI",
                "description": "Vanguard Total Stock Market ETF",
                "exch": "P",
                "type": "etf",
                "last": 262.3,
                "change": 0.37,
                "volume": 2208726,
                "open": 262.15,
                "high": 262.3,
                "low": 261.24,
                "close": 262.3,
                "bid": 262.2,
                "ask": 262.5,
                "change_percentage": 0.15,
                "average_volume": 2996596,
                "last_volume": 0,
                "trade_date": 1715990400003,
                "prevclose": 261.93,
                "week_52_high": 263.28,
                "week_52_low": 202.44,
                "bidsize": 1,
                "bidexch": "P",
                "bid_date": 1715990264000,
                "asksize": 7,
                "askexch": "P",
                "ask_date": 1715989598000,
                "root_symbols": "VTI"
            },
            {
                "symbol": "VXUS",
                "description": "Vanguard Total International Stock ETF",
                "exch": "Q",
                "type": "etf",
                "last": 62.21,
                "change": 0.27,
                "volume": 3793677,
                "open": 61.99,
                "high": 62.24,
                "low": 61.92,
                "close": 62.21,
                "bid": 61.59,
                "ask": 62.25,
                "change_percentage": 0.44,
                "average_volume": 3231428,
                "last_volume": 0,
                "trade_date": 1715976900013,
                "prevclose": 61.94,
                "week_52_high": 62.24,
                "week_52_low": 50.95,
                "bidsize": 1,
                "bidexch": "Q",
                "bid_date": 1715976019000,
                "asksize": 1,
                "askexch": "P",
                "ask_date": 1715977370000,
                "root_symbols": "VXUS"
            }
        ]
    }
}
*
*
 */

beforeEach(() => {
	server.server.resetHandlers();
});

test.fails('validates useGetAggregateInvestmentData');

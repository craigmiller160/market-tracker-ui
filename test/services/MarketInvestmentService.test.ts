export {};

// TODO take the API setup stuff for the regexes in Markets.test and make it re-usable

describe('MarketInvestmentService', () => {
	describe('getHistoryFn', () => {
		it('Tradier One Day', () => {
			throw new Error();
		});

		it('CoinGecko One Day', () => {
			throw new Error();
		});

		it('Tradier One Week', () => {
			throw new Error();
		});

		it('CoinGecko One Week', () => {
			throw new Error();
		});

		it('Tradier One Month', () => {
			throw new Error();
		});

		it('CoinGecko One Month', () => {
			throw new Error();
		});

		it('Tradier Three Months', () => {
			throw new Error();
		});

		it('CoinGecko Three Months', () => {
			throw new Error();
		});

		it('Tradier One Year', () => {
			throw new Error();
		});

		it('CoinGecko One Year', () => {
			throw new Error();
		});

		it('Tradier Five Years', () => {
			throw new Error();
		});

		it('CoinGecko Five Years', () => {
			throw new Error();
		});
	});

	describe('getQuoteFn', () => {
		it('Tradier Quote', () => {
			throw new Error();
		});

		it('CoinGecko Quote', () => {
			throw new Error();
		});
	});

	describe('getInvestmentData', () => {
		it('gets past history and current quote and combines', async () => {
			throw new Error();
		});

		it('No quote available', async () => {
			throw new Error();
		});

		it('No quote or history available', async () => {
			throw new Error();
		});

		it('what is going on with previousClose in my logic???', async () => {
			// Probably the source of some bugs
			throw new Error();
		});

		it('adds special starting history record for previousClose for Today', async () => {
			throw new Error();
		});
	});
});

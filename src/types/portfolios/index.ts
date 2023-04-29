export type StockHistoryInterval = 'SINGLE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

export type StockHistoryRequest = {
	readonly symbol: string;
	readonly startDate: Date;
	readonly endDate: Date;
	readonly interval: StockHistoryInterval;
};

export type StockHistoryInPortfolioRequest = StockHistoryRequest & {
	readonly portfolioId: string;
};

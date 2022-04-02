export class InvestmentNotFoundError extends Error {
	public readonly name = 'InvestmentNotFoundError';

	constructor(public readonly symbol: string) {
		super(`Investment not found. Symbol: ${symbol}`);
	}
}

export const isInvestmentNotFoundError = (
	error: Error
): error is InvestmentNotFoundError => error.name === 'InvestmentNotFoundError';

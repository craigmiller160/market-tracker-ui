import { P, match } from 'ts-pattern';

export class InvestmentNotFoundError extends Error {
	public readonly name = 'InvestmentNotFoundError';

	constructor(public readonly symbol: string) {
		super(`Investment not found. Symbol: ${symbol}`);
	}
}

export const isNestedInvestmentNotFoundError = (
	ex: Error
): ex is InvestmentNotFoundError =>
	match(ex)
		.with({ cause: P.not(P.nullish) }, ({ cause }) =>
			isNestedInvestmentNotFoundError(cause as Error)
		)
		.otherwise((error) => error.name === 'InvestmentNotFoundError');

export const getInvestmentNotFoundMessage = (ex: Error): string =>
	match(ex)
		.with({ cause: P.not(P.nullish) }, ({ cause }) =>
			getInvestmentNotFoundMessage(cause as Error)
		)
		.with({ name: 'InvestmentNotFoundError' }, (error) => error.message)
		.otherwise(() => '');

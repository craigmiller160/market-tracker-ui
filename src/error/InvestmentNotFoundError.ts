import { instanceOf, match } from 'ts-pattern';
import TraceError from 'trace-error';
import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';

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
		.with(instanceOf(TraceError), (traceError) =>
			pipe(
				Option.fromNullable(traceError.cause()),
				Option.map(isNestedInvestmentNotFoundError),
				Option.getOrElse(() => false)
			)
		)
		.otherwise((error) => error.name === 'InvestmentNotFoundError');

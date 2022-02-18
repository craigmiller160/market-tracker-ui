import * as ioType from 'io-ts';
import { TryT, ValidationT } from '@craigmiller160/ts-functions/es/types';
import { pipe } from 'fp-ts/es6/function';
import * as Either from 'fp-ts/es6/Either';
import { PathReporter } from 'io-ts/es6/PathReporter';

export class TypeValidationError extends Error {
	readonly name = 'TypeValidationError';
	constructor(errors: ReadonlyArray<string>) {
		super();
		this.message = errors.join('\n');
	}
}

export const handleValidationResult = <T>(result: ValidationT<T>): TryT<T> =>
	pipe(
		result,
		Either.mapLeft(ioType.failures),
		Either.mapLeft(PathReporter.report),
		Either.mapLeft((report) => new TypeValidationError(report))
	);

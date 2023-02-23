import * as TaskEither from 'fp-ts/es6/TaskEither';
import { TaskEitherT } from '@craigmiller160/ts-functions/es/types';

export const taskEitherToPromise = <E, T>(
	taskEither: TaskEitherT<E, T>
): Promise<T> => {
	return TaskEither.fold<E, T, T>(
		(e) => () => Promise.reject(e),
		(t) => () => Promise.resolve(t)
	)(taskEither)();
};

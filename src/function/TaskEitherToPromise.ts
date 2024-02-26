import * as TaskEither from 'fp-ts/TaskEither';
import { type TaskEitherT } from '@craigmiller160/ts-functions/types';

export const taskEitherToPromise = <E, T>(
	taskEither: TaskEitherT<E, T>
): Promise<T> => {
	return TaskEither.fold<E, T, T>(
		(e) => () => Promise.reject(e),
		(t) => () => Promise.resolve(t)
	)(taskEither)();
};

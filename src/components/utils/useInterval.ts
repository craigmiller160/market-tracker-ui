import { useEffect, useRef } from 'react';
import * as Option from 'fp-ts/es6/Option';
import { pipe } from 'fp-ts/es6/function';

type Callback = () => void;

export const useInterval = (callback: Callback, delayMillis: number) => {
	const savedCallback = useRef<Callback>();

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		const action = pipe(
			Option.fromNullable(savedCallback.current),
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			Option.getOrElse(() => () => {})
		);

		const interval = setInterval(action, delayMillis);
		return () => {
			clearInterval(interval);
		};
	}, [delayMillis]);
};

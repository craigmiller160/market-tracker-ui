import { useEffect } from 'react';
import { pipe } from 'fp-ts/es6/function';
import * as tradierService from '../../../services/TradierService';
import * as TaskEither from 'fp-ts/es6/TaskEither';

export const Markets = () => {
    // TODO delete this temporary logic
	useEffect(() => {
		pipe(
			tradierService.getHistoryQuote('VTI'),
			TaskEither.fold(
				(ex) => async () => console.error(ex),
				(data) => async () => console.log(JSON.stringify(data))
			)
		)();
	}, []);
	return <h1>Markets Page</h1>;
};

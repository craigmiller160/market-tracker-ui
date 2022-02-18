import { MarketTime } from '../types/MarketTime';
import { TaskTryT } from '@craigmiller160/ts-functions/es/types';
import { MarketStatus } from '../types/MarketStatus';
import { match } from 'ts-pattern';
import * as tradierService from './TradierService';
import * as TaskEither from 'fp-ts/es6/TaskEither';

export const checkMarketStatus = (
	timeValue: MarketTime
): TaskTryT<MarketStatus> =>
	match(timeValue)
		.with(MarketTime.ONE_DAY, () => tradierService.getMarketStatus())
		.otherwise(() => TaskEither.right(MarketStatus.OPEN));

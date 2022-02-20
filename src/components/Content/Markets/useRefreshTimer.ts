import { useSelector } from 'react-redux';
import { timeValueSelector } from '../../../store/marketSettings/selectors';
import { useEffect } from 'react';
import { MarketTime } from '../../../types/MarketTime';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { useImmer } from 'use-immer';

const ONE_MIN_INTERVAL = 1000 * 60;
const formatTimestamp = Time.format("yyyy-MM-dd'T'HH:mm:ss.SSS");

interface State {
	readonly timestamp: string;
}

export const useRefreshTimer = (): string => {
	const [state, setState] = useImmer<State>({
		timestamp: ''
	});
	const time = useSelector(timeValueSelector);

	useEffect(() => {
		let interval: NodeJS.Timer | null = null;
		if (MarketTime.ONE_DAY === time) {
			interval = setInterval(() => {
				setState((draft) => {
					draft.timestamp = formatTimestamp(new Date());
				});
			}, ONE_MIN_INTERVAL);
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [time, setState]);

	return state.timestamp;
};

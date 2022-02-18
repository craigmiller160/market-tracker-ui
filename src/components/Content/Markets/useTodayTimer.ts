import { useSelector } from 'react-redux';
import { timeValueSelector } from '../../../store/time/selectors';
import { useEffect } from 'react';
import { MarketTime } from '../../../types/MarketTime';

const ONE_MIN_INTERVAL = 1000 * 60;

export const useTodayTimer = () => {
	const time = useSelector(timeValueSelector);

	useEffect(() => {
		let interval: NodeJS.Timer | null = null;
		if (MarketTime.ONE_DAY === time) {
			interval = setInterval(() => {}, ONE_MIN_INTERVAL);
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [time]);
};

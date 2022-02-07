import { useSelector } from 'react-redux';
import { timeValueSelector } from '../../../store/time/selectors';
import { useEffect } from 'react';
import { MarketDataGroup } from '../../../types/MarketDataGroup';
import { useImmer } from 'use-immer';
import { MarketStatus } from '../../../types/MarketStatus';

interface State {
	readonly loading: boolean;
	readonly usMarketData: MarketDataGroup;
	readonly intMarketData: MarketDataGroup;
}

const defaultMarketDataGroup: MarketDataGroup = {
	marketStatus: MarketStatus.OPEN,
	data: []
};

export const useMarketData = () => {
	const timeValue = useSelector(timeValueSelector);
	const [state, setState] = useImmer<State>({
		loading: true,
		usMarketData: defaultMarketDataGroup,
		intMarketData: defaultMarketDataGroup
	});

	useEffect(() => {
		// TODO run stuff here
	}, [timeValue]);
};

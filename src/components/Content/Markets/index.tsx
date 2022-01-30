import { Typography } from 'antd';
import { useMarketData } from './useMarketData';
import './Markets.scss';

export const Markets = () => {
	const marketData = useMarketData();
	return (
		<div className="GlobalMarkets">
			<Typography.Title>Global Markets</Typography.Title>
			<p>{JSON.stringify(marketData)}</p>
		</div>
	);
};

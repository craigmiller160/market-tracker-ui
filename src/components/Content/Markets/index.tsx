import { useMarketData } from './useMarketData';

export const Markets = () => {
	const marketData = useMarketData();
	return (
		<div>
			<h1>Markets Page</h1>
			<p>{JSON.stringify(marketData)}</p>
		</div>
	);
};

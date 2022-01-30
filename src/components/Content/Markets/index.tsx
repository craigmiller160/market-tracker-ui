import { Typography } from 'antd';
import { useMarketData } from './useMarketData';
import './Markets.scss';
import { MarketCard } from './MarketCard';

export const Markets = () => {
	const { usMarketData, internationalMarketData } = useMarketData();
	const UsMarketCards = usMarketData.map((data) => (
		<MarketCard key={data.symbol} data={data} />
	));
	const IntMarketCards = internationalMarketData.map((data) => (
		<MarketCard key={data.symbol} data={data} />
	));

	return (
		<div className="GlobalMarkets">
			<Typography.Title>All Global Markets</Typography.Title>
			<section className="MarketSection">
				<Typography.Title level={3}>US Markets</Typography.Title>
				{UsMarketCards}
			</section>
			<section className="MarketSection">
				<Typography.Title level={3}>
					International Markets
				</Typography.Title>
				{IntMarketCards}
			</section>
		</div>
	);
};

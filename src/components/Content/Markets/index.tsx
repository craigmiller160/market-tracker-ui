import { Typography } from 'antd';
import { useMarketData } from './useMarketData';
import './Markets.scss';
import { MarketCard } from './MarketCard';
import { MarketData } from './MarketData';

const marketDataToCard = (data: MarketData) => (
	<MarketCard key={data.symbol} data={data} />
);

// TODO add spinners

export const Markets = () => {
	const { usMarketData, internationalMarketData } = useMarketData();
	const UsMarketCards = usMarketData.map(marketDataToCard);
	const IntMarketCards = internationalMarketData.map(marketDataToCard);

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

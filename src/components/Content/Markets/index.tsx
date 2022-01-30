import { Card, Typography } from 'antd';
import { useMarketData } from './useMarketData';
import './Markets.scss';

export const Markets = () => {
	const marketData = useMarketData();
	return (
		<div className="GlobalMarkets">
			<Typography.Title>All Global Markets</Typography.Title>
			<section className="MarketSection">
				<Typography.Title level={3}>US Markets</Typography.Title>
				<Card title="The Title" className="MarketCard">
					<p>The Content</p>
				</Card>
			</section>
			<section className="MarketSection">
				<Typography.Title level={3}>International Markets</Typography.Title>
			</section>
		</div>
	);
};

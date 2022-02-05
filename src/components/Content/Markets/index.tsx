import { Typography } from 'antd';
import { useMarketData } from './useMarketData';
import './Markets.scss';
import { MarketSection } from './MarketSection';

export const Markets = () => {
	const { loading, usMarketData, internationalMarketData, timeValue } =
		useMarketData();

	return (
		<div className="GlobalMarkets" data-testid="markets-page">
			<Typography.Title>All Markets</Typography.Title>
			<MarketSection
				title="US Markets"
				loading={loading}
				data={usMarketData}
				timeValue={timeValue}
			/>
			<MarketSection
				title="International Markets"
				loading={loading}
				data={internationalMarketData}
				timeValue={timeValue}
			/>
		</div>
	);
};

import { Space, Spin, Typography } from 'antd';
import { useMarketData } from './useMarketData';
import './Markets.scss';
import { MarketCard } from './MarketCard';
import { MarketData } from './MarketData';
import { useContext } from 'react';
import { ScreenContext } from '../../ScreenContext';
import { Breakpoints } from '../../utils/Breakpoints';
import { match } from 'ts-pattern';

const marketDataToCard = (data: MarketData) => (
	<MarketCard key={data.symbol} data={data} />
);

const getPageSizeClass = (breakpoints: Breakpoints): string =>
	match(breakpoints)
		.with({ xxl: true }, () => 'XXL')
		.with({ xxl: false, xl: true }, () => 'XL')
		.with({ xxl: false, xl: false, lg: true }, () => 'LG')
		.otherwise(() => '');

const Spinner = (
	<Space size="middle" className="Spinner">
		<Spin size="large" />
	</Space>
);

export const Markets = () => {
	const { loading, usMarketData, internationalMarketData } = useMarketData();
	const UsMarketCards = usMarketData.map(marketDataToCard);
	const IntMarketCards = internationalMarketData.map(marketDataToCard);
	const { breakpoints } = useContext(ScreenContext);
	const pageSizeClass = getPageSizeClass(breakpoints);
	const className = `GlobalMarkets ${pageSizeClass}`;

	return (
		<div className={className}>
			<Typography.Title>All Global Markets</Typography.Title>
			<section className="MarketSection">
				<Typography.Title level={3}>US Markets</Typography.Title>
				{loading ? Spinner : UsMarketCards}
			</section>
			<section className="MarketSection">
				<Typography.Title level={3}>
					International Markets
				</Typography.Title>
				{loading ? Spinner : IntMarketCards}
			</section>
		</div>
	);
};

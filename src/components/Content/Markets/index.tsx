import { Typography } from 'antd';
import { useMarketData } from './useMarketData';
import './Markets.scss';
import { useContext } from 'react';
import { ScreenContext } from '../../ScreenContext';
import { Breakpoints } from '../../utils/Breakpoints';
import { match } from 'ts-pattern';
import { MarketSection } from './MarketSection';

const getPageSizeClass = (breakpoints: Breakpoints): string =>
	match(breakpoints)
		.with({ xxl: true }, () => 'XXL')
		.with({ xxl: false, xl: true }, () => 'XL')
		.with({ xxl: false, xl: false, lg: true }, () => 'LG')
		.otherwise(() => '');

export const Markets = () => {
	const { loading, usMarketData, internationalMarketData, timeValue } =
		useMarketData();
	// const { breakpoints } = useContext(ScreenContext);
	// const pageSizeClass = getPageSizeClass(breakpoints);
	// const className = `GlobalMarkets ${pageSizeClass}`;

	return (
		<div className="GlobalMarkets" data-testid="markets-page">
			<Typography.Title>All Global Markets</Typography.Title>
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

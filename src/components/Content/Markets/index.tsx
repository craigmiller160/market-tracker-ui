import { Typography } from 'antd';
import './Markets.scss';
import { getMarketInvestmentByType } from '../../../data/MarketPageInvestmentParsing';

export const Markets = () => {
	console.log(getMarketInvestmentByType());
	return (
		<div className="GlobalMarkets" data-testid="markets-page">
			<Typography.Title>All Markets</Typography.Title>
			<h3>Market Sections Coming Back Soon</h3>
		</div>
	);
};

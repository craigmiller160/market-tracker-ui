import { Typography } from 'antd';
import './Markets.scss';
import { getMarketInvestmentInfo } from '../../../data/MarketPageInvestmentParsing';

export const Markets = () => {
	getMarketInvestmentInfo() // TODO delete this
	return (
		<div className="GlobalMarkets" data-testid="markets-page">
			<Typography.Title>All Markets</Typography.Title>
			<h3>Market Sections Coming Back Soon</h3>
		</div>
	);
};

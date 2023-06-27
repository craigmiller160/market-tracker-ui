import './InvestmentInfo.scss';
import { Typography } from 'antd';
import { Watchlists } from '../Watchlists';
import { Portfolios } from '../Portfolios';

export const InvestmentInfo = () => (
	<div className="InvestmentInfoPage">
		<Typography.Title>Investment Info</Typography.Title>
		<Portfolios />
		<Watchlists />
	</div>
);

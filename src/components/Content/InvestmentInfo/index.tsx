import './InvestmentInfo.scss';
import { Typography } from 'antd';
import { Watchlists } from '../Watchlists';
import { Portfolios } from '../Portfolios';

export const InvestmentInfo = () => (
	<div className="investment-info-page">
		<Typography.Title>Investment Info</Typography.Title>
		<div className="content-wrapper">
			<Portfolios />
			<Watchlists />
		</div>
	</div>
);

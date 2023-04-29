import './InvestmentInfo.scss';
import { Typography } from 'antd';
import { Watchlists } from '../Watchlists';
import { Investments } from '../MyInvestments';

export const InvestmentInfo = () => (
	<div className="InvestmentInfoPage">
		<Typography.Title>Investment Info</Typography.Title>
		<Investments />
		<Watchlists />
	</div>
);

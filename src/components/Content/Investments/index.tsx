import './Investments.scss';
import { Typography } from 'antd';
import { Watchlists } from '../Watchlists';

export const Investments = () => (
	<div className="InvestmentsPage">
		<Typography.Title>Investment Info</Typography.Title>
		<Watchlists />
	</div>
);

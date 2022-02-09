import './Recognition.scss';
import { Typography } from 'antd';

export const Recognition = () => (
	<div className="Recognition">
		<Typography.Title>Data Source Recognition</Typography.Title>
		<div className="Sources">
			<div className="Source">
				<a href="https://documentation.tradier.com/brokerage-api/overview/market-data">
					<Typography.Title level={4}>Tradier</Typography.Title>
				</a>
				<Typography.Title level={4}>The source of all</Typography.Title>
			</div>
		</div>
	</div>
);

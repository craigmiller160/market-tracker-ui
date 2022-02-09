import './Recognition.scss';
import { Typography } from 'antd';
import TradierLogo from '../../../images/tradier.png';

export const Recognition = () => (
	<div className="Recognition">
		<Typography.Title>Data Source Recognition</Typography.Title>
		<img src={TradierLogo} alt="Tradier" />
		<Typography.Title level={4}>
			The source of all stock market data
		</Typography.Title>
	</div>
);

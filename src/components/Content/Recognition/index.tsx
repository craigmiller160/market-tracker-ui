import './Recognition.scss';
import { Typography } from 'antd';
import TradierLogo from '../../../images/tradier.png';
import CoinGeckoLogo from '../../../images/coingecko.png';
import { useContext } from 'react';
import { ScreenContext } from '../../ScreenContext';
import { getBreakpointName } from '../../utils/Breakpoints';

export const Recognition = () => {
	const { breakpoints } = useContext(ScreenContext);
	const breakpointName = getBreakpointName(breakpoints);
	return (
		<div className="Recognition">
			<Typography.Title>Data Source Recognition</Typography.Title>
			<div className={`Source ${breakpointName}`}>
				<img src={TradierLogo} alt="Tradier" />
				<Typography.Title level={4}>
					The source of all stock market data
				</Typography.Title>
			</div>
			<div className={`Source ${breakpointName}`}>
				<img src={CoinGeckoLogo} alt="CoinGecko" />
				<Typography.Title level={4}>
					The source of all crypto data
				</Typography.Title>
			</div>
		</div>
	);
};

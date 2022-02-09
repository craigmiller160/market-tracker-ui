import './Recognition.scss';
import { Typography } from 'antd';
import TradierLogo from '../../../images/tradier.png';
import MessariLogo from '../../../images/messari.png';
import { useContext } from 'react';
import { ScreenContext } from '../../ScreenContext';
import { getBreakpointName } from '../../utils/Breakpoints';

const SHOW_CRYPTO_SOURCE = false;

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
			{SHOW_CRYPTO_SOURCE && (
				<div className={`Source ${breakpointName}`}>
					<img src={MessariLogo} alt="Messari" />
					<Typography.Title level={4}>
						The source of all crypto data
					</Typography.Title>
				</div>
			)}
		</div>
	);
};

import { MarketData } from './MarketData';
import { Card } from 'antd';

interface Props {
	readonly data: MarketData;
}

export const MarketCard = ({ data }: Props) => {
	const title = (
		<h3>
			<strong>{`${data.name} (${data.symbol})`}</strong>
		</h3>
	);
	return (
		<Card title={title} className="MarketCard">
			<p>The Content</p>
		</Card>
	);
};

import { MarketData } from './MarketData';
import { Card } from 'antd';

interface Props {
	readonly data: MarketData;
}

export const MarketCard = ({ data }: Props) => {
	const title = `${data.name} (${data.symbol})`;
	return (
		<Card title={title} className="MarketCard">
			<p>The Content</p>
		</Card>
	);
};

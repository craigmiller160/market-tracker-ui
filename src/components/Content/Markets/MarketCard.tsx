import { MarketData } from './MarketData';
import { Card } from 'antd';

interface Props {
	readonly data: MarketData;
}

const createTitle = (data: MarketData) => (
	<>
		<h3>
			<strong>{`${data.name} (${data.symbol})`}</strong>
		</h3>
		<p>${data.currentPrice}</p>
	</>
);

export const MarketCard = ({ data }: Props) => {
	const title = createTitle(data);
	return (
		<Card title={title} className="MarketCard">
			<p>The Content</p>
		</Card>
	);
};

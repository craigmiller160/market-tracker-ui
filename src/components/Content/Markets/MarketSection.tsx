import { Space, Spin, Typography } from 'antd';
import { MarketData } from '../../../types/MarketData';
import { MarketCard } from './MarketCard';

interface Props {
	readonly title: string;
	readonly loading: boolean;
	readonly data: ReadonlyArray<MarketData>;
	readonly timeValue: string;
}

const Spinner = (
	<Space size="middle" className="Spinner">
		<Spin size="large" />
	</Space>
);

// eslint-disable-next-line react/display-name
const createMarketDataToCard = (timeValue: string) => (data: MarketData) =>
	<MarketCard key={data.symbol} data={data} time={timeValue} />;

export const MarketSection = (props: Props) => {
	const { title, loading, data, timeValue } = props;
	const marketDataToCard = createMarketDataToCard(timeValue);
	const MarketCards = data.map(marketDataToCard);

	return (
		<section className="MarketSection">
			<Typography.Title level={3}>{title}</Typography.Title>
			<div className="MarketCardList" role="list">
				{loading ? Spinner : MarketCards}
			</div>
		</section>
	);
};

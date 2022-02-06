/* eslint-disable react/display-name */
import { Space, Spin, Typography } from 'antd';
import { MarketData } from '../../../types/MarketData';
import { MarketCard } from './MarketCard';
import './MarketSection.scss';

interface Props {
	readonly isMarketOpen: boolean;
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

const createMarketDataToCard =
	(isMarketOpen: boolean, timeValue: string) => (data: MarketData) =>
		(
			<MarketCard
				key={data.symbol}
				data={data}
				time={timeValue}
				isMarketOpen={isMarketOpen}
			/>
		);

export const MarketSection = (props: Props) => {
	const { title, loading, data, timeValue, isMarketOpen } = props;
	const marketDataToCard = createMarketDataToCard(isMarketOpen, timeValue);
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

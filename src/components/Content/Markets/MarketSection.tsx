/* eslint-disable react/display-name */
import { Space, Spin, Typography } from 'antd';
import { MarketData } from '../../../types/MarketData';
import { MarketCard } from './MarketCard';
import './MarketSection.scss';
import { MarketDataGroup } from '../../../types/MarketDataGroup';
import { MarketStatus } from '../../../types/MarketStatus';
import { MarketTime } from '../../../types/MarketTime';

interface Props {
	readonly title: string;
	readonly loading: boolean;
	readonly data: MarketDataGroup;
}

const Spinner = (
	<Space size="middle" className="Spinner">
		<Spin size="large" />
	</Space>
);

const createMarketDataToCard =
	(marketStatus: MarketStatus, time: MarketTime) => (data: MarketData) =>
		(
			<MarketCard
				key={data.symbol}
				data={data}
				time={time}
				marketStatus={marketStatus}
			/>
		);

export const MarketSection = (props: Props) => {
	const { title, loading, data } = props;
	const marketDataToCard = createMarketDataToCard(
		data.marketStatus,
		data.time
	);
	const MarketCards = data.data.map(marketDataToCard);

	return (
		<section className="MarketSection">
			<Typography.Title level={3}>{title}</Typography.Title>
			<div className="MarketCardList" role="list">
				{loading ? Spinner : MarketCards}
			</div>
		</section>
	);
};

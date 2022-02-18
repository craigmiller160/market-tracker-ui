/* eslint-disable react/display-name */
import { Space, Spin, Typography } from 'antd';
import { MarketData } from '../../../types/MarketData';
import { MarketCard } from './MarketCard';
import './MarketSection.scss';
import { MarketStatus } from '../../../types/MarketStatus';
import { MarketTime } from '../../../types/MarketTime';
import {
	getMarketInvestmentTypeTitle,
	MarketInvestmentType
} from '../../../types/data/MarketInvestmentType';
import { InvestmentsByType } from '../../../data/MarketPageInvestmentParsing';
import { MarketInvestmentInfo } from '../../../types/data/MarketInvestmentInfo';

interface Props {
	readonly type: MarketInvestmentType;
	readonly data: InvestmentsByType;
}

const Spinner = (
	<Space size="middle" className="Spinner">
		<Spin size="large" />
	</Space>
);

const investmentInfoToCard = (info: MarketInvestmentInfo) => (
	<MarketCard key={info.symbol} info={info} />
);

export const MarketSection = (props: Props) => {
	const { type, data } = props;
	const title = getMarketInvestmentTypeTitle(type);
	const cards = data[type].map(investmentInfoToCard);

	return (
		<section className="MarketSection">
			<Typography.Title level={3}>{title}</Typography.Title>
			<div className="MarketCardList" role="list">
				{cards}
			</div>
		</section>
	);
};

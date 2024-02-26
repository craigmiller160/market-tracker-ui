import { Typography } from 'antd';
import { InvestmentCard } from '../common/InvestmentCard/InvestmentCard';
import './MarketSection.scss';
import {
	getMarketInvestmentTypeTitle,
	MarketInvestmentType
} from '../../../types/data/MarketInvestmentType';
import { type InvestmentsByType } from '../../../data/MarketPageInvestmentParsing';
import { type MarketInvestmentInfo } from '../../../types/data/MarketInvestmentInfo';

interface Props {
	readonly marketType: MarketInvestmentType;
	readonly data: InvestmentsByType;
}

const investmentInfoToCard = (info: MarketInvestmentInfo) => (
	<InvestmentCard key={info.symbol} info={info} />
);

export const MarketSection = (props: Props) => {
	const { marketType, data } = props;
	const title = getMarketInvestmentTypeTitle(marketType);
	const cards = data[marketType].map(investmentInfoToCard);

	return (
		<section className="MarketSection">
			<Typography.Title level={3}>{title}</Typography.Title>
			<div className="MarketCardList" role="list">
				{cards}
			</div>
		</section>
	);
};

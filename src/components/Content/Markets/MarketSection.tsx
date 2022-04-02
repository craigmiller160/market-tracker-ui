import { Typography } from 'antd';
import { InvestmentCard } from '../common/InvestmentCard/InvestmentCard';
import './MarketSection.scss';
import {
	getMarketInvestmentTypeTitle,
	MarketInvestmentType
} from '../../../types/data/MarketInvestmentType';
import { InvestmentsByType } from '../../../data/MarketPageInvestmentParsing';
import { MarketInvestmentInfo } from '../../../types/data/MarketInvestmentInfo';
import { InvestmentType } from '../../../types/data/InvestmentType';

interface Props {
	readonly marketType: MarketInvestmentType;
	readonly data: InvestmentsByType;
}

const shouldRespectMarketStatus = (info: MarketInvestmentInfo) => () =>
	info.type !== InvestmentType.CRYPTO;

const investmentInfoToCard = (info: MarketInvestmentInfo) => (
	<InvestmentCard
		key={info.symbol}
		info={info}
		shouldRespectMarketStatus={shouldRespectMarketStatus(info)}
	/>
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

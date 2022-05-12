import './AccordionSection.scss';
import { InvestmentCard } from '../../Content/common/InvestmentCard/InvestmentCard';
import { AccordionInvestmentType } from './AccordionInvestmentType';

interface Props {
	readonly investments: ReadonlyArray<AccordionInvestmentType>;
}

const investmentToCard = (investment: AccordionInvestmentType) => (
	<InvestmentCard info={investment} getActions={investment.getActions} />
);

export const AccordionSection = (props: Props) => {
	const { investments } = props;
	const cards = investments.map(investmentToCard);
	return (
		<div className="AccordionSection" role="list">
			{cards}
		</div>
	);
};

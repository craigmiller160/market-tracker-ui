import './AccordionSection.scss';
import { InvestmentCard } from '../../Content/common/InvestmentCard/InvestmentCard';
import { AccordionInvestment } from './AccordionInvestment';

interface Props {
	readonly investments: ReadonlyArray<AccordionInvestment>;
}

const investmentToCard = (investment: AccordionInvestment) => (
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

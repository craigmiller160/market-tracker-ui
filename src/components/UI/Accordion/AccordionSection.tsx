import './AccordionSection.scss';
import { InvestmentInfo } from '../../../types/data/InvestmentInfo';
import { WithActions } from '../../../types/data/WithActions';
import { InvestmentCard } from '../../Content/common/InvestmentCard/InvestmentCard';

type InvestmentType = InvestmentInfo & WithActions;

interface Props {
	readonly investments: ReadonlyArray<InvestmentType>;
}

const investmentToCard = (investment: InvestmentType) => (
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

import './AccordionSection.scss';
import { InvestmentCard } from '../../Content/common/InvestmentCard/InvestmentCard';
import { type AccordionInvestment } from './AccordionInvestment';

interface Props {
    readonly investments: ReadonlyArray<AccordionInvestment>;
}

const investmentToCard = (investment: AccordionInvestment) => (
    <InvestmentCard
        key={investment.symbol}
        info={investment}
        getActions={investment.getActions}
        useLoadInvestmentData={investment.useLoadInvestmentData}
    />
);

export const AccordionSection = (props: Props) => {
    const { investments } = props;
    const cards = investments.map(investmentToCard);
    return (
        <div className="accordion-section" role="list">
            {cards}
        </div>
    );
};

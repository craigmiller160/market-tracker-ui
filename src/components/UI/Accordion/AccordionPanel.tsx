import { Collapse } from 'antd';
import './AccordionPanel.scss';
import { AccordionSection } from './AccordionSection';
import type { AccordionPanelConfig } from './AccordionPanelConfig';
import { InvestmentCardDataLoadingContext } from '../../Content/common/InvestmentCard/InvestmentCardDataLoadingContext';

type Props = Readonly<{
	config: AccordionPanelConfig;
}>;

export const AccordionPanel = (props: Props) => {
	const {
		config: { title, actions, investments, key, useLoadInvestmentData },
		...rest
	} = props;
	return (
		<Collapse.Panel
			{...rest}
			header={title}
			key={key}
			extra={actions}
			className="accordion-panel"
		>
			<InvestmentCardDataLoadingContext.Provider
				value={useLoadInvestmentData}
			>
				<AccordionSection investments={investments} />
			</InvestmentCardDataLoadingContext.Provider>
		</Collapse.Panel>
	);
};

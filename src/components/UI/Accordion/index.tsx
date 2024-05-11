import { Collapse } from 'antd';
import { type ReactNode } from 'react';
import { type AccordionInvestment } from './AccordionInvestment';
import { AccordionPanel } from './AccordionPanel';
import {
	InvestmentCardDataLoadingContext,
	type UseLoadInvestmentData
} from '../../Content/common/InvestmentCard/InvestmentCardDataLoadingContext';
import './Accordion.scss';

export type AccordionPanelConfig = Readonly<{
	title: ReactNode;
	key: string;
	actions?: ReactNode;
	investments: ReadonlyArray<AccordionInvestment>;
	useLoadInvestmentData?: UseLoadInvestmentData;
}>;

type Props = Readonly<{
	id?: string;
	panels: ReadonlyArray<AccordionPanelConfig>;
}>;

const panelConfigToPanels = (config: AccordionPanelConfig) => {
	const Panel = (
		<AccordionPanel
			title={config.title}
			key={config.key}
			actions={config.actions}
			investments={config.investments}
		/>
	);
	if (config.useLoadInvestmentData) {
		return (
			<InvestmentCardDataLoadingContext.Provider
				value={config.useLoadInvestmentData}
			>
				{Panel}
			</InvestmentCardDataLoadingContext.Provider>
		);
	}
	return Panel;
};

export const Accordion = (props: Props) => {
	const { panels } = props;
	const panelComponents = panels.map(panelConfigToPanels);
	return (
		<div id={props.id} style={{ width: '100%' }}>
			<Collapse className="accordion" accordion destroyInactivePanel>
				{panelComponents}
			</Collapse>
		</div>
	);
};

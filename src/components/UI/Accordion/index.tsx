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

type PanelProps = Readonly<{
	config: AccordionPanelConfig;
}>;
const Panel = ({ config }: PanelProps) => (
	<AccordionPanel
		title={config.title}
		panelKey={config.key}
		actions={config.actions}
		investments={config.investments}
	/>
);

const panelConfigToPanels = (config: AccordionPanelConfig) => {
	if (config.useLoadInvestmentData) {
		return (
			<InvestmentCardDataLoadingContext.Provider
				key={config.key}
				value={config.useLoadInvestmentData}
			>
				<Panel config={config} />
			</InvestmentCardDataLoadingContext.Provider>
		);
	}
	return <Panel config={config} key={config.key} />;
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

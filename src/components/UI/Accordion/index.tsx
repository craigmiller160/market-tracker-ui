import { Collapse } from 'antd';
import { ReactNode } from 'react';
import { AccordionInvestment } from './AccordionInvestment';
import { AccordionPanel } from './AccordionPanel';

export interface AccordionPanelConfig {
	readonly title: ReactNode;
	readonly key: string;
	readonly actions?: ReactNode;
	readonly investments: ReadonlyArray<AccordionInvestment>;
}

interface Props {
	readonly panels: ReadonlyArray<AccordionPanelConfig>;
}

const panelConfigToPanels = (config: AccordionPanelConfig) => (
	<AccordionPanel
		title={config.title}
		key={config.key}
		actions={config.actions}
		investments={config.investments}
	/>
);

export const Accordion = (props: Props) => {
	const { panels } = props;
	const panelComponents = panels.map(panelConfigToPanels);
	return (
		<Collapse className="Accordion" accordion destroyInactivePanel>
			{panelComponents}
		</Collapse>
	);
};

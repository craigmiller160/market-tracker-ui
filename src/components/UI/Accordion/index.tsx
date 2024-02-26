import { Collapse } from 'antd';
import { type ReactNode } from 'react';
import { type AccordionInvestment } from './AccordionInvestment';
import { AccordionPanel } from './AccordionPanel';
import './Accordion.scss';

export interface AccordionPanelConfig {
	readonly title: ReactNode;
	readonly key: string;
	readonly actions?: ReactNode;
	readonly investments: ReadonlyArray<AccordionInvestment>;
}

type Props = Readonly<{
	id?: string;
	panels: ReadonlyArray<AccordionPanelConfig>;
}>;

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
		<div id={props.id} style={{ width: '100%' }}>
			<Collapse className="Accordion" accordion destroyInactivePanel>
				{panelComponents}
			</Collapse>
		</div>
	);
};

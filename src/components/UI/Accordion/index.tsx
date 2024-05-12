import { Collapse } from 'antd';
import { AccordionPanel } from './AccordionPanel';
import './Accordion.scss';
import type { AccordionPanelConfig } from './AccordionPanelConfig';

type Props = Readonly<{
	id?: string;
	panels: ReadonlyArray<AccordionPanelConfig>;
}>;

const panelConfigToPanels = (config: AccordionPanelConfig) => (
	<AccordionPanel config={config} key={config.key} />
);

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

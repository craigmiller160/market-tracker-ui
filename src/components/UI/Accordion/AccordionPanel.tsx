import { Collapse } from 'antd';
import './AccordionPanel.scss';
import { AccordionSection } from './AccordionSection';
import type { AccordionPanelConfig } from './AccordionPanelConfig';

type Props = Readonly<{
	config: AccordionPanelConfig;
}>;

export const AccordionPanel = (props: Props) => {
	const {
		config: { title, actions, investments, key },
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
			<AccordionSection investments={investments} />
		</Collapse.Panel>
	);
};

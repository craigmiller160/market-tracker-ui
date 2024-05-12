import { Collapse } from 'antd';
import './AccordionPanel.scss';
import { type ReactNode } from 'react';
import { type AccordionInvestment } from './AccordionInvestment';
import { AccordionSection } from './AccordionSection';

type Props = Readonly<{
	title: ReactNode;
	panelKey: string;
	actions?: ReactNode;
	investments: ReadonlyArray<AccordionInvestment>;
}>;

export const AccordionPanel = (props: Props) => {
	const { title, actions, investments, panelKey, ...rest } = props;
	return (
		<Collapse.Panel
			{...rest}
			header={title}
			key={panelKey}
			extra={actions}
			className="accordion-panel"
		>
			<AccordionSection investments={investments} />
		</Collapse.Panel>
	);
};

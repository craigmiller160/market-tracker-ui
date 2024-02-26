import { Collapse } from 'antd';
import './AccordionPanel.scss';
import { type ReactNode } from 'react';
import { type AccordionInvestment } from './AccordionInvestment';
import { AccordionSection } from './AccordionSection';

interface Props {
	readonly title: ReactNode;
	readonly key: string;
	readonly actions?: ReactNode;
	readonly investments: ReadonlyArray<AccordionInvestment>;
}

export const AccordionPanel = (props: Props) => {
	const { title, actions, investments, key, ...rest } = props;
	return (
		<Collapse.Panel
			{...rest}
			header={title}
			key={key}
			extra={actions}
			className="AccordionPanel"
		>
			<AccordionSection investments={investments} />
		</Collapse.Panel>
	);
};

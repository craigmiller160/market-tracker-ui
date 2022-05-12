import { Collapse } from 'antd';
import './AccordionPanel.scss';
import { ReactNode } from 'react';
import { AccordionInvestmentType } from './AccordionInvestmentType';
import { AccordionSection } from './AccordionSection';

interface Props {
	readonly title: ReactNode;
	readonly key: string;
	readonly actions?: ReactNode;
	readonly investments: ReadonlyArray<AccordionInvestmentType>;
}

export const AccordionPanel = (props: Props) => {
	const { title, actions, investments, key, ...rest } = props;
	return (
		<Collapse.Panel
			header={title}
			key={key}
			extra={actions}
			className="AccordionPanel"
			{...rest}
		>
			<AccordionSection investments={investments} />
		</Collapse.Panel>
	);
};

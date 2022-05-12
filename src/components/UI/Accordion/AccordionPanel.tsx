import { Collapse } from 'antd';
import './AccordionPanel.scss';
import { ReactNode } from 'react';

interface Props {
	readonly title: ReactNode;
	readonly key: string;
	readonly actions?: ReactNode;
}

export const AccordionPanel = (props: Props) => {
	const { title, actions, key, ...rest } = props;
	return (
		<Collapse.Panel
			header={title}
			key={key}
			extra={actions}
			className="AccordionPanel"
			{...rest}
		></Collapse.Panel>
	);
};

import { Collapse } from 'antd';
import './AccordionPanel.scss';

interface Props {}

export const AccordionPanel = (props: Props) => {
    const { ...rest } = props;
    return (
        <Collapse.Panel className="AccordionPanel" {...rest}>

        </Collapse.Panel>
    );
};
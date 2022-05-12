import { Collapse } from 'antd';

interface Props {}

export const AccordionPanel = (props: Props) => {
    const { ...rest } = props;
    return (
        <Collapse.Panel {...rest}>

        </Collapse.Panel>
    );
};
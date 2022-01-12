import {Menu} from 'antd';
import './Navbar.scss';
import { MenuInfo } from 'rc-menu/lib/interface';
import { MailOutlined } from '@ant-design/icons'
import {useState} from 'react';

export const Navbar = () => {
    const [state, setState] = useState({
        selected: 'first'
    });
    const handleClick = (e: MenuInfo) => {
        console.log('Event', e);
        setState({
            selected: e.key
        });
    };

    return (
        <Menu className="Navbar" onClick={handleClick} mode="horizontal" selectedKeys={[ state.selected ]}>
            <Menu.Item key="first" icon={<MailOutlined />}>First</Menu.Item>
            <Menu.Item key="second" icon={<MailOutlined />}>Second</Menu.Item>
        </Menu>
    )
};
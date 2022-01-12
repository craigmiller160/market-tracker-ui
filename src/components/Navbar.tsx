import {Menu} from 'antd';
import './Navbar.scss';
import { MenuInfo } from 'rc-menu/lib/interface';

export const Navbar = () => {
    const handleClick = (e: MenuInfo) => {
        console.log('Event', e);
    };

    return (
        <Menu className="Navbar" onClick={handleClick}>
            <Menu.Item key="first">First</Menu.Item>
        </Menu>
    )
};
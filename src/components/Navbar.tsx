import {Button, Menu} from 'antd';
import './Navbar.scss';
import { MenuInfo } from 'rc-menu/lib/interface';
import {MailOutlined, MenuFoldOutlined, MenuUnfoldOutlined} from '@ant-design/icons'
import {useState} from 'react';

export const Navbar = () => {
    const [state, setState] = useState({
        selected: 'first',
        showSidebar: false
    });
    const handleClick = (e: MenuInfo) => {
        if (e.key === 'sidebar') {
            setState((prevState) => ({
                ...prevState,
                showSidebar: !prevState.showSidebar
            }));
        } else {
            setState({
                selected: e.key,
                showSidebar: false
            });
        }
    };

    const SidebarButtonIcon = state.showSidebar ? MenuUnfoldOutlined : MenuFoldOutlined;
    console.log('Sidebar', state.showSidebar)

    return (
        <>
            <Menu className="Navbar" theme="dark" onClick={handleClick} mode="horizontal" selectedKeys={[ state.selected ]}>
                <Menu.Item key="sidebar">
                    <Button type="primary">
                        <SidebarButtonIcon />
                    </Button>
                </Menu.Item>
                <Menu.Item key="first" icon={<MailOutlined />}>First</Menu.Item>
                <Menu.Item key="second" icon={<MailOutlined />}>Second</Menu.Item>
                <Menu.Item style={ { marginLeft: 'auto' } } key="third" icon={<MailOutlined />}>Third</Menu.Item>
                <Menu.Item key="fourth" icon={<MailOutlined />}>Fourth</Menu.Item>
            </Menu>
            <Menu theme="dark" mode="inline" inlineCollapsed={ !state.showSidebar } selectedKeys={[ state.selected ]}>
                <Menu.Item key="first" icon={<MailOutlined />}>First</Menu.Item>
                <Menu.Item key="second" icon={<MailOutlined />}>Second</Menu.Item>
                <Menu.Item key="third" icon={<MailOutlined />}>Third</Menu.Item>
                <Menu.Item key="fourth" icon={<MailOutlined />}>Fourth</Menu.Item>
            </Menu>
        </>
    )
};
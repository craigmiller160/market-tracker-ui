/* eslint-disable */
import {Button, Menu,Layout} from 'antd';
import './Navbar.scss';
import { MenuInfo } from 'rc-menu/lib/interface';
import {MailOutlined, MenuFoldOutlined, MenuUnfoldOutlined} from '@ant-design/icons'
import {useState} from 'react';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import {Breakpoint} from 'antd/es/_util/responsiveObserve';
import {Breakpoints} from '../utils/Breakpoints';

const isDesktop = (breakpoint: Partial<Record<Breakpoint, boolean>>): boolean => {
    return breakpoint.lg ?? false;
};

const isMobile = (breakpoint: Partial<Record<Breakpoint, boolean>>): boolean => {
    return !(breakpoint.lg ?? false);
}

export const Navbar = () => {
    const breakpoint: Breakpoints = useBreakpoint();
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
    console.log('Breakpoint', breakpoint);

    return (
        <>
            {
                isDesktop(breakpoint) &&
                <Menu className="Navbar" theme="dark" onClick={handleClick} mode="horizontal" selectedKeys={[ state.selected ]}>
                    <Menu.Item key="first" icon={<MailOutlined />}>First</Menu.Item>
                    <Menu.Item key="second" icon={<MailOutlined />}>Second</Menu.Item>
                    <Menu.Item style={ { marginLeft: 'auto' } } key="third" icon={<MailOutlined />}>Third</Menu.Item>
                    <Menu.Item key="fourth" icon={<MailOutlined />}>Fourth</Menu.Item>
                </Menu>
            }
            {
                isMobile(breakpoint) &&
                <Layout.Sider breakpoint="md" collapsedWidth={0}>
                    <Menu theme="dark" mode="inline" selectedKeys={[ state.selected ]} onClick={handleClick}>
                        <Menu.Item key="first" icon={<MailOutlined />}>First</Menu.Item>
                        <Menu.Item key="second" icon={<MailOutlined />}>Second</Menu.Item>
                        <Menu.Item key="third" icon={<MailOutlined />}>Third</Menu.Item>
                        <Menu.Item key="fourth" icon={<MailOutlined />}>Fourth</Menu.Item>
                    </Menu>
                </Layout.Sider>
            }
        </>
    )
};
import { Breakpoints, isDesktop } from '../utils/Breakpoints';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { match, when } from 'ts-pattern';
import { DesktopNavbar } from './DesktopNavbar';
import { MobileNavbar } from './MobileNavbar';

export const Navbar = () => {
	const breakpoints: Breakpoints = useBreakpoint();

	return match(breakpoints)
		.with(when(isDesktop), () => <DesktopNavbar />)
		.otherwise(() => <MobileNavbar />);
};

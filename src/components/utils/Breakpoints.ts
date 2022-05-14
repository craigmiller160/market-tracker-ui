import { Breakpoint as AntdBreakpoint } from 'antd/es/_util/responsiveObserve';
import { PredicateT } from '@craigmiller160/ts-functions/es/types';
import { match } from 'ts-pattern';
import { useContext } from 'react';
import { ScreenContext } from '../ScreenContext';

export enum BreakpointName {
	XXL = 'xxl',
	XL = 'xl',
	LG = 'lg',
	MD = 'md',
	SM = 'sm',
	XS = 'xs'
}

export type Breakpoints = Partial<Record<AntdBreakpoint, boolean>>;

export const isDesktop: PredicateT<Breakpoints> = (_) => _.lg ?? false;

export const isMobile: PredicateT<Breakpoints> = (_) => !(_.lg ?? false);

const isXXL: PredicateT<Breakpoints> = (_) => !!_.xxl;
const isXL: PredicateT<Breakpoints> = (_) => !_.xxl && !!_.xl;
const isLG: PredicateT<Breakpoints> = (_) => !_.xl && !!_.lg;
const isMD: PredicateT<Breakpoints> = (_) => !_.lg && !!_.md;
const isSM: PredicateT<Breakpoints> = (_) => !_.md && !!_.sm;

export const useBreakpointName = (): BreakpointName => {
	const { breakpoints } = useContext(ScreenContext);
	return match(breakpoints)
		.when(isXXL, () => BreakpointName.XXL)
		.when(isXL, () => BreakpointName.XL)
		.when(isLG, () => BreakpointName.LG)
		.when(isMD, () => BreakpointName.MD)
		.when(isSM, () => BreakpointName.SM)
		.otherwise(() => BreakpointName.XS);
};

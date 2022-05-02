import { Breakpoint as AntdBreakpoint } from 'antd/es/_util/responsiveObserve';
import { PredicateT } from '@craigmiller160/ts-functions/es/types';
import { match } from 'ts-pattern';

export type Breakpoints = Partial<Record<AntdBreakpoint, boolean>>;

export const isDesktop: PredicateT<Breakpoints> = (_) => _.lg ?? false;

export const isMobile: PredicateT<Breakpoints> = (_) => !(_.lg ?? false);

const isXXL: PredicateT<Breakpoints> = (_) => !!_.xxl;
const isXL: PredicateT<Breakpoints> = (_) => !_.xxl && !!_.xl;
const isLG: PredicateT<Breakpoints> = (_) => !_.xl && !!_.lg;
const isMD: PredicateT<Breakpoints> = (_) => !_.lg && !!_.md;
const isSM: PredicateT<Breakpoints> = (_) => !_.md && !!_.sm;

export const getBreakpointName = (breakpoints: Breakpoints): string =>
	match(breakpoints)
		.when(isXXL, () => 'xxl')
		.when(isXL, () => 'xl')
		.when(isLG, () => 'lg')
		.when(isMD, () => 'md')
		.when(isSM, () => 'sm')
		.otherwise(() => 'xs');

import { Breakpoint as AntdBreakpoint } from 'antd/es/_util/responsiveObserve';
import { PredicateT } from '@craigmiller160/ts-functions/es/types';
import { match } from 'ts-pattern';

export type Breakpoints = Partial<Record<AntdBreakpoint, boolean>>;

export const isDesktop: PredicateT<Breakpoints> = (_) => _.lg ?? false;

export const isMobile: PredicateT<Breakpoints> = (_) => !(_.lg ?? false);

export const getBreakpointName = (breakpoints: Breakpoints): string =>
	match(breakpoints)
		.with({ xxl: true }, () => 'xxl')
		.with({ xxl: false, xl: true }, () => 'xl')
		.with({ xl: false, lg: true }, () => 'lg')
		.with({ lg: false, md: true }, () => 'md')
		.with({ md: false, sm: true }, () => 'sm')
		.otherwise(() => 'xs');

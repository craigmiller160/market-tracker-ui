import { Breakpoint as AntdBreakpoint } from 'antd/es/_util/responsiveObserve';
import * as P from 'fp-ts/es6/Predicate';
import { match } from 'ts-pattern';

export type Breakpoints = Partial<Record<AntdBreakpoint, boolean>>;

export const isDesktop: P.Predicate<Breakpoints> = (_) => _.lg ?? false;

export const isMobile: P.Predicate<Breakpoints> = (_) => !(_.lg ?? false);

export const getBreakpointName = (breakpoints: Breakpoints): string =>
	match(breakpoints)
		.with({ xxl: true }, () => 'xxl')
		.with({ xxl: false, xl: true }, () => 'xl')
		.with({ xl: false, lg: true }, () => 'lg')
		.with({ lg: false, md: true }, () => 'md')
		.with({ md: false, sm: true }, () => 'sm')
		.otherwise(() => 'xs');

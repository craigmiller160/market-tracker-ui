import { Breakpoint as AntdBreakpoint } from 'antd/es/_util/responsiveObserve';
import * as P from 'fp-ts/es6/Predicate';

export type Breakpoints = Partial<Record<AntdBreakpoint, boolean>>;

export const isDesktop: P.Predicate<Breakpoints> = (_) => _.lg ?? false;

export const isMobile: P.Predicate<Breakpoints> = (_) => !(_.lg ?? false);

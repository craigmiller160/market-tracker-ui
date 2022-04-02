import { useRefreshTimer } from './useRefreshTimer';
import { RefreshTimerContextValue } from './RefreshTimerContext';
import { PropsWithChildren } from 'react';
import { RefreshTimerContext } from './RefreshTimerContext';

export const RefreshProvider = (props: PropsWithChildren<object>) => {
	const timestamp = useRefreshTimer();
	const value: RefreshTimerContextValue = {
		refreshTimestamp: timestamp
	};
	return (
		<RefreshTimerContext.Provider value={value}>
			{props.children}
		</RefreshTimerContext.Provider>
	);
};

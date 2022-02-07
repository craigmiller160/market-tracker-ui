export type TradierClockState = 'premarket' | 'open' | 'postmarket' | 'closed';

export interface TradierClock {
	readonly clock: {
		readonly date: string;
		readonly state: TradierClockState;
	};
}

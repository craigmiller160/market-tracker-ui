export interface HistoryDate {
	readonly date: string;
	readonly type: 'open' | 'close';
	readonly price: number;
}

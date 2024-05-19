import type { SharesOwnedResponse } from '../../../../src/types/generated/market-tracker-portfolio-service';
import type {
	AggregateCurrentSharesOwnedResponse,
	AggregateSharesOwnedHistoryResponse
} from '../../../../src/services/PortfolioAggregateService';

export const vtiCurrent: SharesOwnedResponse = {
	date: '2024-05-18',
	totalShares: 290.409
};

export const vxusCurrent: SharesOwnedResponse = {
	date: '2024-05-18',
	totalShares: 272.599
};

export const vtiTodayHistory: ReadonlyArray<SharesOwnedResponse> = [
	{ date: '2024-05-18', totalShares: 290.409 }
];

export const vxusTodayHistory: ReadonlyArray<SharesOwnedResponse> = [
	{ date: '2024-05-18', totalShares: 272.599 }
];

export const vtiOneWeekHistory: ReadonlyArray<SharesOwnedResponse> = [
	{
		date: '2024-05-11',
		totalShares: 290.409
	},
	{
		date: '2024-05-12',
		totalShares: 290.409
	},
	{
		date: '2024-05-13',
		totalShares: 290.409
	},
	{
		date: '2024-05-14',
		totalShares: 290.409
	},
	{
		date: '2024-05-15',
		totalShares: 290.409
	},
	{
		date: '2024-05-16',
		totalShares: 290.409
	},
	{
		date: '2024-05-17',
		totalShares: 290.409
	},
	{
		date: '2024-05-18',
		totalShares: 290.409
	}
];

export const vxusOneWeekHistory: ReadonlyArray<SharesOwnedResponse> = [
	{
		date: '2024-05-11',
		totalShares: 272.599
	},
	{
		date: '2024-05-12',
		totalShares: 272.599
	},
	{
		date: '2024-05-13',
		totalShares: 272.599
	},
	{
		date: '2024-05-14',
		totalShares: 272.599
	},
	{
		date: '2024-05-15',
		totalShares: 272.599
	},
	{
		date: '2024-05-16',
		totalShares: 272.599
	},
	{
		date: '2024-05-17',
		totalShares: 272.599
	},
	{
		date: '2024-05-18',
		totalShares: 272.599
	}
];

export const aggregateCurrent: AggregateCurrentSharesOwnedResponse = {
	VTI: vtiCurrent,
	VXUS: vxusCurrent
};

export const aggregateTodayHistory: AggregateSharesOwnedHistoryResponse = {
	VTI: vtiTodayHistory,
	VXUS: vxusTodayHistory
};

export const aggregateOneWeekHistory: AggregateSharesOwnedHistoryResponse = {
	VTI: vtiOneWeekHistory,
	VXUS: vxusOneWeekHistory
};

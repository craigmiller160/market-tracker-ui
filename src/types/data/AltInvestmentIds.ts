import * as ioType from 'io-ts';

export const altInvestmentIdsV = ioType.readonly(
	ioType.record(ioType.string, ioType.string)
);
export type AltInvestmentIds = ioType.TypeOf<typeof altInvestmentIdsV>;

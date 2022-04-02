export const SEARCH_TYPE_STOCK = 'Stock';
export const SEARCH_TYPE_CRYPTO = 'Crypto';
export type SEARCH_TYPE = typeof SEARCH_TYPE_STOCK | typeof SEARCH_TYPE_CRYPTO;

export interface SearchValues {
	readonly searchType: string;
	readonly symbol: string;
}

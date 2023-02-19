/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
/* Everything here was copied from the axios-mock-adapter type definitions, they're just not exported */
export interface AsymmetricMatcher {
	asymmetricMatch: Function;
}

export interface RequestDataMatcher {
	[index: string]: any;
	params?: {
		[index: string]: any;
	};
}

export type AsymmetricRequestDataMatcher =
	| AsymmetricMatcher
	| RequestDataMatcher;

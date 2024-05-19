export type PortfolioResponse = {
    readonly id: string;
    readonly name: string;
    readonly stockSymbols: ReadonlyArray<string>;
};

export type SharesOwnedResponse = {
    readonly date: string;
    readonly totalShares: number;
};

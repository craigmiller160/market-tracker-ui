import Chainable = Cypress.Chainable;

export const repeat = <T>(
	times: number,
	fn: (index: number) => Chainable<T>
): Chainable<unknown> =>
	cy
		.wrap([...new Array(times).keys()])
		.each((_, index) => fn(index)) as Chainable<unknown>;

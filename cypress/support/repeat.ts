import Chainable = Cypress.Chainable;

export const repeat = (
	times: number,
	fn: (index: number) => void
): Chainable<unknown> =>
	cy
		.wrap([...new Array(times).keys()])
		.each((_, index) => fn(index)) as Chainable<unknown>;

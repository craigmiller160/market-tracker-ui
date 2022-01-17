export const sleep = (millis: number): Promise<void> =>
	new Promise((resolve) => setTimeout(resolve, millis));

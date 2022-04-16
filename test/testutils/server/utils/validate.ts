import { Response } from 'miragejs';

export const validationError = (message: string): Response => {
	console.error(message);
	return new Response(400, {}, 'Request Validation Failed');
};

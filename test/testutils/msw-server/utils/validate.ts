import { HttpResponse } from 'msw';

export const validationError = (message: string) => {
	console.error(message);
	return HttpResponse.text('Request Validation Failed', {
		status: 400
	});
};

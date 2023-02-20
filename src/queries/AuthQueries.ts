import { useQuery } from '@tanstack/react-query';
import { getAuthUser } from '../services/AuthService';

export const GET_AUTH_USER_KEY = 'AuthQueries_GetAuthUser';

export const useGetAuthUser = () =>
	useQuery({
		queryKey: [GET_AUTH_USER_KEY],
		queryFn: getAuthUser
	});

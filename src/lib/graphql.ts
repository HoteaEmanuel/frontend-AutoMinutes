import { api } from './axios';
import { useAuthStore } from '@/features/auth/stores/auth.store';

interface GraphQLResponse<TData> {
  data?: TData;
  errors?: { message: string; extensions?: { code?: string } }[];
}

const isAuthError = <TData>(body: GraphQLResponse<TData>) =>
  body.errors?.some(
    (error) => error.message === 'Unauthorized' || error.extensions?.code === 'UNAUTHENTICATED',
  );

export const gqlRequest = async <TData, TVariables extends object = object>(
  query: string,
  variables?: TVariables,
): Promise<TData> => {
  const { data: body } = await api.post<GraphQLResponse<TData>>('/graphql', {
    query,
    variables,
  });

  if (isAuthError(body)) {
    try {
      const { data } = await api.post('/auth/refresh');
      useAuthStore.getState().setSession({ accessToken: data.accessToken, user: data.user });

      const { data: retryBody } = await api.post<GraphQLResponse<TData>>('/graphql', {
        query,
        variables,
      });

      if (retryBody.errors?.length) throw new Error(retryBody.errors[0].message);
      if (!retryBody.data) throw new Error('Something went wrong');

      return retryBody.data;
    } catch (error) {
      useAuthStore.getState().clearSession();
      throw error;
    }
  }

  if (body.errors?.length) throw new Error(body.errors[0].message);
  if (!body.data) throw new Error('Something went wrong');

  return body.data;
};

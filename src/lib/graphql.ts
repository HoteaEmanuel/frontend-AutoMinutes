import { api } from './axios';
import { useAuthStore } from '@/features/auth/stores/auth.store';

interface GraphQLError {
  message: string;
  extensions?: { code?: string; originalError?: { message?: string | string[] } };
}

interface GraphQLResponse<TData> {
  data?: TData;
  errors?: GraphQLError[];
}

const isAuthError = <TData>(body: GraphQLResponse<TData>) =>
  body.errors?.some(
    (error) => error.message === 'Unauthorized' || error.extensions?.code === 'UNAUTHENTICATED',
  );

// Nest wraps class-validator failures in a generic "Bad Request Exception"
// top-level message, the real per-field message(s) end up in extensions.originalError.
const getGraphQLErrorMessage = (error: GraphQLError): string => {
  const originalMessage = error.extensions?.originalError?.message;
  if (Array.isArray(originalMessage) && originalMessage.length > 0) return originalMessage[0];
  if (typeof originalMessage === 'string') return originalMessage;
  return error.message;
};

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

      if (retryBody.errors?.length) throw new Error(getGraphQLErrorMessage(retryBody.errors[0]));
      if (!retryBody.data) throw new Error('Something went wrong');

      return retryBody.data;
    } catch (error) {
      useAuthStore.getState().clearSession();
      throw error;
    }
  }

  if (body.errors?.length) throw new Error(getGraphQLErrorMessage(body.errors[0]));
  if (!body.data) throw new Error('Something went wrong');

  return body.data;
};

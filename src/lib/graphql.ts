import { api } from './axios';

interface GraphQLResponse<TData> {
  data?: TData;
  errors?: { message: string }[];
}

export const gqlRequest = async <TData, TVariables extends object = object>(
  query: string,
  variables?: TVariables,
): Promise<TData> => {
  const { data: body } = await api.post<GraphQLResponse<TData>>('/graphql', {
    query,
    variables,
  });
  if (body.errors?.length) throw new Error(body.errors[0].message);
  if (!body.data) throw new Error('Something went wrong');

  return body.data;
};

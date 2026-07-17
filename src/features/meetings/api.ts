import { gqlRequest } from '@/lib/graphql';
import { PaginatedMeetingsDto, Query } from '@/gql/types';

const FIND_USER_MEETINGS = `
  query FindUserMeetings($input: PaginatedMeetingsDto!) {
    findUserMeetings(input: $input) {
    totalCount,
    meetings {
      title
      description
      status
      scheduledAt
      createdAt
      updatedAt
}
    }
  }
`;

export const fetchUserMeetings = async (input: PaginatedMeetingsDto) => {
  if (input.status === '') input.status = undefined;
  const data = await gqlRequest<Pick<Query, 'findUserMeetings'>>(FIND_USER_MEETINGS, {
    input: input,
  });
  return data.findUserMeetings;
};

const FIND_ALL_MEETINGS = `
query FindAll {
findAll {
      id
      title
      description
      status
      scheduledAt
      createdAt
      updatedAt
    }
  }`;

export const fetchAllMeetings = async () => {
  const data = await gqlRequest<Pick<Query, 'findAll'>>(FIND_ALL_MEETINGS);
  return data.findAll;
};

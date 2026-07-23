import { gqlRequest } from '@/lib/graphql';
import { Query } from '@/gql/types';

const GET_ATTENDEES = `
  query GetAttendees($meetingId: String!) {
    getAttendees(meetingId: $meetingId) {
      id
      name
      email
    }
  }
`;

export const fetchAttendees = async (meetingId: string) => {
  const data = await gqlRequest<Pick<Query, 'getAttendees'>>(GET_ATTENDEES, { meetingId });
  return data.getAttendees;
};

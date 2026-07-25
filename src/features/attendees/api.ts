import { gqlRequest } from '@/lib/graphql';
import { Query } from '@/gql/types';

const FIND_ATTENDEES = `
query ($meetingId: String!){
  getAttendees(meetingId: $meetingId) {
    name
    role
    aiGenerated
    email
    userId
  }
}
`;

export const findAttendess = async (meetingId: string) => {
  const data = await gqlRequest<Pick<Query, 'getAttendees'>>(FIND_ATTENDEES, {
    meetingId: meetingId,
  });
  return data.getAttendees;
};

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

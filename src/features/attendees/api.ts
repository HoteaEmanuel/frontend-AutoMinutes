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

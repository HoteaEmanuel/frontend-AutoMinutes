import { gqlRequest } from '@/lib/graphql';
import { AddAttendeeDto, DeleteAttendeeDto, Mutation, Query, UpdateAttendeeDto } from '@/gql/types';

const ATTENDEE_FIELDS = `
  id
  name
  email
  meetingId
  role
  aiGenerated
  userId
`;

const GET_ATTENDEES = `
  query GetAttendees($meetingId: String!) {
    getAttendees(meetingId: $meetingId) {
      ${ATTENDEE_FIELDS}
    }
  }
`;

export const fetchAttendees = async (meetingId: string) => {
  const data = await gqlRequest<Pick<Query, 'getAttendees'>>(GET_ATTENDEES, { meetingId });
  return data.getAttendees;
};

const ADD_ATTENDEE = `
  mutation AddAttendee($addAttendeeDto: addAttendeeDto!) {
    addAttendee(addAttendeeDto: $addAttendeeDto) {
      ${ATTENDEE_FIELDS}
    }
  }
`;

export const addAttendee = async (input: AddAttendeeDto) => {
  const data = await gqlRequest<Pick<Mutation, 'addAttendee'>>(ADD_ATTENDEE, {
    addAttendeeDto: input,
  });
  return data.addAttendee;
};

const UPDATE_ATTENDEE = `
  mutation UpdateAttendee($updateAttendeeDto: updateAttendeeDto!) {
    updateAttendee(updateAttendeeDto: $updateAttendeeDto) {
      ${ATTENDEE_FIELDS}
    }
  }
`;

export const updateAttendee = async (input: UpdateAttendeeDto) => {
  const data = await gqlRequest<Pick<Mutation, 'updateAttendee'>>(UPDATE_ATTENDEE, {
    updateAttendeeDto: input,
  });
  return data.updateAttendee;
};

const DELETE_ATTENDEE = `
  mutation DeleteAttendee($deleteAttendeeDto: deleteAttendeeDto!) {
    deleteAttendee(deleteAttendeeDto: $deleteAttendeeDto) {
      id
      meetingId
    }
  }
`;

export const deleteAttendee = async (input: DeleteAttendeeDto) => {
  const data = await gqlRequest<Pick<Mutation, 'deleteAttendee'>>(DELETE_ATTENDEE, {
    deleteAttendeeDto: input,
  });
  return data.deleteAttendee;
};
